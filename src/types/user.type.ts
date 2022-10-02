import {Uri} from './uri.type.js';

export type User = {
  name: string,
  email: string,
  profilePicture?: Uri,
  password: string // pls no
}
