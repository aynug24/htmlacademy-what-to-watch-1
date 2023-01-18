import {MovieEntity} from '../movie/movie.entity.js';

export interface IPromoMovieService {
  find(): Promise<MovieEntity | null>;
}
