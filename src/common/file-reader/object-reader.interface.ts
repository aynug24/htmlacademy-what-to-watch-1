import {FileReaderInterface} from './file-reader.interface.js';

export interface ObjectReaderInterface<T> extends FileReaderInterface {
  parse(): T[];
}
