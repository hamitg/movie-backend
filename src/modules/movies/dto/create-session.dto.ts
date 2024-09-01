import { IsDateString, IsNumber, IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TimeSlot } from '../../../common/constants/time-slots.constants';
import { ConvertTimeRange } from '../../../common/decorators/convert-time-range.decorator';

export class CreateSessionDto {
  @ApiProperty({
    example: '2023-06-15',
    description: 'The date of the session',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: '10:00-12:00',
    description: 'The time slot of the session',
  })
  @IsString()
  @ConvertTimeRange()
  @IsEnum(TimeSlot)
  timeSlot: TimeSlot;

  @ApiProperty({ example: 1, description: 'The room number for the session' })
  @IsNumber()
  roomNumber: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the movie for this session',
  })
  @IsNumber()
  movieId: number;
}
