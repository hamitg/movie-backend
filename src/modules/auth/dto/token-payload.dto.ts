import { IsInt } from 'class-validator';

export class TokenPayloadDto {
  @IsInt()
  id: number;

  @IsInt()
  role: number;
}
