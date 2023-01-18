import {IUserGenerator} from './user-generator.interface.js';
import {MockData} from '../../types/mock-data.type.js';
import {getRandomEmail, getRandomUsername} from '../../utils/random/random-movie.js';
import {User} from '../../types/user.type.js';

const EARLIEST_USER_BIRTH_YEAR = 1953;
const NAME_MAXLEN = 15;

export default class UserGenerator implements IUserGenerator {
  private readonly mockData: MockData;

  constructor(mockData: MockData) {
    this.mockData = mockData;
  }

  generate(): User {
    const postedByUserName = getRandomUsername(
      this.mockData.names, this.mockData.surnames, EARLIEST_USER_BIRTH_YEAR, new Date().getFullYear()
    );
    return {
      name: postedByUserName.slice(0, NAME_MAXLEN),
      email: getRandomEmail(postedByUserName, this.mockData.nouns),
    };
  }
}
