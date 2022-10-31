export const Component = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  IConfig: Symbol.for('IConfig'),
  IDatabase: Symbol.for('IDatabase'),
  IUserService: Symbol.for('IUserService'),
  UserModel: Symbol.for('UserModel'),
  IMovieService: Symbol.for('IMovieService'),
  MovieModel: Symbol.for('MovieModel')
} as const;
