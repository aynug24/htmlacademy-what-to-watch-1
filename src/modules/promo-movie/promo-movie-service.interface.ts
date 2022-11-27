import {MovieEntity} from '../movie/movie.entity.js';
import {DocumentType} from '@typegoose/typegoose';

export interface IPromoMovieService {
  find(): Promise<DocumentType<MovieEntity> | null>;
}
