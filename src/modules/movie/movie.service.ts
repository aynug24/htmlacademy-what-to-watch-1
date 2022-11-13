import {inject, injectable} from 'inversify';
import {IMovieService} from './movie-service.interface.js';
import CreateMovieDto from './dto/create-movie.dto.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {MovieEntity} from './movie.entity.js';
import {Component} from '../../types/component.types.js';
import {ILogger} from '../../common/logger/logger.interface.js';

@injectable()
export default class MovieService implements IMovieService {
  constructor(
    @inject(Component.ILogger) private  readonly logger: ILogger,
    @inject(Component.MovieModel) private readonly MovieModel: types.ModelType<MovieEntity>
  ) {}

  public async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const result = await this.MovieModel.create(dto);
    this.logger.info(`New Movie created: ${dto.title}`);

    return result;
  }

  public async findById(MovieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.MovieModel.findById(MovieId).exec();
  }
}
