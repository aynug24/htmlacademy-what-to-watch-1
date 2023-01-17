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
import {Genre} from '../../types/genre.type.js';
import HttpError from '../../common/errors/http-error.js';
import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {RequestArgumentType} from '../../types/request-argument-type.type.js';

type AnyRecord = Record<string, unknown>;
type StringRecord = Record<string, string>;

@injectable()
export default class MovieController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateMovieDto)]
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
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
    {body}: Request<AnyRecord, AnyRecord, CreateMovieDto>,
    res: Response): Promise<void> {

    const movie = await this.movieService.create(body);
    this.created(res, fillDTO(MovieResponse, movie));
  }

  public async update(
    {body, params}: Request<StringRecord, AnyRecord, UpdateMovieDto>, // ну нехорошо route parameters пихать в Record<string, ...>
    res: Response): Promise<void> {

    const movieId = params.movieId;
    const movie = await this.movieService.updateById(movieId, body); // todo 404
    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id=${movieId} not found`);
    }
    this.ok(res, fillDTO(MovieResponse, movie));
  }

  public async delete(
    {params}: Request<StringRecord>,
    res: Response): Promise<void> {

    const movieId = params.movieId;
    const deletedMovie = await this.movieService.deleteById(movieId);
    if (!deletedMovie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id=${movieId} not found`);
    }
    this.noContent(res, 'Deleted!');
  }

  public async index({query}: Request<AnyRecord, AnyRecord, AnyRecord, { genre?: Genre, limit?: number }>,
    res: Response): Promise<void> {

    let movies: DocumentType<MovieEntity>[];
    if (query.genre) {
      movies = await this.movieService.findByGenre(query.genre, query.limit);
    } else {
      movies = await this.movieService.findNew(query.limit);
    }
    this.ok(res, fillDTO(MovieSummaryResponse, movies));
  }

  public async get({params}: Request<StringRecord>, res: Response): Promise<void> {
    const movieId = params.movieId;
    const movie = await this.movieService.findById(movieId);
    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id=${movieId} not found`);
    }
    this.ok(res, fillDTO(MovieResponse, movie));
  }
}
