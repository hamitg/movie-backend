import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
export class BulkDeleteMoviesResponseDto {
  @ApiProperty({ example: 13, description: 'Number of movies deleted' })
  @IsInt()
  deletedCount: number;

  constructor(partial: Partial<BulkDeleteMoviesResponseDto>) {
    Object.assign(this, partial);
  }
}
