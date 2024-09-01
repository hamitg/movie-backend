import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { GetSessionResponseDto } from './get-session-response.dto';
import { PlainMovieResponseDto } from './get-plain-movie-response.dto';

export class GetMovieResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the movie' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Inception', description: 'The name of the movie' })
  name: string;

  @Expose()
  @ApiProperty({ example: 13, description: 'Age restriction for the movie' })
  ageRestriction: number;

  @Expose()
  @Type(() => GetSessionResponseDto)
  @ApiProperty({
    type: [GetSessionResponseDto],
    description: 'Sessions for the movie',
  })
  sessions?: GetSessionResponseDto[];

  constructor(partial: Partial<PlainMovieResponseDto> & { sessions?: any[] }) {
    Object.assign(this, partial);
    if (partial && partial.sessions) {
      this.sessions = partial.sessions.map(
        (session) => new GetSessionResponseDto(session),
      );
    }
  }
}
