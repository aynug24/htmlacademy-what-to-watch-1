import {DocumentType} from '@typegoose/typegoose';
import {MoviesToWatchEntity} from './movies-to-watch.entity.js';

export interface IMoviesToWatchService {
  find(userId: string): Promise<DocumentType<MoviesToWatchEntity> | null>;
  add(userId: string, movieId: string): Promise<DocumentType<MoviesToWatchEntity> | null>;
}
