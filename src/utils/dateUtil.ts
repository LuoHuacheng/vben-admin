/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DATE_TIMEZONE = 'Asia/Shanghai';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_FORMAT_WITHOUT_SEPARATOR = 'YYYYMMDD';

export function formatToDateTime(date: dayjs.ConfigType, format = DATE_TIME_FORMAT): string {
  return dayjs(date).tz(DATE_TIMEZONE).format(format);
}

export function formatToDate(date: dayjs.ConfigType, format = DATE_FORMAT): string {
  if (!date) return '';
  return dayjs(date).tz(DATE_TIMEZONE).format(format);
}

export function formatToDateNoSeparator(
  date: dayjs.ConfigType,
  format = DATE_FORMAT_WITHOUT_SEPARATOR,
): string {
  if (!date) return '';
  return dayjs(date).tz(DATE_TIMEZONE).format(format);
}

export const dateUtil = dayjs;
