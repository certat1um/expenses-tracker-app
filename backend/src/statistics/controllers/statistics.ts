import { Body, JsonController, Post, Req } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import {
  IStatisticsCategoriesInfo,
  IStatisticsLinearDiagram,
  IStatisticsRecordsList,
  IStatisticsRequestOptions,
} from '../interfaces/statistics';
import { ExtendedRequest } from '../../_common/interfaces/interfaces';
import { StatisticsService } from '../services/statistics';

@Service()
@JsonController('/statistics')
export class StatisticsController {
  @Inject() private statisticsService: StatisticsService;

  @Post('/radial-diagram')
  public async categoriesInfo(@Body() options: any): Promise<IStatisticsCategoriesInfo> {
    return this.statisticsService.radialDiagram(options.userId, options);
  }

  @Post('/records-list')
  public async recordsList(
    @Req() req: ExtendedRequest,
    @Body() options: IStatisticsRequestOptions,
  ): Promise<IStatisticsRecordsList> {
    const userId = req.user.id;
    return this.statisticsService.recordsList(userId, options);
  }

  @Post('/linear-diagram')
  public async recordsBySections(
    @Req() req: ExtendedRequest,
    @Body() options: IStatisticsRequestOptions,
  ): Promise<IStatisticsLinearDiagram> {
    const userId = req.user.id;
    return this.statisticsService.linearDiagram(userId, options);
  }
}
