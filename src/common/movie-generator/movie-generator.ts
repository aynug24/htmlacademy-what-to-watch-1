import {IMovieGenerator} from './movie-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {getRandomElement, getRandomInt} from '../../utils/random/random.js';
import {
  getRandomDate, getRandomFullName, getRandomHexColor,
  getRandomMovieCast,
  getRandomText,
  getRandomTitle,
} from '../../utils/random/random-movie.js';
import {Genre, genres} from '../../types/genre.type.js';
import {Movie} from '../../types/movie.type.js';
import {IUserGenerator} from './user-generator.interface.js';

const MAX_MOVIE_ID = 2 ** 32 - 1;
const MIN_DESCRIPTION_SENTENCES = 3;
const MAX_DESCRIPTION_SENTENCES = 5;

const EARLIEST_POST_DATE = new Date(2018, 3, 24);
const EARLIEST_RELEASE_YEAR = 1970;

const MAX_CAST_LENGTH = 6;
const MAX_RUNNING_LENGTH_MIN = 300;

export default class MovieGenerator implements IMovieGenerator {
  private readonly mockData: MockData;
  private readonly userGenerator: IUserGenerator;

  constructor(mockData: MockData, userGenerator: IUserGenerator) {
    this.mockData = mockData;
    this.userGenerator = userGenerator;
  }

  public generate(): Movie {
    const movieId = getRandomInt(1, MAX_MOVIE_ID);
    const postedByUser = this.userGenerator.generate();

    return {
      title: getRandomTitle(this.mockData.nouns),
      description: getRandomText(
        this.mockData.nouns, this.mockData.pastTenseVerbs,
        MIN_DESCRIPTION_SENTENCES, MAX_DESCRIPTION_SENTENCES),
      postDate: getRandomDate(EARLIEST_POST_DATE, new Date()),
      genre: getRandomElement<Genre>(genres),
      releaseYear: getRandomInt(EARLIEST_RELEASE_YEAR, new Date().getFullYear()),
      rating: getRandomInt(0, 100) / 10,
      previewUri: `/previews/${movieId}`,
      videoUri: `/videos/${movieId}`,
      cast: getRandomMovieCast(this.mockData.names, this.mockData.surnames, MAX_CAST_LENGTH),
      director: getRandomFullName(this.mockData.names, this.mockData.surnames),
      runningLengthMin: getRandomInt(1, MAX_RUNNING_LENGTH_MIN),
      postedByUser,
      posterUri: `/posters/${movieId}`,
      backgroundImageUri: `/backgroundImages/${movieId}`,
      backgroundColor: getRandomHexColor()
    };
  }
}
