import { Inject, Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import {
  IRecord,
  IRecordGroup,
  IRecordGroupsByCategories,
  IRecordRequestOptions,
} from '../interfaces/record';
import { CategoryRepository } from '../../category/repositories/category';

@Service()
export class RecordRepository {
  @Inject() private categoryRepository: CategoryRepository;

  private record = prisma.record;

  public async findById(id: string): Promise<IRecord> {
    return this.record.findFirst({ where: { id } });
  }

  public async findByUser(userId: string): Promise<IRecord[]> {
    return this.record.findMany({ where: { userId } });
  }

  public async findByMonth(
    userId: string,
    options: IRecordRequestOptions,
  ): Promise<IRecordGroupsByCategories> {
    const { gte, lte } = options.filters.createdAt;

    const records = await this.record.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(gte), lte: new Date(lte) },
      },
    });

    return this.groupIncomesAndExpensesByCategories(records);
  }

  public async create(data: IRecord): Promise<IRecord> {
    return this.record.create({ data });
  }

  public async updateById(id: string, data: Partial<IRecord>): Promise<IRecord> {
    return this.record.update({ data, where: { id } });
  }

  public async deleteById(id: string): Promise<IRecord> {
    return this.record.delete({ where: { id } });
  }

  private async groupIncomesAndExpensesByCategories(
    records: IRecord[],
  ): Promise<IRecordGroupsByCategories> {
    const uniqueCategoryIds = [...new Set(records.map((r) => r.categoryId))];
    const categories = await this.categoryRepository.findByIds(uniqueCategoryIds);
    const groupedRecords = {
      incomes: [] as IRecordGroup[],
      expenses: [] as IRecordGroup[],
    };

    categories.forEach((c) => {
      const recordsByCategory = records.filter((r) => r.categoryId === c.id);

      ['income', 'expense'].forEach((type) => {
        const filteredRecords = recordsByCategory.filter((r) => r.type === type);

        if (filteredRecords.length) {
          groupedRecords[`${type}s`].push({
            categoryId: c.id,
            categoryName: c.name,
            records: filteredRecords,
          });
        }
      });
    });

    return groupedRecords;
  }
}
