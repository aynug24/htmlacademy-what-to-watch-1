import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {IMovieRatingService} from './movie-rating-service.interface.js';

@injectable()
export default class MovieRatingService implements IMovieRatingService {
  constructor(
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
  ) {
  }

  public async incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, {$inc: {commentsCount: 1}});
  }

  public async updateMovieRating(movieId: string, newScore: number): Promise<DocumentType<MovieEntity> | null> {
    const oldRatingData = await this.movieModel.findById(movieId).select('rating commentsCount');
    const [oldRating, oldCommentsCount] = [oldRatingData?.['rating'] ?? 0, oldRatingData?.['commentsCount'] ?? 0];

    const newRating = (oldRating * oldCommentsCount + newScore) / (oldCommentsCount + 1);

    return this.movieModel.findByIdAndUpdate(movieId, {rating: newRating});
  }
}
