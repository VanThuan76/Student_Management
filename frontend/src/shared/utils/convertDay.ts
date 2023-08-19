import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(timezone);
dayjs.extend(utc);

export const formattedDate = (originalDate: string): string => {
  const formatted = dayjs.utc(originalDate).tz('UTC').format('DD/MM/YYYY');
  return formatted;
};
