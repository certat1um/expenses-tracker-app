import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { Response } from 'express';
import { ExtendedRequest } from '../interfaces/interfaces';
import { AuthService } from '../../auth/services/auth';

@Service()
@Middleware({ type: 'before' })
export class JwtAuthMiddleware implements ExpressMiddlewareInterface {
  @Inject() private authService: AuthService;

  async use(
    req: ExtendedRequest,
    res: Response,
    next: (err?: Error) => Promise<void>,
  ): Promise<void> {
    const token = req.headers['authorization'];

    if (token) {
      const userId = this.authService.getJwtPayload(token)?.id;
      req.user = { id: userId };
    }

    await next();
  }
}
