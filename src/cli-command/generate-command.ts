import got from 'got';
import CliCommand from './cli-command.abstract.js';
import {CommandResult} from './command-result.js';
import {MockData} from '../types/mock-data.type.js';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import UserGenerator from '../common/movie-generator/user-generator.js';
import PerLineFileWriter from '../common/file-writer/per-line-file-writer.js';
import TsvMovieFormatter from '../common/formatter/tsv-movie-formatter.js';

const PARAM_COUNT = 3;

export default class GenerateCommand extends CliCommand {
  private static outputColor = '#A71596';
  private static errorColor = '#E51717';

  private readonly tsvMovieFormatter: TsvMovieFormatter = new TsvMovieFormatter();

  constructor() {
    super('generate');
  }

  public async execute(...parameters: string[]): Promise<CommandResult> {
    if (parameters.length !== PARAM_COUNT) {
      throw new Error(`Expected ${PARAM_COUNT} params: movie count, path to write mock data, url of mock data`);
    }
    const [movieCountStr, mockPath, mockDataUrl] = parameters;
    const movieCount = Number.parseInt(movieCountStr, 10);

    let mockData: MockData;
    try {
      mockData = await got.get(mockDataUrl).json();
    } catch (err) {
      if (!(err instanceof Error)) {
        throw err;
      }
      return { result: err.message, colorHex: GenerateCommand.errorColor };
    }

    const movieGenerator = new MovieGenerator(mockData, new UserGenerator(mockData));
    const fileWriter = new PerLineFileWriter(mockPath);

    for (let i = 0; i < movieCount; i++) {
      const movie = movieGenerator.generate();
      const formattedMovie = this.tsvMovieFormatter.format(movie);

      await fileWriter.write(formattedMovie);
    }

    return {
      result: `Generated ${movieCount} movies to ${mockPath}.`,
      colorHex: GenerateCommand.outputColor
    };
  }
}
