import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {IMovieService} from './movie-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import MovieResponse from './response/movie.response.js';
import {fillDTO} from '../../utils/common.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import MovieSummaryResponse from './response/movie-summary.response.js';
import {Genre, isGenre} from '../../types/genre.type.js';
import HttpError from '../../common/errors/http-error.js';
import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {RequestArgumentType} from '../../types/request-argument-type.type.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {IUserService} from '../user/user-service.interface.js';

type AnyRecord = Record<string, unknown>;
type StringRecord = Record<string, string>;

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
    @inject(Component.IUserService) private readonly userService: IUserService,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateDtoMiddleware(CreateMovieDto)
      ]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Path, name: 'movieId'}),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(
          this.movieService,
          'Movie',
          {where: RequestArgumentType.Path, name: 'movieId'}
        )]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Delete,
      handler: this.delete, middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Path, name: 'movieId'}),
        new DocumentExistsMiddleware(
          this.movieService,
          'Movie',
          {where: RequestArgumentType.Path, name: 'movieId'}
        )]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Path, name: 'movieId'}),
        new DocumentExistsMiddleware(
          this.movieService,
          'Movie',
          {where: RequestArgumentType.Path, name: 'movieId'}
        )]
    });
  }

  public async create(
    {body, user}: Request<AnyRecord, AnyRecord, CreateMovieDto>,
    res: Response): Promise<void> {

    const result = await this.movieService.create(body, user.id);
    const movie = await this.movieService.findById(result.id);
    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async update(
    {body, params, user}: Request<StringRecord, AnyRecord, UpdateMovieDto>, // todo ну нехорошо route parameters пихать в Record<string, ...>
    res: Response): Promise<void> {

    const movieId = params.movieId;
    const movie = await this.movieService.findById(movieId);
    if (movie?.postedByUser?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User ${user.id} can't edit movie posted by ${movie?.postedByUser?.id}.`,
        'MovieController'
      );
    }
    const result = await this.movieService.updateById(movieId, body);
    this.ok(res, fillDTO(MovieResponse, result));
  }

  public async delete(
    {params, user}: Request<StringRecord>,
    res: Response): Promise<void> {

    const movie = await this.movieService.findById(params.movieId);
    if (movie?.postedByUser?.id !== user.id) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User ${user.id} can't delete movie posted by user ${movie?.postedByUser?.id}`,
        'MovieController'
      );
    }
    await this.movieService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Фильм успешно удален.'});
  }

  public async index(
    {query}: Request<AnyRecord, AnyRecord, AnyRecord, { genre?: Genre, limit?: string }>,
    res: Response
  ): Promise<void> {
    const limit = query.limit ? parseInt(query.limit, 10) : undefined;

    let movies: DocumentType<MovieEntity>[];
    if (query.genre) {
      if (!isGenre(query.genre)) {
        throw new HttpError(
          StatusCodes.BAD_REQUEST,
          `Unknown genre ${query.genre}.`,
          'getGenre'
        );
      }
      movies = await this.movieService.findByGenre(query.genre, limit);
    } else {
      movies = await this.movieService.findNew(limit);
    }
    this.ok(res, fillDTO(MovieSummaryResponse, movies));
  }

  public async get({params}: Request<StringRecord>, res: Response): Promise<void> {
    const movieId = params.movieId;
    const movie = await this.movieService.findById(movieId);
    this.ok(res, fillDTO(MovieResponse, movie));
  }
}
