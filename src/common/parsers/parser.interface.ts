export interface IParser<T> {
  parse(s: string): T;
}
