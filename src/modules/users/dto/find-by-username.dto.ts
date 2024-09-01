import { IsString, MinLength } from 'class-validator';

export class FindByUsernameDto {
  @IsString()
  @MinLength(3)
  username: string;
}
