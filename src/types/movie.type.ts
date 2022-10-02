import {Genre} from './genre.type.js';
import {Uri} from './uri.type.js';
import {User} from './user.type.js';


export type Movie = {
  title: string,
  description: string,
  postDate: Date,
  genre: Genre,
  releaseYear: number,
  rating: number,
  preview: Uri,
  video: Uri,
  cast: string[],
  director: string,
  runningLengthMin: number,

  commentCount?: number,
  postedByUser: User,
  poster: Uri,
  backgroundImage: Uri
  backgroundColor: string
}
