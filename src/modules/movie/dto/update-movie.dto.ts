import {Genre} from '../../../types/genre.type.js';

export default class UpdateMovieDto {
  title?: string;
  description?: string;
  postDate?: Date;
  genre?: Genre;
  releaseYear?: number;
  previewUri?: string;
  videoUri?: string;
  cast?: string[];
  director?: string;
  runningLengthMin?: number;
  posterUri?: string;
  backgroundImageUri?: string;
  backgroundColor?: string;
}
