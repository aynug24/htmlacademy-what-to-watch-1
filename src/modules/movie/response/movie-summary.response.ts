import {Expose} from 'class-transformer';
import {Genre} from '../../../types/genre.type.js';

export default class MovieSummaryResponse {
  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public genre!: Genre;

  @Expose()
  public previewUri!: string;

  @Expose()
  public postedByUser!: string;

  @Expose()
  public posterUri!: string;

  @Expose()
  public commentCount?: number;
}
