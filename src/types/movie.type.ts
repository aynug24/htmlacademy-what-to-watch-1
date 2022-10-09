import {Genre} from './genre.type.js';
import {User} from './user.type.js';


export type Movie = {
  title: string,
  description: string,
  postDate: Date,
  genre: Genre,
  releaseYear: number,
  rating: number,
  previewUri: string,
  videoUri: string,
  cast: string[],
  director: string,
  runningLengthMin: number,

  commentCount?: number,
  postedByUser: User,
  posterUri: string,
  backgroundImageUri: string
  backgroundColor: string
}
