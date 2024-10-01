import { Service } from 'typedi';
import { prisma } from '../../../prisma/prisma';
import { IRecord } from '../interfaces/record';

@Service()
export class RecordRepository {
  private record = prisma.record;

  public async findById(id: string): Promise<IRecord> {
    return this.record.findFirst({ where: { id } });
  }

  public async findByUser(userId: string): Promise<IRecord[]> {
    return this.record.findMany({ where: { userId } });
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
}
