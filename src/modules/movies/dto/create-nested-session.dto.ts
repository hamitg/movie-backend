import { IsNumber, IsEnum, IsString } from 'class-validator';
import { TimeSlot } from '../../../common/constants/time-slots.constants';
import { ApiProperty } from '@nestjs/swagger';
import { ConvertTimeRange } from '../../../common/decorators/convert-time-range.decorator';

export class CreateNestedSessionDto {
  @ApiProperty({
    example: '2023-06-15',
    description: 'The date of the session',
  })
  date: any;

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
}
