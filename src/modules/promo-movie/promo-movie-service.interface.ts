import {MovieEntity} from '../movie/movie.entity.js';
import {DocumentType} from '@typegoose/typegoose';
import {PromoMovieEntity} from './promo-movie.entity.js';

export interface IPromoMovieService {
  find(): Promise<MovieEntity | null>;
  set(movieId: string): Promise<DocumentType<PromoMovieEntity>>
}
