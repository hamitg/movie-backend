import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetMovieResponseDto } from './get-movie-response.dto';

export class GetMoviesResponseDto {
  @ApiProperty({ type: [GetMovieResponseDto], description: 'Array of movies' })
  @Type(() => GetMovieResponseDto)
  movies: GetMovieResponseDto[];

  constructor(movies: any[]) {
    this.movies = movies.map((movie) => new GetMovieResponseDto(movie));
  }
}
