import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  TimeSlot,
  TIME_SLOT_RANGES,
} from '../../../common/constants/time-slots.constants';

export class GetSessionResponseDto {
  @Expose()
  @ApiProperty({ example: 1, description: 'The ID of the session' })
  id: number;

  @Expose()
  @ApiProperty({
    example: '2023-06-15',
    description: 'The date of the session',
  })
  date: string;

  @Expose()
  @Transform(({ value }) => TIME_SLOT_RANGES[value as TimeSlot] || value)
  @ApiProperty({
    example: '10:00-12:00',
    description: 'The time slot of the session',
  })
  timeSlot: string;

  @Expose()
  @ApiProperty({ example: 1, description: 'The room number for the session' })
  roomNumber: number;

  @Expose()
  @ApiProperty({
    example: 1,
    description: 'The ID of the movie for this session',
  })
  movieId: number;

  constructor(partial: Partial<GetSessionResponseDto>) {
    Object.assign(this, partial);
  }
}
