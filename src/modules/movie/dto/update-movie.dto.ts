import {Genre} from '../../../types/genre.type.js';
import {Expose} from 'class-transformer';

export default class UpdateMovieDto {
  @Expose()
  title?: string;

  @Expose()
  description?: string;

  @Expose()
  postDate?: Date;

  @Expose()
  genre?: Genre;

  @Expose()
  releaseYear?: number;

  @Expose()
  previewUri?: string;

  @Expose()
  videoUri?: string;

  @Expose()
  cast?: string[];

  director?: string;

  @Expose()
  runningLengthMin?: number;

  @Expose()
  posterUri?: string;

  @Expose()
  backgroundImageUri?: string;

  @Expose()
  backgroundColor?: string;
}
