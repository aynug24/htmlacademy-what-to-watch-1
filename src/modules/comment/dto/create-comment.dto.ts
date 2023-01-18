import {IsInt, IsMongoId, IsString, Length, Max, Min} from 'class-validator';

export default class CreateCommentDto {
  @IsString({message: 'Required text'})
  @Length(5, 1024, {message: 'Text length should be 5-1024 characters'})
  public text!: string;

  @IsInt({message: 'Score should be an integer'})
  @Min(1, {message: 'Min score is 1'})
  @Max(10, {message: 'Max score is 10'})
  public score!: number;

  @IsMongoId({message: 'movieId should be a valid id'})
  public movieId!: string;
}
