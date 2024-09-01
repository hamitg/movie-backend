import { IsString, IsInt, MinLength, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'ali', description: 'Username of the user' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 25,
    description: 'Age of the user',
    minimum: 1,
    maximum: 110,
  })
  @IsInt()
  @Min(1)
  @Max(110)
  age: number;
}
