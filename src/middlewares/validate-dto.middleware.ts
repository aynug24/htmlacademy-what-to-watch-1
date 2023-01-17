import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import {validate} from 'class-validator';
import {NextFunction, Request, Response} from 'express';
import {IMiddleware} from '../types/middleware.interface.js';
import {transformErrors} from '../utils/common.js';
import ValidationError from '../common/errors/validation-error.js';

export class ValidateDtoMiddleware implements IMiddleware {
  constructor(private readonly dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
