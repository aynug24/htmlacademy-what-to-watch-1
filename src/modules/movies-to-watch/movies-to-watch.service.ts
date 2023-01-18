import {inject, injectable} from 'inversify';
import {IMoviesToWatchService} from './movies-to-watch.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MoviesToWatchEntity} from './movies-to-watch.entity.js';
import {Component} from '../../types/component.types.js';

@injectable()
export default class MoviesToWatchService implements IMoviesToWatchService {
  constructor(
    @inject(Component.MoviesToWatchModel) private readonly moviesToWatchModel: types.ModelType<MoviesToWatchEntity>,
  ) {
  }

  public async find(userId: string): Promise<DocumentType<MoviesToWatchEntity> | null> {
    return this.moviesToWatchModel
      .findOneAndUpdate(
        {user: userId},
        {
          $setOnInsert: {
            user: userId,
          }
        },
        {new: true, upsert: true}
      )
      .populate('movies');
  }

  public async add(userId: string, movieId: string): Promise<DocumentType<MoviesToWatchEntity> | null> {
    return this.moviesToWatchModel
      .findOneAndUpdate(
        {user: userId},
        {$addToSet: {movies: movieId}},
        {new: true, upsert: true}
      );
  }

  public async delete(userId: string, movieId: string): Promise<DocumentType<MoviesToWatchEntity> | null> {
    return this.moviesToWatchModel
      .findOneAndUpdate(
        {user: userId},
        {$pull: {movies: movieId}},
        {new: true}
      );
  }
}
