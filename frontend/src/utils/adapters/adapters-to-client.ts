import CommentDto from '../../dto/comment/comment.dto';
import MovieSummaryResponse from '../../dto/movie/movie-summary.response.js';
import MovieResponse from '../../dto/movie/movie.response.js';
import UserDto from '../../dto/user/user.dto';
import {Film, FilmListItem} from '../../types/film';
import {Review} from '../../types/review';
import {User} from '../../types/user';

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  avatarUrl: user.profilePictureUri,
  email: user.email,
  token: user.token || ''
});

export const adaptMovieToClient = (movie: MovieResponse): Film => ({
  id: movie.id,
  name: movie.title,
  posterImage: movie.posterUri,
  backgroundImage: movie.backgroundImageUri,
  backgroundColor: movie.backgroundColor,
  videoLink: movie.videoUri,
  previewVideoLink: movie.previewUri,
  description: movie.description,
  rating: movie.rating,
  director: movie.director,
  starring: movie.cast,
  runTime: movie.runningLengthMin,
  genre: movie.genre,
  released: movie.releaseYear,
  isFavorite: false,
  user: adaptUserToClient(movie.postedByUser)
});

export const adaptMovieListItemToClient = (movie: MovieSummaryResponse): FilmListItem => ({
  id: movie.id,
  name: movie.title,
  genre: movie.genre,
  released: movie.postDate,
  user: adaptUserToClient(movie.postedByUser),
  posterImage: movie.posterUri,
  previewVideoLink: movie.previewUri
});

export const adaptCommentToClient = (comment: CommentDto): Review => ({
  comment: comment.text,
  rating: comment.score,
  id: comment.id,
  date: comment.postDate,
  user: {
    name: comment.user.name
  }
});
