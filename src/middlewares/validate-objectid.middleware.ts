import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import mongoose from 'mongoose';
import HttpError from '../common/errors/http-error.js';
import {RequestArgument} from '../types/request-argument.type.js';
import {IMiddleware} from '../types/middleware.interface.js';
import {getRequestArgument} from '../utils/request.js';

const {Types} = mongoose;

export class ValidateObjectIdMiddleware implements IMiddleware {
  constructor(private objectIdArgument: RequestArgument) {
  }

  public execute(req: Request, _res: Response, next: NextFunction): void {
    const objectId = getRequestArgument(req, this.objectIdArgument);

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(
      StatusCodes.BAD_REQUEST,
      `${objectId} is invalid ObjectID`,
      'ValidateObjectIdMiddleware'
    );
  }
}
