import typegoose, {defaultClasses, Ref, getModelForClass} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {Genre, genres} from '../../types/genre.type.js';
import {Types} from 'mongoose';

const {prop, modelOptions} = typegoose;

export interface MovieEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'movies'
  }
})
export class MovieEntity extends defaultClasses.TimeStamps {
  @prop({trim: true})
  public id!: string;

  @prop({trim: true, required: true, minlength: 2, maxlength: 100})
  public title!: string;

  @prop({trim: true, required: true, minlength: 20, maxlength: 1024})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    type: () => String,
    required: true,
    enum: genres
  })
  public genre!: Genre;

  @prop({required: true})
  public releaseYear!: number;

  @prop({required: true, default: 0})
  public rating!: number;

  @prop({required: true, trim: true})
  public previewUri!: string;

  @prop({required: true, trim: true})
  public videoUri!: string;

  @prop({required: true})
  public cast!: string[];

  @prop({required: true, minlength: 2, maxlength: 50, trim: true})
  public director!: string;

  @prop({required: true})
  public runningLengthMin!: number;

  @prop({default: 0})
  public commentsCount!: number;

  @prop({required: true, ref: UserEntity, type: Types.ObjectId})
  public postedByUser: Ref<UserEntity>;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public posterUri!: string;

  @prop({required: true, match: /(\S+(\.jpg)$)/})
  public backgroundImageUri!: string;

  @prop({required: true, trim: true})
  public backgroundColor!: string;
}

export const MovieModel = getModelForClass(MovieEntity);
