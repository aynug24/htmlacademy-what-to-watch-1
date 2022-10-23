import {config} from 'dotenv';
import {IConfig} from './config.interface.js';
import {configSchema, ConfigSchema} from './config.schema.js';
import {ILogger} from '../logger/logger.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.types.js';

@injectable()
export default class ConfigService implements IConfig {
  private readonly config: ConfigSchema;
  private logger: ILogger;

  constructor(@inject(Component.ILogger) logger: ILogger) {
    this.logger = logger;

    const parsedOutput = config();
    if (parsedOutput.error) {
      throw new Error('Couldn\'t read .env file. Perhaps the file does not exist');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file was read and successfully parsed!');
  }

  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
    return this.config[key];
  }
}
