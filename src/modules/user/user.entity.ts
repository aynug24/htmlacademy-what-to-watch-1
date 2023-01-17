import {User} from '../../types/user.type.js';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import {createSHA256} from '../../utils/common.js';
import {DEFAULT_PROFILE_PICTURE_FILE_NAME} from './user.constant.js';

const {prop, modelOptions} = typegoose;

const MIN_PASSWORD_LEN = 6;
const MAX_PASSWORD_LEN = 12;

export interface UserEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  constructor(data: User) {
    super();

    this.email = data.email;
    this.profilePictureUri = data.profilePictureUri;
    this.name = data.name;
  }

  @prop({required: true, minlength: 1, maxlength: 15})
  public name!: string;

  @prop({required: true, unique: true})
  public email!: string;

  @prop({required: false, default: DEFAULT_PROFILE_PICTURE_FILE_NAME})
  public profilePictureUri?: string;

  @prop({required: true})
  private password!: string;

  public setPassword(password: string, salt: string) {
    if (password.length < MIN_PASSWORD_LEN || password.length > MAX_PASSWORD_LEN) {
      throw new Error(`Password length should be ${MIN_PASSWORD_LEN}-${MAX_PASSWORD_LEN}`);
    }
    this.password = createSHA256(password, salt);
  }

  public verifyPassword(password: string, salt: string) {
    return createSHA256(password, salt) === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
