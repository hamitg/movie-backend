import { IsInt } from 'class-validator';

export class TokenSignPayloadDto {
  @IsInt()
  sub: number;

  @IsInt()
  role: number;
}
