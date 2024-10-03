import { Inject, Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import {
  IStatisticsCategoriesInfo,
  IStatisticsLinearDiagram,
  IStatisticsRecordsInSections,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { CategoryRepository } from '../../category/repositories/category';
import { IRecord } from '../../record/interfaces/record';

@Service()
export class StatisticsRepository {
  @Inject() private categoryRepository: CategoryRepository;

  private record = prisma.record;

  public async radialDiagram(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsCategoriesInfo> {
    const { gte, lte } = options.filters.createdAt;
    const records = await this.record.findMany({
      where: {
        ...options.filters,
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
    const { gte, lte } = filters.createdAt;

    const records = await this.record.findMany({
      where: {
        categoryId: filters?.categoryId,
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
      skip: (pagination?.cur_page - 1) * pagination?.page_size,
      take: pagination?.page_size,
      orderBy: sort,
    });

    return this.groupByDay(records);
  }

  public async linearDiagram(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsLinearDiagram> {
    const { gte, lte } = options.filters.createdAt;
    const records = await this.record.findMany({
      where: {
        ...options.filters,
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
    });

    const groupedByDays = this.groupByDay(records);
    const recordsInSections = await this.divideInSections(groupedByDays);
    const totalAmount = recordsInSections.map((r) => r.sum).reduce((acc, next) => acc + next, 0);
    const averageAmount = totalAmount / recordsInSections.length;

    return {
      totalAmount,
      averageAmount,
      prevMonthDiff: 0,
      recordsInSections,
    };
  }

  private async groupByCategories(records: IRecord[]): Promise<IStatisticsCategoriesInfo> {
    const uniqueCategoryIds = [...new Set(records.map((r) => r.categoryId))];
    const categories = await this.categoryRepository.findByIds(uniqueCategoryIds);
    const groupedRecords = {
      totalAmount: 0,
      categories: [],
    } as IStatisticsCategoriesInfo;

    categories.forEach((c) => {
      const recordsByCategory = records.filter((r) => r.categoryId === c.id);
      const totalCategoryAmount = recordsByCategory
        .map((r) => Number(r.value))
        .reduce((acc, next) => acc + next, 0);

      groupedRecords.totalAmount += totalCategoryAmount;
      groupedRecords.categories.push({
        categoryId: c.id,
        categoryName: c.name,
        categoryPercentage: 0,
        recordsCount: recordsByCategory.length,
        totalAmount: totalCategoryAmount,
      });
    });

    return groupedRecords;
  }

  private async divideInSections(
    records: IStatisticsRecordsList,
    sectorsAmount = 6,
  ): Promise<IStatisticsRecordsInSections[]> {
    const dates = Object.keys(records);
    const sectors = [];

    dates.forEach((date, index) => {
      const sectorIndex = index % sectorsAmount;

      if (!sectors[sectorIndex]) {
        sectors[sectorIndex] = {
          from: date,
          to: date,
          sum: 0,
        };
      } else {
        sectors[sectorIndex].to = date;
      }

      sectors[sectorIndex].sum += records[date]
        .map((r) => Number(r.value))
        .reduce((acc, next) => acc + next, 0);
    });

    return sectors;
  }

  private groupByDay(records: IRecord[]): IStatisticsRecordsList {
    const recordsByDays = {};

    records.forEach((r) => {
      const dateRange = new Date(r.createdAt).toISOString().slice(0, 10);
      if (!Array.isArray(recordsByDays[dateRange])) {
        recordsByDays[dateRange] = [];
      }

      recordsByDays[dateRange].push(r);
    });

    return recordsByDays;
  }
}
