import {createReadStream} from 'fs';
import EventEmitter from 'events';

export default class FileReader extends EventEmitter {
  public readonly filename: string;

  constructor(filename: string) {
    super();
    this.filename = filename;
  }

  public async read(): Promise<void> {
    const stream = createReadStream(this.filename, {
      highWaterMark: 128 * (2 ** 10),
      encoding: 'utf-8'
    });

    let fileBuf = '';
    let lineFeedPos = -1;
    let rowCount = 0;

    for await (const chunk of stream) {
      fileBuf += chunk.toString();

      while ((lineFeedPos = fileBuf.indexOf('\n')) >= 0) {
        const line = fileBuf.slice(0, lineFeedPos + 1);
        fileBuf = fileBuf.slice(lineFeedPos + 1);
        rowCount++;

        await new Promise((resolve) => {
          this.emit('lineRead', line, resolve);
        });
      }
    }

    this.emit('endOfFile', rowCount);
  }
}
