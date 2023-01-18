import UserDto from '../user/user.dto';

export default class CommentDto {
  public id!: string;

  public text!: string;

  public postDate!: string;

  public score!: number;

  public user!: UserDto;
}
