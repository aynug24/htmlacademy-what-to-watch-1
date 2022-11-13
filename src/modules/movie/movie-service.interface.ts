import {DocumentType} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import CreateMovieDto from './dto/create-movie.dto.js';

export interface IMovieService {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(offerId: string): Promise<DocumentType<MovieEntity> | null>;
}
