import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';
import {IUserService} from '../modules/user/user-service.interface';
import {IMiddleware} from '../types/middleware.interface.js';

export class PrivateRouteMiddleware implements IMiddleware {
  constructor(private readonly userService: IUserService) {}

  async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'PrivateRouteMiddleware'
      );
    } else {
      const user = await this.userService.findById(req.user.id);
      if (!user) {
        throw new HttpError(
          StatusCodes.UNAUTHORIZED,
          'Unauthorized',
          'PrivateRouteMiddleware'
        );
      }
    }
    return next();
  }
}
