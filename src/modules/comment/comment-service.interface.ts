import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import {CommentEntity} from './comment.entity.js';
import CreateCommentDto from './dto/create-comment.dto.js';

export interface ICommentService {
  create(dto: CreateCommentDto, userId: string): Promise<DocumentType<CommentEntity>>;
  findByMovieId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByMovieId(offerId: string): Promise<number | null>;
}
