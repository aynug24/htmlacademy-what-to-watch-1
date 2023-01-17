import {NextFunction, Request, Response} from 'express';
import {extension} from 'mime-types';
import multer, {diskStorage} from 'multer';
import {nanoid} from 'nanoid';
import {IMiddleware} from '../types/middleware.interface.js';

export class UploadFileMiddleware implements IMiddleware {
  constructor(private fieldName: string,
              private uploadDirectory: string) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
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
