import { IsNumber, IsPositive } from 'class-validator';

export class DeleteUserDto {
  @IsNumber()
  @IsPositive()
  userId: number;
}
