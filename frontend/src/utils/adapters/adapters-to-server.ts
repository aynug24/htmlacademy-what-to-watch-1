import CreateCommentDto from '../../dto/comment/create-comment.dto';
import CreateMovieDto from '../../dto/movie/create-movie.dto';
import MovieResponse from '../../dto/movie/movie.response.js';
import UserDto from '../../dto/user/user.dto';
import {Film} from '../../types/film';
import {NewFilm} from '../../types/new-film';
import {NewReview} from '../../types/new-review';
import {User} from '../../types/user';

export const adaptFilmToServer = (film: Film): MovieResponse => ({
  title: film.name,
  description: film.description,
  backgroundImageUri: film.backgroundImage,
  posterUri: film.posterImage,
  backgroundColor: film.backgroundColor,
  cast: film.starring,
  director: film.director,
  runningLengthMin: film.runTime,
  genre: film.genre,
  videoUri: film.videoLink,
  previewUri: film.previewVideoLink,
  postDate: new Date().getTime(),
  releaseYear: film.released,
  postedByUser: adaptUserToServer(film.user),
  rating: film.rating,
  id: film.id
});

export const adaptUserToServer = (user: User): UserDto => ({
  name: user.name,
  email: user.email,
  profilePictureUri: user.avatarUrl,
  token: user.token
});

export const adaptNewFilmToServer = (newFilm: NewFilm): CreateMovieDto => ({
  title: newFilm.name,
  description: newFilm.description,
  backgroundImageUri: newFilm.backgroundImage,
  posterUri: newFilm.posterImage,
  backgroundColor: newFilm.backgroundColor,
  cast: newFilm.starring,
  director: newFilm.director,
  runningLengthMin: newFilm.runTime,
  genre: newFilm.genre,
  videoUri: newFilm.videoLink,
  previewUri: newFilm.previewVideoLink,
  postDate: new Date(),
  releaseYear: newFilm.released
});

export const adaptNewReviewToServer = (newReview: NewReview, movieId: string): CreateCommentDto => ({
  movieId,
  score: newReview.rating,
  text: newReview.comment
});

export const adaptAvatarToServer = (file: File) => {
  const formData = new FormData();
  formData.set('profilePicture', file);

  return formData;
};
