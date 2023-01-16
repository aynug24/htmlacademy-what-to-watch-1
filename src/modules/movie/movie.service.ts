import {inject, injectable} from 'inversify';
import {IMovieService} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {DEFAULT_MOVIE_COUNT} from './movie.constant.js';
import {SortType} from '../../types/sort-type.enum.js';
import {Genre} from '../../types/genre.type.js';
import {ICommentService} from '../comment/comment-service.interface.js';

@injectable()
export default class MovieService implements IMovieService {
  constructor(
    @inject(Component.ILogger) private readonly logger: ILogger,
    @inject(Component.MovieModel) private readonly MovieModel: types.ModelType<MovieEntity>,
    @inject(Component.ICommentService) private readonly commentService: ICommentService
  ) {
  }

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.MovieModel.create(dto);
    this.logger.info(`New Movie created: ${dto.title}`);

    return result;
  }

  public async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.MovieModel.findById(movieId).exec();
  }

  public async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    return this.MovieModel
      .findByIdAndUpdate(movieId, dto, {new: true})
      .populate('postedByUser')
      .exec();
  }

  public async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {

    await this.commentService.deleteByMovieId(movieId); // todo удалять из moviesToWatch?

    return this.MovieModel
      .findByIdAndDelete(movieId)
      .exec();
  }

  public async findNew(count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.MovieModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let: {movieId: '$_id'},
            pipeline: [
              {$match: {$movieId: '$$movieId'}},
              {$project: {rating: 1}}
            ],
            as: 'comments'
          },
        },
        {
          $addFields: {
            commentCount: {$size: '$comments'},
            rating: {$avg: '$comments.rating'}
          }
        },
        {$unset: 'comments'},
        {$limit: limit},
        {$sort: {offerCount: SortType.Down}}
      ])
      .sort({createdAt: SortType.Down})
      .limit(limit)
      .exec();
  }

  public async findByGenre(genre: Genre, count?: number): Promise<DocumentType<MovieEntity>[]> {
    const limit = count ?? DEFAULT_MOVIE_COUNT;
    return this.MovieModel
      .find({genre}, {}, {limit})
      .populate('postedByUser')
      .exec();
  }

  public async exists(movieId: string): Promise<boolean> {
    return (await this.MovieModel
      .exists({_id: movieId})) !== null;
  }
}
