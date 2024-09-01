import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PlainMovieResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the movie' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Inception', description: 'The name of the movie' })
  name: string;

  @Expose()
  @ApiProperty({ example: 13, description: 'Age restriction for the movie' })
  ageRestriction: number;
}
