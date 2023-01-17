import {Genre} from '../../../types/genre.type.js';
import {Expose, Type} from 'class-transformer';
import UserResponse from '../../user/response/user.response.js';

export default class MovieResponse {
  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public releaseYear!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewUri!: string;

  @Expose()
  public videoUri!: string;

  @Expose()
  public cast!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public runningLengthMin!: number;

  @Expose()
  public commentCount!: number;

  @Expose()
  @Type(() => UserResponse)
  public postedByUser!: UserResponse;

  @Expose()
  public posterUri!: string;

  @Expose()
  public backgroundImageUri!: string;

  @Expose()
  public backgroundColor!: string;

  @Expose()
  public commentsCount!: number;
}
