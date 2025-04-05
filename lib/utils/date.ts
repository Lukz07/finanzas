import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.locale('es');

export function formatDate(date: string | Date): string {
  return dayjs(date).format('LL');
}

export function formatDateISO(date: string | Date): string {
  return dayjs(date).toISOString();
}

export function isWithinLastHour(date: string | Date): boolean {
  const now = dayjs();
  const articleDate = dayjs(date);
  return articleDate.isAfter(now.subtract(1, 'hour'));
}

export function isWithinLastDay(date: string | Date): boolean {
  const now = dayjs();
  const articleDate = dayjs(date);
  return articleDate.isAfter(now.subtract(1, 'day'));
}

export function getTimeAgo(date: string | Date): string {
  return dayjs(date).fromNow();
} 