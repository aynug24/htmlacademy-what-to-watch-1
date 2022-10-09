import {User} from '../../types/user.type.js';

export interface UserGeneratorInterface {
  generate(): User;
}
