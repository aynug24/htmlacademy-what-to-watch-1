export const GENRE_ARRAY = ['comedy', 'crime', 'documentary', 'drama', 'horror', 'family', 'romance', 'scifi', 'thriller'];

export type TGenre = typeof GENRE_ARRAY[number];

export default class CreateMovieDto {
  public title!: string;

  public description!: string;

  public postDate!: Date;

  public genre!: TGenre;

  public releaseYear!: number;

  public previewUri!: string;

  public videoUri!: string;

  public cast!: string[];

  public director!: string;

  public runningLengthMin!: number;

  public posterUri!: string;

  public backgroundImageUri!: string;

  public backgroundColor!: string;
}
