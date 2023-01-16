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

    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.delete});
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.get});
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

    if (query.genre) {
      const res1 = await this.movieService.findByGenre(query.genre, query.limit);
      this.ok(res, fillDTO(MovieSummaryResponse, res1));
    } else {
      const res1 = await this.movieService.findNew(query.limit);
      this.ok(res, fillDTO(MovieSummaryResponse, res1));
    }
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
