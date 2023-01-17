import {IsInt, IsMongoId, IsString, Length, Max, Min} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'Required text'})
  @Length(5, 1024, {message: 'Text length should be 2-100 characters'})
  public text!: string;

  @IsInt({message: 'Rating should be an integer'})
  @Min(1, {message: 'Min rating is 1'})
  @Max(10, {message: 'Max rating is 10'})
  public score!: number;

  @IsMongoId({message: 'movieId should be a valid id'})
  public movieId!: string;

  @IsMongoId({message: 'userId should be a valid id'})
  public userId!: string;
}
