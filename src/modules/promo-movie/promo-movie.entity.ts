import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';
import {MovieEntity} from '../movie/movie.entity.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

export interface PromoMovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class PromoMovieEntity extends defaultClasses.TimeStamps {
  @prop({required: true, ref: UserEntity})
  public movie!: Ref<MovieEntity>;
}

export const PromoMoveModel = getModelForClass(PromoMovieEntity);
