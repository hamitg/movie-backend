import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  Matches,
  IsEnum,
} from 'class-validator';
import { TimeSlot } from '../../../common/constants/time-slots.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConvertTimeRange } from '../../../common/decorators/convert-time-range.decorator';

export class UpdateSessionDto {
  @ApiPropertyOptional({
    example: '2023-11-20',
    description: 'The date of the session',
  })
  @IsDateString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in the format YYYY-MM-DD',
  })
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
