import {User} from '../../types/user.type.js';

export interface IUserGenerator {
  generate(): User;
}
