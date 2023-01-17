import {Expose, Type} from 'class-transformer';
import {Genre} from '../../../types/genre.type.js';
import UserResponse from '../../user/response/user.response.js';

export default class MovieSummaryResponse {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public previewUri!: string;

  @Expose()
  @Type(() => UserResponse)
  public postedByUser!: UserResponse;

  @Expose()
  public posterUri!: string;

  @Expose()
  public commentCount?: number;
}
