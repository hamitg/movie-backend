import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AttendSessionReqDto {
  @ApiProperty({ description: 'ID of the session' })
  @IsNumber()
  sessionId: number;
}
