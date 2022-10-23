import {ILogger} from '../common/logger/logger.interface.js';
import {IConfig} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.types.js';

@injectable()
export default class Application {
  private readonly logger: ILogger;
  private readonly config: IConfig;

  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig
  ) {
    this.logger = logger;
    this.config = config;
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
