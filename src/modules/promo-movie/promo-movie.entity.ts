import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';
import {MovieEntity} from '../movie/movie.entity.js';
import {Types} from 'mongoose';

const {prop, modelOptions} = typegoose;

export interface PromoMovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'promo-movie'
  }
})
export class PromoMovieEntity extends defaultClasses.TimeStamps {
  @prop({required: true, ref: MovieEntity, type: Types.ObjectId})
  public movie: Ref<MovieEntity>;
}

export const PromoMoveModel = getModelForClass(PromoMovieEntity);
