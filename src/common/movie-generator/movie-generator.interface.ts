import {Movie} from '../../types/movie.type.js';

export interface MovieGeneratorInterface {
  generate(): Movie;
}
