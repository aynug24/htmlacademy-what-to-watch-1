import {FileWriterInterface} from './file-writer.interface.js';
import {createWriteStream, WriteStream} from 'fs';

export default class PerLineFileWriter implements FileWriterInterface {
  public readonly filename: string;

  private stream: WriteStream;

  constructor(filename: string) {
    this.filename = filename;
    this.stream = createWriteStream(this.filename, {
      flags: 'w',
      encoding: 'utf-8',
      highWaterMark: 64 * (2 ** 10),
      autoClose: true
    });
  }

  public async write(line: string): Promise<void> {
    if (!this.stream.write(`${line}\n`)) {
      return new Promise((resolve) => {
        this.stream.once('drain', () => resolve());
      });
    }
  }
}
