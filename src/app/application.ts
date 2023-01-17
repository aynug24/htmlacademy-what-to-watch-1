import {ILogger} from '../common/logger/logger.interface.js';
import {IConfig} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.types.js';
import {IDatabase} from '../common/database-client/database.interface.js';
import {getURI} from '../utils/db.js';
import {IController} from '../common/controller/controller.interface.js';
import express, {Express} from 'express';
import {IExceptionFilter} from '../common/errors/exception-filter.interface.js';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.IConfig) private config: IConfig,
    @inject(Component.IDatabase) private databaseClient: IDatabase,
    @inject(Component.IExceptionFilter) private exceptionFilter: IExceptionFilter,
    @inject(Component.MovieController) private movieController: IController,
    @inject(Component.MoviesToWatchModel) private moviesToWatchController: IController,
    @inject(Component.PromoMovieController) private promoMovieController: IController,
    @inject(Component.UserController) private userController: IController,
    @inject(Component.CommentController) private commentController: IController,
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {
    this.expressApp.use('/movies', this.movieController.router);
    this.expressApp.use('/movies-to-watch', this.moviesToWatchController.router);
    this.expressApp.use('/promo-movie', this.promoMovieController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  public initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  public initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);

    this.initMiddleware();
    this.registerRoutes();
    this.initExceptionFilters();
    this.expressApp.listen(this.config.get('PORT'));
    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
