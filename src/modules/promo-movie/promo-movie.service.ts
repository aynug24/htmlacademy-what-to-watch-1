import {inject, injectable} from 'inversify';
import {IPromoMovieService} from './promo-movie-service.interface.js';
import {DocumentType, isDocument, types} from '@typegoose/typegoose';
import {PromoMovieEntity} from './promo-movie.entity.js';
import {Component} from '../../types/component.types.js';
import {MovieEntity} from '../movie/movie.entity.js';

@injectable()
export default class PromoMovieService implements IPromoMovieService {
  constructor(
    @inject(Component.PromoMovieModel) private readonly promoMovieModel: types.ModelType<PromoMovieEntity>,
  ) {
  }

  public async find(): Promise<DocumentType<MovieEntity> | null> {
    const promoMovie = await this.promoMovieModel
      .findOne()
      .populate<{movie: MovieEntity}>('movie') // todo мб фигня
      .exec();

    if (!promoMovie || !isDocument(promoMovie.movie)) {
      return null;
    }

    return promoMovie.movie;
  }
}
