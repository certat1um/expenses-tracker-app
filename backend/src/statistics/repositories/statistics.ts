import { Inject, Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import {
  IStatisticsCategories,
  IStatisticsCategoriesByType,
  IStatisticsCategoriesInfo,
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
        ...options.filters,
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
    });

    return options.filters?.type
      ? this.groupByCategories(records, options.filters.type)
      : this.groupByCategoriesAndTypes(records);
  }

  public async recordsList(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    const { filters } = options;
    const records = await this.record.findMany({
      where: {
        ...options.filters,
        userId,
        ...(filters.createdAt && {
          createdAt: { gte: new Date(filters.createdAt.gte), lte: new Date(filters.createdAt.lte) },
        }),
      },
    });

    return this.groupByDay(records);
  }

  public async recordsDividedBySections(
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
          records: [],
        };
      } else {
        sectors[sectorIndex].to = date;
      }

      sectors[sectorIndex].records.push(...records[date]);
    });

    sectors.forEach((s) => {
      s.sum = s.records
        .map((r: IRecord) => Number(r.value))
        .reduce((acc: number, next: number) => acc + next, 0);
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

  private async groupByCategories(
    records: IRecord[],
    type: IRecord['type'],
  ): Promise<IStatisticsCategoriesByType> {
    const uniqueCategoryIds = [...new Set(records.map((r) => r.categoryId))];
    const categories = await this.categoryRepository.findByIds(uniqueCategoryIds);
    const groupedRecords = {
      totalAmount: 0,
      categories: [],
    } as IStatisticsCategoriesByType;

    categories.forEach((c) => {
      const recordsByCategory = records.filter((r) => r.categoryId === c.id);
      const filteredRecords = recordsByCategory.filter((r) => r.type === type);

      if (filteredRecords.length) {
        let totalCategoryAmount = 0;
        filteredRecords.forEach((r) => (totalCategoryAmount += Number(r.value)));

        groupedRecords.totalAmount += totalCategoryAmount;
        groupedRecords.categories.push({
          categoryId: c.id,
          categoryName: c.name,
          totalAmount: totalCategoryAmount,
        });
      }
    });

    return groupedRecords;
  }

  private async groupByCategoriesAndTypes(records: IRecord[]): Promise<IStatisticsCategoriesInfo> {
    const uniqueCategoryIds = [...new Set(records.map((r) => r.categoryId))];
    const categories = await this.categoryRepository.findByIds(uniqueCategoryIds);
    const groupedRecords = {
      incomes: {
        totalAmount: 0,
        categories: [],
      },
      expenses: {
        totalAmount: 0,
        categories: [],
      },
    } as IStatisticsCategoriesInfo;

    categories.forEach((c) => {
      const recordsByCategory = records.filter((r) => r.categoryId === c.id);

      ['income', 'expense'].forEach((type) => {
        const filteredRecords = recordsByCategory.filter((r) => r.type === type);

        if (filteredRecords.length) {
          let totalCategoryAmount = 0;
          filteredRecords.forEach((r) => {
            totalCategoryAmount += Number(r.value);

            if (type === 'income') {
              groupedRecords.incomes.totalAmount += Number(r.value);
            } else if (type === 'expense') {
              groupedRecords.expenses.totalAmount += Number(r.value);
            }
          });

          groupedRecords[`${type}s`].categories.push({
            categoryId: c.id,
            categoryName: c.name,
            totalAmount: totalCategoryAmount,
          });
        }
      });
    });

    return groupedRecords;
  }
}
