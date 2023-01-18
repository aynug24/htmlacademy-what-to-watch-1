import {Genre} from '../../../types/genre.type.js';
import {Expose} from 'class-transformer';

export default class UpdateMovieDto {
  @Expose()
  public title?: string;

  @Expose()
  public description?: string;

  @Expose()
  public postDate?: Date;

  @Expose()
  public genre?: Genre;

  @Expose()
  public releaseYear?: number;

  @Expose()
  public previewUri?: string;

  @Expose()
  public videoUri?: string;

  @Expose()
  public cast?: string[];

  @Expose()
  public director?: string;

  @Expose()
  public runningLengthMin?: number;

  @Expose()
  public posterUri?: string;

  @Expose()
  public backgroundImageUri?: string;

  @Expose()
  public backgroundColor?: string;
}
