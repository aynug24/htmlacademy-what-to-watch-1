import {RequestArgumentType} from '../types/request-argument-type.type.js';
import HttpError from '../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {Request} from 'express';
import {RequestArgument} from '../types/request-argument.type.js';

export const getRequestArgument = ({params, query, body}: Request, requestArgument: RequestArgument): string => {
  if (requestArgument.where === RequestArgumentType.Path) {

    return params[requestArgument.name];
  } else if (requestArgument.where === RequestArgumentType.Body) {

    return body[requestArgument.name];
  } else if (requestArgument.where === RequestArgumentType.Query) {

    const queryParam = query[requestArgument.name];
    if (typeof queryParam !== 'string') {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Expected string query parameter ${requestArgument.name}`
      );
    }
    return queryParam;
  } else {
    throw new Error('Unknown request param type');
  }
}
