import {Genre} from '../../../types/genre.type.js';

export default class CreateMovieDto {
  title!: string;
  description!: string;
  postDate!: Date;
  genre!: Genre;
  releaseYear!: number;
  rating!: number;
  previewUri!: string;
  videoUri!: string;
  cast!: string[];
  director!: string;
  runningLengthMin!: number;
  postedByUser!: string;
  posterUri!: string;
  backgroundImageUri!: string;
  backgroundColor!: string;
}
