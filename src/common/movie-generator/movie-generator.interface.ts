import {Movie} from '../../types/movie.type.js';

export interface IMovieGenerator {
  generate(): Movie;
}
