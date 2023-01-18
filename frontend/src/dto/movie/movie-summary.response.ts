import UserDto from '../user/user.dto';
import {TGenre} from './create-movie.dto';

export default class MovieSummaryResponse {
  public id!: string;

  public title!: string;

  public postDate!: number;

  public genre!: TGenre;

  public previewUri!: string;

  public postedByUser!: UserDto;

  public posterUri!: string;

  public commentCount!: number;
}
