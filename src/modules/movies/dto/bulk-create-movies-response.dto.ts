import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
export class BulkCreateMoviesResponseDto {
  @ApiProperty({ example: 13, description: 'Number of movies created' })
  @IsInt()
  createdCount: number;

  constructor(partial: Partial<BulkCreateMoviesResponseDto>) {
    Object.assign(this, partial);
  }
}
