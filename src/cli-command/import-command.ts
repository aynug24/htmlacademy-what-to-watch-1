import CliCommand from './cli-command.abstract.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {MovieTsvParser} from '../common/parsers/movie-tsv-parser.js';
import {CommandResult} from './command-result.js';
import FileReader from '../common/file-reader/file-reader.js';
import {IDatabase} from '../common/database-client/database.interface.js';
import {IUserService} from '../modules/user/user-service.interface.js';
import {IMovieService} from '../modules/movie/movie-service.interface.js';
import {Movie} from '../types/movie.type.js';
import {getDbUri} from '../utils/db.js';
import {EmptyVoidFn} from '@typegoose/typegoose/lib/types.js';
import {IConfig} from '../common/config/config.interface.js';
import {initContainer} from '../container.js';
import {Component} from '../types/component.types.js';

export default class ImportCommand extends CliCommand {
  private static resultColor = '#1FAF26';
  private static errorColor = '#E51717';

  private configService!: IConfig;
  private userService!: IUserService;
  private movieService!: IMovieService;
  private databaseService!: IDatabase;
  private salt!: string;

  constructor() {
    super('import');

    const container = initContainer();

    this.configService = container.get<IConfig>(Component.IConfig);
    this.movieService = container.get<IMovieService>(Component.IMovieService);
    this.userService = container.get<IUserService>(Component.IUserService);
    this.databaseService = container.get<IDatabase>(Component.IDatabase);
  }

  public async execute(
    path: string, login: string, password: string, host: string, dbname: string, salt: string
  ): Promise<CommandResult> {
    const dbUri = getDbUri(login, password, host, this.configService.get('DB_PORT'), dbname);
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

    await this.movieService.create(movie, postedByUser.id);

    resolve();
  }
}
