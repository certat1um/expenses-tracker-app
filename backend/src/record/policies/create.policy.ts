import {
  ExpressMiddlewareInterface,
  UnauthorizedError,
} from 'routing-controllers';
import { Service } from 'typedi';
import { ExtendedRequest } from '../../_common/interfaces/interfaces';
import { Response } from 'express';

@Service()
export class CreatePolicy implements ExpressMiddlewareInterface {
  async use(
    req: ExtendedRequest,
    res: Response,
    next: (err?: Error) => Promise<void>,
  ): Promise<void> {
    const userId = req.user?.id;

    if (!userId || userId !== req.body?.userId) {
      throw new UnauthorizedError(`Record's owner dismatch`);
    }

    await next();
  }
}
