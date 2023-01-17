import {NextFunction, Request, Response} from 'express';
import {extension} from 'mime-types';
import multer, {diskStorage} from 'multer';
import {nanoid} from 'nanoid';
import {IMiddleware} from '../types/middleware.interface.js';
import {StatusCodes} from 'http-status-codes';
import HttpError from '../common/errors/http-error.js';
import {IUserService} from '../modules/user/user-service.interface.js';

export class UploadFileMiddleware implements IMiddleware {
  constructor(private fieldName: string,
              private userService: IUserService,
              private uploadDirectory: string) {}

  async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userId = req.params.userId;
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `User with id ${userId} doesn't exist`,
        'UploadFileMiddleware'
      );
    }

    const storage = diskStorage({
      destination: `.${this.uploadDirectory}`,
      filename: (_req, file, callback) => {
        const ext = extension(file.mimetype);
        const filename = nanoid();
        callback(null, `${filename}.${ext}`);
      }
    });

    const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);

    uploadSingleFileMiddleware(req, res, next);
  }
}
