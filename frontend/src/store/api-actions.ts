import {createAsyncThunk} from '@reduxjs/toolkit';
import {AxiosInstance} from 'axios';
import {toast} from 'react-toastify';
import {APIRoute, AuthorizationStatus, DEFAULT_GENRE, NameSpace,} from '../const';
import CommentDto from '../dto/comment/comment.dto';
import MovieSummaryResponse from '../dto/movie/movie-summary.response.js';
import MovieResponse from '../dto/movie/movie.response.js';
import UserDto from '../dto/user/user.dto';
import {dropToken, saveToken} from '../services/token';
import {AuthData} from '../types/auth-data';
import {Film} from '../types/film';
import {NewFilm} from '../types/new-film';
import {NewReview} from '../types/new-review';
import {NewUser} from '../types/new-user';
import {AppDispatch, State} from '../types/state';
import {Token} from '../types/token';
import {
  adaptCommentToClient,
  adaptMovieListItemToClient,
  adaptMovieToClient,
  adaptUserToClient
} from '../utils/adapters/adapters-to-client';
import {
  adaptAvatarToServer,
  adaptFilmToServer,
  adaptNewFilmToServer,
  adaptNewReviewToServer
} from '../utils/adapters/adapters-to-server';
import {setFavoriteFilms, setLoading as setFavoriteFilmsIsLoading,} from './favorite-films-data/favorite-films-data';
import {setActiveFilm, setLoading as setFilmIsLoading,} from './film-data/film-data';
import {setFilm, setFilms, setLoading as setFilmsIsLoading,} from './films-data/films-data';
import {setFilmsByGenre, setLoading as setFilmsByGenreIsLoading,} from './genre-data/genre-data';
import {setLoading as setPromoFilmIsLoading, setPromoFilm,} from './promo-data/promo-data';
import {setLoading as setReviewsIsLoading, setReviews,} from './reviews-data/reviews-data';
import {setLoading as setSimilarFilmsIsLoading, setSimilarFilms,} from './similar-films-data/similar-films-data';
import {setAuthorizationStatus, setUser} from './user-data/user-data';
import {HttpMethod} from '../types/http-method.enum';

type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: AxiosInstance;
};

export const fetchFilms = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Films}/fetchFilms`,
  async (_arg, {dispatch, extra: api}) => {
    dispatch(setFilmsIsLoading(true));
    try {
      const {data} = await api.get<MovieSummaryResponse[]>(APIRoute.Films);
      const films = data.map((film: MovieSummaryResponse) => adaptMovieListItemToClient(film));
      dispatch(setFilms(films));
    } catch (error) {
      dispatch(setFilms([]));
      toast.error('Can\'t fetch films');
    } finally {
      dispatch(setFilmsIsLoading(false));
    }
  }
);

export const fetchFilmsByGenre = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  `${NameSpace.Genre}/fetchFilmsByGenre`,
  async (genre, {dispatch, extra: api}) => {
    dispatch(setFilmsByGenreIsLoading(true));
    try {
      let route = `${APIRoute.Films}?genre=${genre}`;
      if (genre === DEFAULT_GENRE) {
        route = APIRoute.Films;
      }
      const {data} = await api.get<MovieSummaryResponse[]>(route);
      dispatch(setFilmsByGenre(data.map((movieListItem) => adaptMovieListItemToClient(movieListItem))));
    } catch (error) {
      dispatch(setFilmsByGenre([]));
      toast.error('Can\'t fetch films by genre');
    } finally {
      dispatch(setFilmsByGenreIsLoading(false));
    }
  }
);

export const fetchFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/fetchFilm`,
  async (id, {dispatch, extra: api}) => {
    dispatch(setFilmIsLoading(true));
    try {
      const {data} = await api.get<MovieResponse>(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(adaptMovieToClient(data)));
    } catch (error) {
      dispatch(setActiveFilm(null));
      toast.error('Can\'t fetch film');
    } finally {
      dispatch(setFilmIsLoading(false));
    }
  }
);

export const editFilm = createAsyncThunk<void, Film, AsyncThunkConfig>(
  `${NameSpace.Film}/editFilm`,
  async (filmData, {dispatch, extra: api}) => {
    try {
      const {data} = await api.patch<MovieResponse>(
        `${APIRoute.Films}/${filmData.id}`,
        adaptFilmToServer(filmData)
      );
      dispatch(setActiveFilm(adaptMovieToClient(data)));
    } catch {
      throw new Error('Can\'t edit film');
    }
  }
);

export const addFilm = createAsyncThunk<void, NewFilm, AsyncThunkConfig>(
  `${NameSpace.Film}/addFilm`,
  async (filmData, {dispatch, extra: api}) => {
    try {
      const {data} = await api.post<MovieResponse>(`${APIRoute.Films}`, adaptNewFilmToServer(filmData));
      dispatch(setActiveFilm(adaptMovieToClient(data)));
    } catch (error) {
      throw new Error('Can\'t add film');
    }
  }
);

export const deleteFilm = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Film}/deleteFilm`,
  async (id, {dispatch, extra: api}) => {
    try {
      await api.delete(`${APIRoute.Films}/${id}`);
      dispatch(setActiveFilm(null));
    } catch {
      throw new Error('Can\'t delete film');
    }
  }
);

export const fetchSimilarFilms = createAsyncThunk<
  void,
  string,
  AsyncThunkConfig
>(
  `${NameSpace.SimilarFilms}/fetchSimilarFilms`,
  async (id, {dispatch, extra: api}) => {
    dispatch(setSimilarFilmsIsLoading(true));
    try {
      const {data} = await api.get<Film[]>(
        `${APIRoute.Films}/${id}${APIRoute.Similar}`
      );
      dispatch(setSimilarFilms(data));
    } catch (error) {
      dispatch(setSimilarFilms([]));
      toast.error('Can\'t fetch similar films');
    } finally {
      dispatch(setSimilarFilmsIsLoading(false));
    }
  }
);

export const fetchReviews = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Reviews}/fetchReviews`,
  async (id, {dispatch, extra: api}) => {
    dispatch(setReviewsIsLoading(true));
    try {
      const {data} = await api.get<CommentDto[]>(`${APIRoute.Comments}?movieId=${id}`);
      dispatch(setReviews(data.map((comment) => adaptCommentToClient(comment))));
    } catch (error) {
      dispatch(setReviews([]));
      toast.error('Can\'t fetch reviews');
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const postReview = createAsyncThunk<
  void,
  { id: string; review: NewReview },
  AsyncThunkConfig
>(
  `${NameSpace.Reviews}/postReview`,
  async ({id, review}, {dispatch, extra: api}) => {
    dispatch(setReviewsIsLoading(true));
    try {
      await api.post<void>(`${APIRoute.Comments}?movieId=${id}`, adaptNewReviewToServer(review, id));
    } finally {
      dispatch(setReviewsIsLoading(false));
    }
  }
);

export const checkAuth = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/checkAuth`,
  async (_arg, {dispatch, extra: api}) => {
    try {
      const {data} = await api.get<UserDto>(APIRoute.Login);
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
      dispatch(setUser(adaptUserToClient(data)));
    } catch {
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    }
  }
);

export const login = createAsyncThunk<void, AuthData, AsyncThunkConfig>(
  `${NameSpace.User}/login`,
  async (authData, {dispatch, extra: api}) => {
    try {
      const {
        data: {token},
      } = await api.post<{ token: Token }>(APIRoute.Login, authData);
      saveToken(token);
      dispatch(checkAuth());
    } catch {
      toast.error('Can\'t login');
    }
  }
);

export const logout = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.User}/logout`,
  async (_arg, {dispatch, extra: api}) => {
    try {
      dropToken();
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
      dispatch(setUser(null));
    } catch {
      toast.error('Can\'t logout');
    }
  }
);

export const fetchFavoriteFilms = createAsyncThunk<
  void,
  undefined,
  AsyncThunkConfig
>(
  `${NameSpace.FavoriteFilms}/fetchFavoriteFilms`,
  async (_arg, {dispatch, extra: api}) => {
    dispatch(setFavoriteFilmsIsLoading(true));
    try {
      const {data} = await api.get<Film[]>(`${APIRoute.Favorite}`);
      dispatch(setFavoriteFilms(data));
    } catch (error) {
      toast.error('Can\'t fetch favorite films');
    } finally {
      dispatch(setFavoriteFilmsIsLoading(false));
    }
  }
);

export const fetchPromo = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Promo}/fetchPromo`,
  async (_arg, {dispatch, extra: api}) => {
    dispatch(setPromoFilmIsLoading(true));
    try {
      const {data} = await api.get<Film>(`${APIRoute.Promo}`);
      dispatch(setPromoFilm(data));
    } catch (error) {
      dispatch(setPromoFilm(null));
      toast.error('Can\'t fetch promo film');
    } finally {
      dispatch(setPromoFilmIsLoading(false));
    }
  }
);

export const setFavorite = createAsyncThunk<
  void,
  { id: string; status: number },
  AsyncThunkConfig
>(
  `${NameSpace.FavoriteFilms}/setFavorite`,
  async ({id, status}, {dispatch, extra: api}) => {
    try {
      const method = status === 0 ? HttpMethod.Delete : HttpMethod.Post;
      const body = {movieId: id};
      const {data} = await api.request<Film>({method, url: APIRoute.Favorite, data: body});
      dispatch(setFilm(data));
    } catch (error) {
      toast.error('Can\'t add to or remove from MyList');
    }
  }
);

export const registerUser = createAsyncThunk<void, NewUser, AsyncThunkConfig>(
  `${NameSpace.User}/register`,
  async (userData, {extra: api}) => {
    const {avatar} = userData;
    delete userData.avatar;

    try {
      const {data} = await api.post<{ id: string }>(APIRoute.Register, userData);
      if (avatar) {
        const postAvatarApiRoute = `${APIRoute.Users}/${data.id}/profilePicture`;

        await api.post(postAvatarApiRoute, adaptAvatarToServer(avatar), {
          headers: {'Content-Type': 'multipart/form-data'},
        });
      }
    } catch {
      throw new Error('Can\'t sign up');
    }
  }
);
