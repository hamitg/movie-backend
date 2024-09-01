import { IsNumber, IsPositive } from 'class-validator';

export class FindByIdDto {
  @IsNumber()
  @IsPositive()
  userId: number;
}
