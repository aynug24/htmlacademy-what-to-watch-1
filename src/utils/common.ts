import * as crypto from 'crypto';
import {ClassConstructor, plainToInstance} from 'class-transformer';
import {ValidationError} from 'class-validator';
import {ValidationErrorField} from '../types/validation-error-field.type.js';
import * as jose from 'jose';
import {ServiceError} from '../types/service-error.enum.js';
import {DEFAULT_STATIC_IMAGES} from '../app/application.contants.js';
import {DEFAULT_MOVIE_BACKGROUND_IMAGES, DEFAULT_MOVIE_POSTER_IMAGES} from '../modules/movie/movie.constant.js';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true, enableImplicitConversion: true});

export const createJWT = async (algorithm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(new TextEncoder().encode(jwtSecret));

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: Record<string, unknown>,
  transformFn: (object: Record<string, unknown>) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        const obj = Object(someObject[key]);
        transformProperty(property, obj, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data: Record<string, unknown>) => {
  properties.forEach((property) => transformProperty(property, data, (target: Record<string, unknown>) => {
    const fileIsStatic = [
      ...DEFAULT_STATIC_IMAGES,
      ...DEFAULT_MOVIE_POSTER_IMAGES,
      ...DEFAULT_MOVIE_BACKGROUND_IMAGES
    ].includes(`${target[property]}`);

    const filePath = fileIsStatic ? staticPath : uploadPath;
    target[property] = `${filePath}/${target[property]}`;
  }));
};
