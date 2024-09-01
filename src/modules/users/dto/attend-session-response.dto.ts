import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  TIME_SLOT_RANGES,
  TimeSlot,
} from '../../../common/constants/time-slots.constants';

export class AttendSessionResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the ticket' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Laleli', description: 'The name of the movie' })
  movieName: string;

  @Expose()
  @ApiProperty({
    example: '2023-06-15',
    description: 'The date and time of the session',
  })
  date: string;

  @Expose()
  @Transform(({ value }) => TIME_SLOT_RANGES[value as TimeSlot] || value)
  @ApiProperty({
    example: '10:00-12:00',
    description: 'The time slot of the session',
  })
  timeSlot: string;

  constructor(partial) {
    Object.assign(this, partial);
  }
}
