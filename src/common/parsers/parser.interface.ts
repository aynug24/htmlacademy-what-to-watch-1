export interface ParserInterface<T> {
  parse(s: string): T;
}
