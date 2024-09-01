import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { TimeSlot } from '../../../common/constants/time-slots.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConvertTimeRange } from '../../../common/decorators/convert-time-range.decorator';

export class UpdateNestedSessionDto {
  @ApiProperty({ example: 1, description: 'The ID of the session' })
  @IsNumber()
  id: number;

  @ApiPropertyOptional({
    example: '2024-10-20',
    description: 'The date of the session',
  })
  @IsDateString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    example: '10:00-12:00',
    description: 'The time slot of the session',
  })
  @IsString()
  @ConvertTimeRange()
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @ApiPropertyOptional({
    example: 1,
    description: 'The room number for the session',
  })
  @IsNumber()
  @IsOptional()
  roomNumber?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'The ID of the movie for this session',
  })
  @IsNumber()
  @IsOptional()
  movieId?: number;
}
