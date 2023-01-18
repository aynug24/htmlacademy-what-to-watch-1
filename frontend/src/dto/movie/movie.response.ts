import UserDto from '../user/user.dto';
import {TGenre} from './create-movie.dto';
import {Expose} from 'class-transformer';

export default class MovieResponse {
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: number;

  public genre!: TGenre;

  public releaseYear!: number;

  public rating!: number;

  public previewUri!: string;

  public videoUri!: string;

  public cast!: string[];

  public director!: string;

  public runningLengthMin!: number;

  public postedByUser!: UserDto;

  public posterUri!: string;

  public backgroundImageUri!: string;

  public backgroundColor!: string;
}
