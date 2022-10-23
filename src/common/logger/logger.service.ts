import {ILogger} from './logger.interface.js';
import pino, {Logger} from 'pino';
import {injectable} from 'inversify';

@injectable()
export default class LoggerService implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = pino();
    this.logger.info('Logger created...');
  }

  debug(message: string, ...args: object[]): void {
    this.logger.debug(message, ...args);
  }

  error(message: string, ...args: object[]): void {
    this.logger.error(message, ...args);
  }

  info(message: string, ...args: object[]): void {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: object[]): void {
    this.logger.warn(message, ...args);
  }
}
