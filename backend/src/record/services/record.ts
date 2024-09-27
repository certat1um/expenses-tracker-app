import { Inject, Service } from 'typedi';
import { RecordRepository } from '../repositories/record';
import { IRecord } from '../interfaces/record';
import { NotFoundError } from 'routing-controllers';

@Service()
export class RecordService {
  @Inject() private recordRepository: RecordRepository;

  public async findById(id: string): Promise<IRecord> {
    const record = await this.recordRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Record for this user not found.');
    }
    return record;
  }

  public async findByUser(userId: string): Promise<IRecord[]> {
    return this.recordRepository.findByUser(userId);
  }

  public async create(data: IRecord): Promise<IRecord> {
    return this.recordRepository.create(data);
  }

  public async updateById(
    id: string,
    data: Partial<IRecord>,
  ): Promise<IRecord> {
    return this.recordRepository.updateById(id, data);
  }

  public async deleteById(id: string): Promise<IRecord> {
    return this.recordRepository.deleteById(id);
  }
}
