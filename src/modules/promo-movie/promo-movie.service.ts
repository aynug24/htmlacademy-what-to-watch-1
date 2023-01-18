import {inject, injectable} from 'inversify';
import {IPromoMovieService} from './promo-movie-service.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {PromoMovieEntity} from './promo-movie.entity.js';
import {Component} from '../../types/component.types.js';
import {MovieEntity} from '../movie/movie.entity.js';
import {IMovieService} from '../movie/movie-service.interface.js';

@injectable()
export default class PromoMovieService implements IPromoMovieService {
  constructor(
    @inject(Component.PromoMovieModel) private readonly promoMovieModel: types.ModelType<PromoMovieEntity>,
    @inject(Component.IMovieService) private readonly movieService: IMovieService
  ) {
  }

  public async find(): Promise<DocumentType<MovieEntity> | null> {
    const promoMovie: PromoMovieEntity | null = await this.promoMovieModel.findOne();
    if (!promoMovie) {
      return null;
    }
    const movieId = promoMovie.movie;
    if (!movieId) {
      return null;
    }

    return await this.movieService.findById(movieId.toString());
  }

  public async set(movieId: string): Promise<DocumentType<PromoMovieEntity>> {
    return this.promoMovieModel
      .findOneAndUpdate({}, {movie: movieId}, {new: true, upsert: true});
  }
}
