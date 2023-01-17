import {inject, injectable} from 'inversify';
import {IMovieService} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DEFAULT_MOVIE_COUNT} from './movie.constant.js';
import {Genre} from '../../types/genre.type.js';
import {ICommentService} from '../comment/comment-service.interface.js';

@injectable()
export default class MovieService implements IMovieService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>,
    @inject(Component.ICommentService) private readonly commentService: ICommentService,
  ) {
  }

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.movieModel.create(dto);
    this.logger.info(`New Movie created: ${dto.title}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findById(movieId).populate('postedByUser');
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, dto, {new: true}).populate('postedByUser');
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {

    await this.commentService.deleteByMovieId(movieId); // todo удалять из moviesToWatch?

    return this.movieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async findNew(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    const movies = await this.movieModel.aggregate([
      {$addFields: {id: {$toString: '$_id'}}},
      {$sort: {publishingDate: 1}},
      {$limit: limit}
    ]);
    return this.movieModel.populate(movies, 'postedByUser');
  }

  public async findByGenre(genre: Genre, count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;

    const movies = await this.movieModel.aggregate([
      {$match: {genre}},
      {$addFields: {id: {$toString: '$_id'}}},
      {$sort: {publishingDate: 1}},
      {$limit: limit}
    ]);
    return this.movieModel.populate(movies, 'postedByUser');
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


  public async exists(movieId: string): Promise<boolean> {
    return (await this.movieModel.exists({_id: movieId})) !== null;
  }
}
