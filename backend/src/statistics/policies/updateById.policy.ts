import { ExpressMiddlewareInterface, UnauthorizedError } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { ExtendedRequest } from '../../_common/interfaces/interfaces';
import { Response } from 'express';
import { RecordService } from '../services/statistics';

@Service()
export class UpdateByIdPolicy implements ExpressMiddlewareInterface {
  @Inject() private recordService: RecordService;

  async use(
    req: ExtendedRequest,
    res: Response,
    next: (err?: Error) => Promise<void>,
  ): Promise<void> {
    const userId = req.user?.id;
    const record = await this.recordService.findById(req.params.id);

    if (record.userId !== userId) {
      throw new UnauthorizedError(`Record's owner dismatch`);
    }

    await next();
  }
}
