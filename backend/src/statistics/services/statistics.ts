import { Inject, Service } from 'typedi';
import {
  IStatisticsCategories,
  IStatisticsRecordsBySections,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { StatisticsRepository } from '../repositories/statistics';

@Service()
export class StatisticsService {
  @Inject() private statisticsRepository: StatisticsRepository;

  public async categoriesInfo(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsCategories> {
    return this.statisticsRepository.categoriesInfo(userId, options);
  }

  public async recordsList(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    return this.statisticsRepository.recordsList(userId, options);
  }

  public async recordsBySections(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsBySections[]> {
    return this.statisticsRepository.recordsBySections(userId, options);
  }
}
