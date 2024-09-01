import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BuyTicketReqDto {
  @ApiProperty({ description: 'ID of the session' })
  @IsNumber()
  sessionId: number;
}
