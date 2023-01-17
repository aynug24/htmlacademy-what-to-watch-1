import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {inject} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import HttpError from '../../common/errors/http-error.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {IMovieService} from '../movie/movie-service.interface.js';
import {ICommentService} from './comment-service.interface.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import CommentResponse from './response/comment.response.js';
import {DocumentExistsMiddleware} from '../../middlewares/document-exists.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {RequestArgumentType} from '../../types/request-argument-type.type.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {fillDTO} from '../../utils/common.js';

export default class CommentController extends Controller {
  constructor(@inject(Component.ILogger) logger: ILogger,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
    @inject(Component.IMovieService) private readonly movieService: IMovieService) {
    super(logger);

    this.logger.info('Register routes for CommentController.');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Query, name: 'movieId'}),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Query, name: 'movieId'}),
        new DocumentExistsMiddleware(
          this.movieService,
          'Movie',
          {where: RequestArgumentType.Query, name: 'movieId'}
        ),
      ]
    });
  }

  public async create({body, query}: Request<object, object, CreateCommentDto, {movieId?: string}>, res: Response): Promise<void> {
    const movieId = query.movieId ?? '';
    if (!await this.movieService.exists(movieId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${body.movieId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create(body);
    this.created(res, fillDTO(CommentResponse, comment));
  }

  async get({query}: Request<unknown, unknown, unknown, {movieId?: string}>, res: Response): Promise<void> {
    const movieId = query.movieId ?? '';
    const comments = await this.commentService.findByMovieId(movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
