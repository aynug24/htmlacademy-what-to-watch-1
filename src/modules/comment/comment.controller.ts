import {Request, Response} from 'express';
import {inject} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
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
import {IUserService} from '../user/user-service.interface.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import {IConfig} from '../../common/config/config.interface.js';

export default class CommentController extends Controller {
  constructor(@inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) configService: IConfig,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
    @inject(Component.IMovieService) private readonly movieService: IMovieService,
    @inject(Component.IUserService) private readonly userService: IUserService) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController.');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Body, name: 'movieId'}),
        new DocumentExistsMiddleware(
          this.movieService,
          'movie',
          {where: RequestArgumentType.Body, name: 'movieId'}
        ),
        new ValidateDtoMiddleware(CreateCommentDto)
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.find,
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

  public async create(
    {body, user}: Request<object, object, CreateCommentDto, { movieId?: string }>,
    res: Response
  ): Promise<void> {
    const comment = await this.commentService.create(body, user.id);
    this.created(res, fillDTO(CommentResponse, comment));
  }

  public async find({query}: Request<unknown, unknown, unknown, { movieId?: string }>, res: Response): Promise<void> {
    const movieId = query.movieId ?? '';
    const comments = await this.commentService.findByMovieId(movieId);
    this.ok(res, fillDTO(CommentResponse, comments));
  }
}
