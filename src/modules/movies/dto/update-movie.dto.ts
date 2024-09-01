import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateNestedSessionDto } from './update-nested-session.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UpdateSessionDto } from './update-session.dto';
import { CreateNestedSessionDto } from './create-nested-session.dto';

export class UpdateMovieDto {
  @ApiPropertyOptional({
    example: 'Kapicilar Krali',
    description: 'The name of the movie',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 12,
    description: 'Age restriction for the movie',
    minimum: 0,
    maximum: 18,
  })
  @IsNumber()
  @IsOptional()
  ageRestriction?: number;

  @ApiPropertyOptional({
    type: [UpdateSessionDto],
    description: 'Array of sessions for the movie',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateSessionDto, {
    discriminator: {
      property: 'id',
      subTypes: [
        { value: UpdateNestedSessionDto, name: 'update' },
        { value: CreateNestedSessionDto, name: 'create' },
      ],
    },
  })
  @IsOptional()
  sessions?: (CreateNestedSessionDto | UpdateNestedSessionDto)[];
}
