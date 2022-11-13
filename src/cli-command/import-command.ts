import CliCommand from './cli-command.abstract.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {MovieTsvParser} from '../common/parsers/movie-tsv-parser.js';
import {CommandResult} from './command-result.js';
import FileReader from '../common/file-reader/file-reader.js';
import UserService from '../modules/user/user.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import DatabaseService from '../common/database-client/database.service.js';
import {UserModel} from '../modules/user/user.entity.js';
import {IDatabase} from '../common/database-client/database.interface.js';
import {IUserService} from '../modules/user/user-service.interface.js';
import {ILogger} from '../common/logger/logger.interface.js';
import {IMovieService} from '../modules/movie/movie-service.interface.js';
import {MovieModel} from '../modules/movie/movie.entity.js';
import MovieService from '../modules/movie/movie.service.js';
import {Movie} from '../types/movie.type.js';
import {getURI} from '../utils/db.js';
import {EmptyVoidFn} from '@typegoose/typegoose/lib/types.js';
import {IConfig} from '../common/config/config.interface.js';
import ConfigService from '../common/config/config.service.js';

export default class ImportCommand extends CliCommand {
  private static resultColor = '#1FAF26';
  private static errorColor = '#E51717';

  private configService!: IConfig;
  private userService!: IUserService;
  private movieService!: IMovieService;
  private databaseService!: IDatabase;
  private logger: ILogger;
  private salt!: string;

  constructor() {
    super('import');

    this.configService = new ConfigService(new ConsoleLoggerService());
    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  public async execute(
    path: string, login: string, password: string, host: string, dbname: string, salt: string
  ): Promise<CommandResult> {
    const dbUri = getURI(login, password, host, this.configService.get('DB_PORT'), dbname);
    this.salt = salt;

    await this.databaseService.connect(dbUri);

    const fileReader = new TsvFileReader(new MovieTsvParser(), new FileReader(path));
    fileReader.on('read', this.saveMovie.bind(this));

    let resultOutput = '';
    fileReader.on(
      'endOfFile',
      (movieCount) => {
        resultOutput = `Read ${movieCount} movies`;
      }
    );

    let errMsg: string | undefined;
    try {
      await fileReader.read();
    } catch (err) {

      errMsg = (err instanceof Error)
        ? `Couldn't read file data: ${err.message}`
        : 'Wtf, someone is throwing numbers!';
    }

    if (!errMsg && !resultOutput) {
      errMsg = 'Didn\'t reach end of file.';
    }

    if (errMsg) {
      return {
        result: errMsg,
        colorHex: ImportCommand.errorColor
      };
    }
    return {
      result: resultOutput,
      colorHex: ImportCommand.resultColor
    };
  }

  private async saveMovie(movie: Movie, resolve: EmptyVoidFn) {
    const postedByUser = await this.userService.findOrCreate({
      ...movie.postedByUser,
      password: this.configService.get('DEFAULT_USER_PASSWORD')
    }, this.salt);

    await this.movieService.create({
      ...movie,
      postedByUser: postedByUser.id,
    });

    resolve();
  }
}
