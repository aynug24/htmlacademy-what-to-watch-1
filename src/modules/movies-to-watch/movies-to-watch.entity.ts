import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';
import {MovieEntity} from '../movie/movie.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface MoviesToWatchEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies-to-watch'
  }
})
export class MoviesToWatchEntity extends defaultClasses.TimeStamps {
  @prop({required: true, ref: UserEntity})
  public user!: Ref<UserEntity>;

  @prop({required: true, default: [], ref: MovieEntity})
  public movies!: Ref<MovieEntity>[];
}

export const MoviesToWatchModel = getModelForClass(MoviesToWatchEntity);
