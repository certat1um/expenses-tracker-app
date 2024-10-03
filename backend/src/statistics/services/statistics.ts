import { Inject, Service } from 'typedi';
import {
  IStatisticsCategoriesInfo,
  IStatisticsLinearDiagram,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { StatisticsRepository } from '../repositories/statistics';

@Service()
export class StatisticsService {
  @Inject() private statisticsRepository: StatisticsRepository;

  public async radialDiagram(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsCategoriesInfo> {
    return this.statisticsRepository.radialDiagram(userId, options);
  }

  public async recordsList(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    return this.statisticsRepository.recordsList(userId, options);
  }

  public async linearDiagram(
    userId: string,
    options: IStatisticsRequestOptions,
  ): Promise<IStatisticsLinearDiagram> {
    return this.statisticsRepository.linearDiagram(userId, options);
  }
}
