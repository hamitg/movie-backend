import {
  IsString,
  IsInt,
  IsOptional,
  MinLength,
  Max,
  IsEnum,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ROLES } from '../../../common/constants/roles.constants';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'newPass1',
    description: 'New password for the user',
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Age of the user',
    minimum: 1,
    maximum: 110,
  })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(110)
  age?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Role of the user',
    enum: ROLES,
  })
  @IsEnum(ROLES)
  @IsOptional()
  role?: number;
}
