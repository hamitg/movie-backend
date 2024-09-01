import { IsNumber, IsPositive } from 'class-validator';

export class GetWatchHistoryDto {
  @IsNumber()
  @IsPositive()
  userId: number;
}
