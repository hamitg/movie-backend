import { IsInt } from 'class-validator';

export class AttendSessionDto {
  @IsInt()
  userId: number;

  @IsInt()
  sessionId: number;
}
