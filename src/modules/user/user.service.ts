import {inject, injectable} from 'inversify';
import {DocumentType, types} from '@typegoose/typegoose';
import {UserEntity} from './user.entity.js';
import CreateUserDto from './dto/create-user.dto.js';
import {IUserService} from './user-service.interface.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import LoginUserDto from './dto/login-user.dto.js';

@injectable()
export default class UserService implements IUserService {
  constructor(
    @inject(Component.ILogger) private logger: ILogger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findById(userId);
  }

  public async setProfilePictureUri(userId: string, profilePictureUri: string): Promise<void | null> {
    return this.userModel.findByIdAndUpdate(userId, {profilePictureUri});
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);
    if (user && user.verifyPassword(dto.password, salt)) {
      return user;
    }
    return null;
  }

  public async exists(userId: string): Promise<boolean> {
    return (await this.findById(userId)) !== null;
  }
}
