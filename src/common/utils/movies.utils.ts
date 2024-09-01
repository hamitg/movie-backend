import { TimeSlot, TIME_SLOT_RANGES } from '../constants/time-slots.constants';

export function getDateFromSession(date: string, timeSlot: string) {
  const sessionDate = new Date(date);
  const [startTime] = TIME_SLOT_RANGES[timeSlot as TimeSlot].split('-');
  const [hours, minutes] = startTime.split(':').map(Number);
  sessionDate.setHours(hours, minutes, 0, 0);
  return sessionDate;
}

export function convertTimeSlot(args: any, query: any) {
  if (
    typeof args.data.timeSlot === 'string' &&
    args.data.timeSlot.includes(':')
  ) {
    args.data.timeSlot = convertTimeRangeToTimeSlot(args.data.timeSlot);
  }
  return query(args);
}

export function convertTimeRangeToTimeSlot(timeRange: string): TimeSlot {
  const entry = Object.entries(TIME_SLOT_RANGES).find(
    ([_, value]) => value === timeRange,
  );
  if (!entry) {
    throw new Error(`Invalid time range: ${timeRange}`);
  }
  return entry[0] as TimeSlot;
}
