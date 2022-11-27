export const Component = {
  Application: Symbol.for('Application'),
  ILogger: Symbol.for('ILogger'),
  IConfig: Symbol.for('IConfig'),
  IDatabase: Symbol.for('IDatabase'),
  IUserService: Symbol.for('IUserService'),
  UserModel: Symbol.for('UserModel'),
  IMovieService: Symbol.for('IMovieService'),
  MovieModel: Symbol.for('MovieModel'),
  PromoMovieModel: Symbol.for('PromoMovieModel'),
  IPromoMovieService: Symbol.for('IPromoMovieService'),
  CommentModel: Symbol.for('CommentModel'),
  ICommentService: Symbol.for('ICommentService'),
  MoviesToWatchModel: Symbol.for('MoviesToWatchModel'),
  IMoviesToWatchService: Symbol.for('IMoviesToWatchService')
} as const;
