import { Body, JsonController, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import {
  IStatisticsCategories,
  IStatisticsRecordsBySections,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { ExtendedRequest } from '../../_common/interfaces/interfaces';
import { StatisticsService } from '../services/statistics';

@Service()
@JsonController('/statistics')
export class StatisticsController {
  @Inject() private statisticsService: StatisticsService;

  @Post('/categories-info')
  public async categoriesInfo(
    @Req() req: ExtendedRequest,
    @Body() options: IStatisticsRequestOptions,
  ): Promise<IStatisticsCategories> {
    const userId = req.user.id;
    return this.statisticsService.categoriesInfo(userId, options);
  }

  @Post('/records-list')
  public async recordsList(
    @Req() req: ExtendedRequest,
    @Body() options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    const userId = req.user.id;
    return this.statisticsService.recordsList(userId, options);
  }

  @Post('/records-by-sections')
  public async recordsBySections(
    @Req() req: ExtendedRequest,
    @Body() options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsBySections[]> {
    const userId = req.user.id;
    return this.statisticsService.recordsBySections(userId, options);
  }
}
