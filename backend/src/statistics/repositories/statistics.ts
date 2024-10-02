import { Inject, Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import {
  IStatisticsCategories,
  IStatisticsCategoriesByType,
  IStatisticsRecordsBySections,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { CategoryRepository } from '../../category/repositories/category';
import { IRecord } from '../../record/interfaces/record';

@Service()
export class StatisticsRepository {
  @Inject() private categoryRepository: CategoryRepository;

  private record = prisma.record;

  public async categoriesInfo(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsCategories> {
    const { gte, lte } = options.filters.createdAt;

    const records = await this.record.findMany({
      where: {
        type: options.filters.type,
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
    });

    return this.groupByCategories(records);
  }

  public async recordsList(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    const { filters, pagination, sort } = options;

    const records = await this.record.findMany({
      where: {
        ...filters,
        userId,
        ...(filters.createdAt && {
          createdAt: { gte: new Date(filters.createdAt.gte), lte: new Date(filters.createdAt.lte) },
        }),
      },
      skip: (pagination?.cur_page - 1) * pagination?.page_size,
      take: pagination?.page_size,
      orderBy: sort,
    });

    return this.groupByDay(records);
  }

  public async recordsBySections(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsBySections[]> {
    const { gte, lte } = options.filters.createdAt;
    const records = await this.record.findMany({
      where: {
        ...options.filters,
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
    });

    const groupedByDays = await this.groupByDay(records);
    return this.divideInSections(groupedByDays);
  }

  private async divideInSections(
    records: IStatisticsRecordsList,
    sectorCount = 6,
  ): Promise<IStatisticsRecordsBySections[]> {
    const dates = Object.keys(records);
    const sectors = [];

    dates.forEach((date, index) => {
      const sectorIndex = index % sectorCount;

      if (!sectors[sectorIndex]) {
        sectors[sectorIndex] = {
          from: date,
          to: date,
          sum: 0,
          recordsCount: 0,
        };
      } else {
        sectors[sectorIndex].to = date;
      }

      sectors[sectorIndex].sum += records[date]
        .map((r) => Number(r.value))
        .reduce((acc, next) => acc + next, 0);

      sectors[sectorIndex].recordsCount += records[date].length;
    });

    return sectors;
  }

  private async groupByDay(records: IRecord[]): Promise<IStatisticsRecordsList> {
    const filteredDates = [
      ...new Set(records.map((r) => new Date(r.createdAt).toISOString().slice(0, 10))),
    ];
    const groupedRecordsByDays = {};

    filteredDates.forEach((date) => {
      records.forEach((r) => {
        if (new Date(r.createdAt).toISOString().slice(0, 10) === date) {
          if (!Array.isArray(groupedRecordsByDays[date])) {
            groupedRecordsByDays[date] = [];
          }
          groupedRecordsByDays[date].push(r);
        }
      });
    });
    return groupedRecordsByDays;
  }

  private async groupByCategories(records: IRecord[]): Promise<IStatisticsCategoriesByType> {
    const uniqueCategoryIds = [...new Set(records.map((r) => r.categoryId))];
    const categories = await this.categoryRepository.findByIds(uniqueCategoryIds);
    const groupedRecords = {
      totalAmount: 0,
      categories: [],
    } as IStatisticsCategoriesByType;

    categories.forEach((c) => {
      const recordsByCategory = records.filter((r) => r.categoryId === c.id);

      const totalCategoryAmount = recordsByCategory
        .map((r) => Number(r.value))
        .reduce((acc, next) => acc + next, 0);

      groupedRecords.totalAmount += totalCategoryAmount;
      groupedRecords.categories.push({
        categoryId: c.id,
        categoryName: c.name,
        totalAmount: totalCategoryAmount,
      });
    });

    return groupedRecords;
  }
}
