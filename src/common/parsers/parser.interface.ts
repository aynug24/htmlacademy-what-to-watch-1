export default interface ParserInterface<T> {
  parse(s: string): T;
};
