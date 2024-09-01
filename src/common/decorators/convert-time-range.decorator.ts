import { Transform } from 'class-transformer';
import { convertTimeRangeToTimeSlot } from '../utils/movies.utils';

export function ConvertTimeRange() {
  return Transform(({ value }) => convertTimeRangeToTimeSlot(value));
}
