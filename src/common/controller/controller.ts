import {injectable} from 'inversify';
import {Response, Router} from 'express';
import {StatusCodes} from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import {ILogger} from '../logger/logger.interface.js';
import {IRoute} from '../../types/route.interface.js';
import {IController} from './controller.interface.js';
import {IConfig} from '../config/config.interface.js';
import {getFullServerPath, transformObject} from '../../utils/common.js';
import {STATIC_RESOURCE_FIELDS} from '../../app/application.contants.js';

@injectable()
export abstract class Controller implements IController {
  private readonly _router: Router;

  constructor(
    protected readonly logger: ILogger,
    protected readonly configService: IConfig
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: IRoute) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map(
      (middleware) => asyncHandler(middleware.execute.bind(middleware))
    );

    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);

    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  protected addStaticPath(data: Record<string, unknown>): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}${this.configService.get('STATIC_DIRECTORY_PATH')}`,
      `${fullServerPath}${this.configService.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(Object(data));
    res.type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
