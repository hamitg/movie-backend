import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
export class BulkAddSessionsResponseDto {
  @ApiProperty({ example: 13, description: 'Number of sessions added' })
  @IsInt()
  addedCount: number;

  constructor(partial: Partial<BulkAddSessionsResponseDto>) {
    Object.assign(this, partial);
  }
}
