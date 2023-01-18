import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {ICommentService} from './comment-service.interface.js';
import {Component} from '../../types/component.types.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';
import {MAX_COMMENTS_PER_RESPONSE} from './comment.constant.js';
import {IMovieRatingService} from '../movie/movie-rating-service.interface.js';

@injectable()
export default class CommentService implements ICommentService {

  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.IMovieRatingService) private readonly movieRatingService: IMovieRatingService
  ) {
  }

  public async create(dto: CreateCommentDto, userId: string): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, userId});

    await this.movieRatingService.updateMovieRating(dto.movieId, dto.score);
    await this.movieRatingService.incrementCommentsCount(dto.movieId);

    return comment.populate('userId');
  }

  public async findByMovieId(movieId: string): Promise<DocumentType<CommentEntity>[]> {
    const comments = await this.commentModel
      .find({movieId})
      .sort({createdAt: -1})
      .limit(MAX_COMMENTS_PER_RESPONSE);

    return this.commentModel.populate(comments, 'userId');
  }

  public async deleteByMovieId(movieId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({movieId})
      .exec();

    return result.deletedCount;
  }
}
