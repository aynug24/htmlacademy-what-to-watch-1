import CliCommand from './cli-command.abstract.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {MovieTsvParser} from '../common/parsers/movie-tsv-parser.js';
import {Movie} from '../types/movie.type.js';
import {CommandResult} from './command-result.js';

export default class ImportCommand extends CliCommand {
  private static FULL_NAME = 'import';
  private static SHORT_NAME = undefined;

  private static RES_COLOR = '#1FAF26';
  private static ERR_COLOR = '#E51717';

  constructor() {
    super(ImportCommand.FULL_NAME, ImportCommand.SHORT_NAME);
  }

  public async execute(path: string): Promise<CommandResult> {
    const moviesOrErrorMessage = this.tryReadMovies(path);

    if (typeof moviesOrErrorMessage === 'string') {
      return {
        result: moviesOrErrorMessage,
        colorHex: ImportCommand.ERR_COLOR
      };
    }
    return {
      result: JSON.stringify(moviesOrErrorMessage),
      colorHex: ImportCommand.RES_COLOR
    };
  }

  private tryReadMovies(path: string): Movie[] | string {
    const fileReader = new TsvFileReader(path, new MovieTsvParser());

    try {
      fileReader.read();
      return fileReader.parse();
    } catch (err) {

      if (!(err instanceof Error)) {
        return 'Wtf, someone is throwing numbers!';
      } else {
        return `Couldn't read file data: ${err.message}`;
      }
    }
  }
}
