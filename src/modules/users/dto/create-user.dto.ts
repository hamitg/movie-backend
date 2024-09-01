import { IsString, IsInt, MinLength, Max, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/roles.constants';

export class CreateUserDto {
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

  @ApiProperty({ example: 1, description: 'Role of the user', enum: ROLES })
  @IsEnum(ROLES)
  role: number;
}
