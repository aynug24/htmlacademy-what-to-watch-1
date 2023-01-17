import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import UpdateMovieDto from './dto/update-movie.dto.js';
import {Genre} from '../../types/genre.type.js';
import {IDocumentExists} from '../../types/document-exists.interface.js';

export interface IMovieService extends IDocumentExists {
  create(dto: CreateMovieDto, userId: string): Promise<DocumentType<MovieEntity>>;
  findById(offerId: string): Promise<DocumentType<MovieEntity> | null>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  findNew(count?: number): Promise<DocumentType<MovieEntity>[]>;
  findByGenre(genre: Genre, count?: number): Promise<DocumentType<MovieEntity>[]>;
  incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<DocumentType<MovieEntity> | null>;
}
