import {IsEmail, IsString, Length, Matches} from 'class-validator';

export default class CreateUserDto {
  @IsEmail({}, {message: 'Invalid email'})
  public name!: string;

  @IsString({message: 'Required name'})
  public email!: string;

  @Matches(/[^\\s]+\.(jpg|png)$/, {message: 'Expected .jpg or .png profile picture uri'})
  public profilePictureUri?: string;

  @IsString({message: 'Required password'})
  @Length(6, 12, {message: 'Expected password length to be 6 to 12 characters'})
  public password!: string;
}
