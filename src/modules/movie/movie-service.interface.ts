import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {Genre} from '../../types/genre.type.js';

export interface IMovieService {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(offerId: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  findNew(count?: number): Promise<DocumentType<MovieEntity>[]>;
  exists(movieId: string): Promise<boolean>;
  findByGenre(genre: Genre, count?: number): Promise<DocumentType<MovieEntity>[]>;
}
