import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {fillDTO} from '../../utils/common.js';
import {IMoviesToWatchService} from './movies-to-watch.interface.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {IUserService} from '../user/user-service.interface.js';
import {IConfig} from '../../common/config/config.interface.js';
import MovieResponse from '../movie/response/movie.response.js';

@injectable()
export default class MoviesToWatchController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) configService: IConfig,
    @inject(Component.IMoviesToWatchService) private readonly moviesToWatchService: IMoviesToWatchService,
    @inject(Component.IUserService) private readonly userService: IUserService
  ) {
    super(logger, configService);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [new PrivateRouteMiddleware(this.userService)]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.add,
      middlewares: [new PrivateRouteMiddleware(this.userService)]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new PrivateRouteMiddleware(this.userService)]
    });
  }

  public async get({user}: Request, res: Response): Promise<void> {
    const moviesToWatch = await this.moviesToWatchService.find(user.id);
    if (!moviesToWatch) {
      throw new Error(`Couldn't find movies to watch for user ${user.id}`);
    }

    this.ok(res, fillDTO(MovieResponse, moviesToWatch.movies));
  }

  public async add({
    body,
    user
  }: Request<Record<string, unknown>, Record<string, unknown>, { movieId: string }>, res: Response): Promise<void> {
    await this.moviesToWatchService.add(user.id, body.movieId);
    this.ok(res, {message: 'Added movie to to-watch list'});
  }

  public async delete({
    body,
    user
  }: Request<Record<string, unknown>, Record<string, unknown>, { movieId: string }>, res: Response): Promise<void> {

    const moviesToWatch = await this.moviesToWatchService.delete(user.id, body.movieId);
    if (!moviesToWatch) {
      throw new Error(`Couldn't find movies to watch for user ${user.id}`);
    }

    this.noContent(res, {message: 'Deleted user\'s to-watch movies'});
  }
}
