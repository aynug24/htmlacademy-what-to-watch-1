import {Genre, genres} from '../../../types/genre.type.js';
import {IsArray, IsDateString, IsIn, IsInt, IsString, Length, Matches, Max, Min} from 'class-validator';

export default class CreateMovieDto {
  @IsString({message: 'Title is required'})
  @Length(2, 100, {message: 'Title length must be from 2 to 100 symbols'})
  public title!: string;

  @IsString({message: 'Description is required'})
  @Length(20, 1024, {message: 'Description length must be from 20 to 1024 symbols'})
  public description!: string;

  @IsDateString({}, {message: 'PostDate must be a valid ISO date'})
  public postDate!: Date;

  @IsIn(genres, {message: 'Unknown genre'})
  public genre!: Genre;

  @IsInt({message: 'ReleaseYear must be an integer'})
  @Min(1800, {message: 'Minimum releaseYear is 1800'})
  @Max(2100, {message: 'Maximum releaseYear is 2100'})
  public releaseYear!: number;

  @IsString({message: 'PreviewPath is required'})
  public previewUri!: string;

  @IsString({message: 'moviePath is required'})
  public videoUri!: string;

  @IsArray({message: 'Cast should be a non-empty array'})
  public cast!: string[];

  @IsString({message: 'director is required'})
  public director!: string;

  @IsInt({message: 'durationInMinutes must be an integer'})
  @Min(0, {message: 'durationInMinutes can\'t be negative'})
  public runningLengthMin!: number;

  @Matches(/(\S+(\.jpg)$)/, {message: 'posterPath must be a .jpg image'})
  @IsString({message: 'posterPath is required'})
  public posterUri!: string;

  @Matches(/(\S+(\.jpg)$)/, {message: 'backgroundImagePath must be a .jpg image'})
  @IsString({message: 'backgroundImagePath is required'})
  public backgroundImageUri!: string;

  @IsString({message: 'backgroundColor is required'})
  public backgroundColor!: string;
}
