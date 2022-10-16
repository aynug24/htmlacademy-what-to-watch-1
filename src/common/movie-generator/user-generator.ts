import {UserGeneratorInterface} from './user-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {getRandomEmail, getRandomString, getRandomUsername} from '../../utils/random/random-movie.js';
import {getRandomInt} from '../../utils/random/random.js';
import {User} from '../../types/user.type.js';

const EARLIEST_USER_BIRTH_YEAR = 1953;
const MAX_USER_ID = 2 ** 32 - 1;
const USER_PASSWORD_LENGTH = 16;


export default class UserGenerator implements UserGeneratorInterface {
  private readonly mockData: MockData;

  constructor(mockData: MockData) {
    this.mockData = mockData;
  }

  generate(): User {
    const userId = getRandomInt(0, MAX_USER_ID);
    const postedByUserName = getRandomUsername(
      this.mockData.names, this.mockData.surnames, EARLIEST_USER_BIRTH_YEAR, new Date().getFullYear()
    );
    return {
      name: postedByUserName,
      email: getRandomEmail(postedByUserName, this.mockData.nouns),
      profilePictureUri: Math.random() < 0.5 ? `users/${userId}/profilePicture` : undefined,
      password: getRandomString(USER_PASSWORD_LENGTH)
    };
  }
}
