import CliCommand from './cli-command.abstract.js';
import TsvFileReader from '../common/file-reader/tsv-file-reader.js';
import {MovieTsvParser} from '../common/parsers/movie-tsv-parser.js';
import {CommandResult} from './command-result.js';
import FileReader from '../common/file-reader/file-reader.js';
import chalk from 'chalk';

export default class ImportCommand extends CliCommand {
  private static outputColor = '#345eeb';

  private static resultColor = '#1FAF26';
  private static errorColor = '#E51717';

  constructor() {
    super('import');
  }

  public async execute(path: string): Promise<CommandResult> {
    const fileReader = new TsvFileReader(new MovieTsvParser(), new FileReader(path));
    fileReader.on(
      'read',
      (movie) => console.log(
        chalk.hex(ImportCommand.outputColor)(JSON.stringify(movie, null, 2))
      )
    );

    let result = '';
    fileReader.on(
      'endOfFile',
      (movieCount) => { result = `Read ${movieCount} movies`; }
    );

    let errMsg: string | undefined;
    try {
      await fileReader.read();
    } catch (err) {

      errMsg = (err instanceof Error)
        ? `Couldn't read file data: ${err.message}`
        : 'Wtf, someone is throwing numbers!';
    }

    if (!errMsg && !result) {
      errMsg = 'Didn\'t reach end of file.';
    }

    if (errMsg) {
      return {
        result: errMsg,
        colorHex: ImportCommand.errorColor
      };
    }
    return {
      result,
      colorHex: ImportCommand.resultColor
    };
  }
}
