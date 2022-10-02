import ParserInterface from './parser.interface.js';
import {Movie} from '../../types/movie.type.js';
import {asGenre} from '../../types/genre.type.js';

export class MovieTsvParser implements ParserInterface<Movie> {
  parse(s: string): Movie {
    const fields = s.split('\t');
    if (fields.length !== 17) {
      throw new Error(`Found ${fields.length} fields in movie entry, expected 17: ${s}`);
    }

    const [
      title,
      description,
      postDate,
      genre,
      releaseYear,
      rating,
      preview,
      video,
      cast,
      director,
      runningLengthMin,
      postedByUserName,
      postedByUserEmail,
      postedByUserPassword, // wtf
      poster,
      backgroundImage,
      backgroundColor
    ] = fields;

    return {
      title,
      description,
      postDate: new Date(postDate),
      genre: asGenre(genre),
      releaseYear: +releaseYear,
      rating: +rating,
      preview,
      video,
      cast: cast.split(';'),
      director,
      runningLengthMin: +runningLengthMin,
      postedByUser: {
        name: postedByUserName,
        email: postedByUserEmail,
        password: postedByUserPassword // wtf
      },
      poster,
      backgroundImage,
      backgroundColor
    };
  }
}
