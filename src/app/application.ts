import {ILogger} from '../common/logger/logger.interface.js';
import {IConfig} from '../common/config/config.interface.js';
import {inject, injectable} from 'inversify';
import {Component} from '../types/component.types.js';
import {IDatabase} from '../common/database-client/database.interface.js';
import {getURI} from '../utils/db.js';

@injectable()
export default class Application {
  private readonly logger: ILogger;
  private readonly config: IConfig;
  private readonly databaseClient: IDatabase;

  constructor(
    @inject(Component.ILogger) logger: ILogger,
    @inject(Component.IConfig) config: IConfig,
    @inject(Component.IDatabase) databaseClient: IDatabase
  ) {
    this.logger = logger;
    this.config = config;
    this.databaseClient = databaseClient;
  }

  public async init() {
    this.logger.info('Application initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(uri);
  }
}
