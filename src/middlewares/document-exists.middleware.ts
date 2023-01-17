import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';
import {IMiddleware} from '../types/middleware.interface.js';
import {IDocumentExists} from '../types/document-exists.interface.js';
import {RequestArgument} from '../types/request-argument.type.js';
import {getRequestArgument} from '../utils/request.js';

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(private readonly service: IDocumentExists,
    private readonly entityName: string,
    private readonly documentParam: RequestArgument) {
  }

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = getRequestArgument(req, this.documentParam);

    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware'
      );
    }

    next();
  }
}
