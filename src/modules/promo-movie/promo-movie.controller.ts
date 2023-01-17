import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {StatusCodes} from 'http-status-codes';
import {fillDTO} from '../../utils/common.js';
import HttpError from '../../common/errors/http-error.js';
import {IPromoMovieService} from './promo-movie-service.interface.js';
import MovieResponse from '../movie/response/movie.response.js';
import {IConfig} from '../../common/config/config.interface.js';

@injectable()
export default class PromoMovieController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) configService: IConfig,
    @inject(Component.IPromoMovieService) private readonly promoMovieService: IPromoMovieService,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for PromoMovieController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.get});
  }

  public async get(_req: Request, res: Response): Promise<void> {
    const promoMovie = await this.promoMovieService.find();
    if (!promoMovie) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Promo movie not found');
    }

    this.ok(res, fillDTO(MovieResponse, promoMovie));
  }
}
