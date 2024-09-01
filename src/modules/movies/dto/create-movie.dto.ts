import {
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNestedSessionDto } from './create-nested-session.dto';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Kapicilar Krali 3',
    description: 'The name of the movie',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 13,
    description: 'Age restriction for the movie',
    minimum: 0,
    maximum: 18,
  })
  @IsInt()
  @Min(0)
  @Max(18)
  ageRestriction: number;

  @ApiPropertyOptional({
    type: [CreateNestedSessionDto],
    description: 'Array of sessions for the movie',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNestedSessionDto)
  @IsOptional()
  sessions?: CreateNestedSessionDto[];
}
