import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';

export interface IMovieRatingService {
  incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateMovieRating(movieId: string, newScore: number): Promise<DocumentType<MovieEntity> | null>;
}
