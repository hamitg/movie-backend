import { IsNumber } from 'class-validator';

export class BuyTicketDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  sessionId: number;
}
