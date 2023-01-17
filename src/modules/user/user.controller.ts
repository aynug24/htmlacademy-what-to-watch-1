import {Controller} from '../../common/controller/controller.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {Request, Response} from 'express';
import CreateUserDto from './dto/create-user.dto.js';
import {IUserService} from './user-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {createJWT, fillDTO} from '../../utils/common.js';
import UserResponse from './response/user.response.js';
import {IConfig} from '../../common/config/config.interface.js';
import LoginUserDto from './dto/login-user.dto.js';
import {ValidateDtoMiddleware} from '../../middlewares/validate-dto.middleware.js';
import {ValidateObjectIdMiddleware} from '../../middlewares/validate-objectid.middleware.js';
import {RequestArgumentType} from '../../types/request-argument-type.type.js';
import {UploadFileMiddleware} from '../../middlewares/upload-file.middleware.js';
import {PrivateRouteMiddleware} from '../../middlewares/private-route.middleware.js';
import LoggedUserResponse from './response/logged-user.response.js';
import {JWT_ALGORITHM} from './user.constant.js';

@injectable()
export default class UserController extends Controller {
  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IUserService) private readonly userService: IUserService,
    @inject(Component.IConfig) private readonly configService: IConfig,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    // todo <UserRoute> ?
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.get});
    this.addRoute({
      path: '/:userId/profilePicture',
      method: HttpMethod.Post,
      handler: this.uploadProfilePicture,
      middlewares: [
        new ValidateObjectIdMiddleware({where: RequestArgumentType.Path, name: 'userId'}),
        new UploadFileMiddleware(
          'profilePicture',
          this.userService,
          this.configService.get('UPLOAD_DIRECTORY')
        ),
      ]
    });
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    const body = req.body;
    const conflictingUser = await this.userService.findByEmail(body.email);

    if (conflictingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController'
      );
    }

    const result = await this.userService.create(body, this.configService.get('SALT'));
    const createdUser: UserResponse = result;

    if (req.file) {
      const avatarPath = req.file.path.slice(1);
      await this.userService.setProfilePictureUri(result.id, avatarPath);
      createdUser.profilePictureUri = avatarPath;
    }
    this.created(res, fillDTO(UserResponse, createdUser));
  }

  public async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    const token = await createJWT(
      JWT_ALGORITHM,
      this.configService.get('JWT_SECRET'),
      {email: user.email, id: user.id}
    );

    this.ok(res, fillDTO(LoggedUserResponse, {token}));
  }

  public async get(
    req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(req.user.email);
    this.ok(res, fillDTO(LoggedUserResponse, user));
  }

  async uploadProfilePicture(req: Request, res: Response) {
    const createdFilePath = req.file?.path;
    if (createdFilePath) {
      await this.userService.setProfilePictureUri(req.params.userId, createdFilePath);
      this.created(res, {
        filepath: createdFilePath
      });
    }
  }
}
