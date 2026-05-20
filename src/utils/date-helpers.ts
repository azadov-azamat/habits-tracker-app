import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import { enUS, uz } from 'date-fns/locale';
import type { SupportedLocale } from '@/i18n';

export type DateKey = string;

export function toDateKey(date: Date = new Date()): DateKey {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: DateKey): Date {
  return parseISO(key);
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function yesterdayKey(): DateKey {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toDateKey(d);
}

export function addDaysKey(key: DateKey, days: number): DateKey {
  const d = fromDateKey(key);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function daysSince(startKey: DateKey): number {
  return differenceInCalendarDays(new Date(), fromDateKey(startKey));
}

export function dayNumber(startKey: DateKey): number {
  return daysSince(startKey) + 1;
}

export function isTodayKey(key: DateKey): boolean {
  return key === todayKey();
}

export function isPastKey(key: DateKey): boolean {
  return fromDateKey(key) < fromDateKey(todayKey());
}

export function partOfDay(now: Date = new Date()): 'morning' | 'day' | 'evening' | 'night' {
  const h = now.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'day';
  if (h >= 18 && h < 22) return 'evening';
  return 'night';
}

export function formatTimeHHMM(hour: number, minute: number): string {
  return `${`${hour}`.padStart(2, '0')}:${`${minute}`.padStart(2, '0')}`;
}

export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h ?? 0, minute: m ?? 0 };
}

export function formatDateUz(key: DateKey): string {
  return format(fromDateKey(key), 'd MMMM yyyy', { locale: uz }).toLocaleLowerCase('uz-UZ');
}

export function formatDateLocalized(key: DateKey, locale: SupportedLocale): string {
  if (locale === 'en') {
    return format(fromDateKey(key), 'MMMM d, yyyy', { locale: enUS });
  }

  return formatDateUz(key);
}
