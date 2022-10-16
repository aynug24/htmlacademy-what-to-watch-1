import { FormatterInterface } from './formatter.interface.js';
import {Movie} from '../../types/movie.type.js';

export default class TsvMovieFormatter implements FormatterInterface<Movie> {
  public format(movie: Movie): string {

    const fields = [
      movie.title,
      movie.description,
      movie.postDate.toISOString().split('T')[0],
      movie.genre,
      movie.releaseYear.toString(),
      movie.rating.toString(),
      movie.previewUri,
      movie.videoUri,
      movie.cast.join(';'),
      movie.director,
      movie.runningLengthMin.toString(),
      movie.postedByUser.name,
      movie.postedByUser.email,
      movie.postedByUser.profilePictureUri ?? '',
      movie.postedByUser.password,
      movie.posterUri,
      movie.backgroundImageUri,
      movie.backgroundColor
    ];

    if (fields.some((field) => field.includes('\t'))) {
      throw new Error(`Cannot save movie with tab in its fields to .tsv format: ${movie}`);
    }

    return fields.join('\t');
  }
}
