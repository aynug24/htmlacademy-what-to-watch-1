import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {Genre} from '../../types/genre.type.js';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({required: true})
  public genre!: Genre;

  @prop({required: true})
  public releaseYear!: number;

  @prop({required: true})
  public rating!: number;

  @prop({required: true})
  public previewUri!: string;

  @prop({required: true})
  public videoUri!: string;

  @prop({required: true})
  public cast!: string[];

  @prop({required: true, minlength: 2, maxlength: 50})
  public director!: string;

  @prop({required: true})
  public runningLengthMin!: number;

  @prop({required: true, ref: UserEntity})
  public postedByUser: Ref<UserEntity>;

  @prop({required: true})
  public posterUri!: string;

  @prop({required: true})
  public backgroundImageUri!: string;

  @prop({required: true})
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
