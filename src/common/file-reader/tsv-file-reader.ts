import {ObjectReaderInterface} from './object-reader.interface.js';
import {readFileSync} from 'fs';
import ParserInterface from '../parsers/parser.interface.js';

export default class TsvFileReader<T> implements ObjectReaderInterface<T> {
  public readonly filename: string;
  private readonly parser: ParserInterface<T>;
  private rawData: string | null = null;

  constructor(filename: string, parser: ParserInterface<T>) {
    this.filename = filename;
    this.parser = parser;
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf8'});
  }

  public parse(): T[] {
    if (this.rawData === null) {
      throw new Error('No data read');
    }
    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => this.parser.parse(line));
  }
}
