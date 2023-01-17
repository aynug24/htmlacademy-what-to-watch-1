import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import {IMoviesToWatchService} from './movies-to-watch.interface.js';
import MovieSummaryResponse from '../movie/response/movie-summary.response.js';

type AnyRecord = Record<string, unknown>;

@injectable()
export default class MoviesToWatchController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IMoviesToWatchService) private readonly moviesToWatchService: IMoviesToWatchService,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.get});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.add});
    this.addRoute({path: '/', method: HttpMethod.Delete, handler: this.delete});
  }

  public async get(_req: Request, res: Response): Promise<void> {
    const userId = '0'; // todo from token
    const moviesToWatch = await this.moviesToWatchService.find(userId);
    if (!moviesToWatch) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Todo: what\'s not found?');
    }

    this.ok(res, fillDTO(MovieSummaryResponse, moviesToWatch.movies));
  }

  public async add({body}: Request<AnyRecord, AnyRecord, string>, res: Response): Promise<void> {
    const movieId = body;
    const userId = '0';

    const moviesToWatch = await this.moviesToWatchService.add(userId, movieId);
    if (!moviesToWatch) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Couldn't find user with id=${userId} or movie with id=${movieId}`);
    }

    this.ok(res, fillDTO(MovieSummaryResponse, moviesToWatch.movies));
  }

  public async delete({body}: Request<AnyRecord, AnyRecord, string>, res: Response): Promise<void> {
    const movieId = body;
    const userId = '0';

    const moviesToWatch = await this.moviesToWatchService.delete(userId, movieId);
    if (!moviesToWatch) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Couldn't find user with id=${userId} or movies with id=${movieId}`);
    }
    this.noContent(res, fillDTO(MovieSummaryResponse, moviesToWatch.movies));
  }
}
