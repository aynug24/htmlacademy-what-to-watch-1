import {IParser} from '../parsers/parser.interface.js';
import EventEmitter from 'events';
import FileReader from './file-reader.js';
import {EmptyVoidFn} from '@typegoose/typegoose/lib/types.js';

export default class TsvFileReader<T> extends EventEmitter {
  private readonly fileReader: FileReader;
  private readonly parser: IParser<T>;

  private objectCount = 0;

  constructor(parser: IParser<T>, fileReader: FileReader) {
    super();
    this.fileReader = fileReader;
    this.parser = parser;
  }

  private async onLine(line: string, resolve: EmptyVoidFn) {
    const parsedObject = this.parser.parse(line.trim());
    await new Promise((resolveInner) => {
      this.emit('read', parsedObject, resolveInner);
    });
    this.objectCount++;
    resolve();
  }

  public async read(): Promise<void> {
    this.fileReader.on('lineRead', this.onLine.bind(this));
    await this.fileReader.read();
    this.emit('endOfFile', this.objectCount);
  }
}
