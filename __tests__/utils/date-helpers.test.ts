import {
  addDaysKey,
  dayNumber,
  daysSince,
  formatDateUz,
  formatTimeHHMM,
  fromDateKey,
  isPastKey,
  isTodayKey,
  parseTime,
  partOfDay,
  toDateKey,
  todayKey,
  yesterdayKey,
} from '@/utils/date-helpers';

describe('dateHelpers', () => {
  describe('toDateKey / fromDateKey', () => {
    it('zero-pads months and days', () => {
      const d = new Date(2026, 0, 5); // Jan 5
      expect(toDateKey(d)).toBe('2026-01-05');
    });

    it('round-trips through fromDateKey', () => {
      const key = '2026-05-18';
      const date = fromDateKey(key);
      expect(toDateKey(date)).toBe(key);
    });

    it('uses local time, not UTC', () => {
      const d = new Date(2026, 11, 31, 23, 30); // Dec 31 local
      expect(toDateKey(d)).toBe('2026-12-31');
    });
  });

  describe('todayKey / yesterdayKey', () => {
    it('returns today in YYYY-MM-DD', () => {
      expect(todayKey()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('yesterday is one day before today', () => {
      const today = fromDateKey(todayKey());
      const y = fromDateKey(yesterdayKey());
      const diff = Math.round((today.getTime() - y.getTime()) / 86400000);
      expect(diff).toBe(1);
    });
  });

  describe('addDaysKey', () => {
    it('adds positive days', () => {
      expect(addDaysKey('2026-05-18', 3)).toBe('2026-05-21');
    });

    it('subtracts with negative days', () => {
      expect(addDaysKey('2026-05-18', -1)).toBe('2026-05-17');
    });

    it('crosses month boundary', () => {
      expect(addDaysKey('2026-01-31', 1)).toBe('2026-02-01');
    });

    it('crosses year boundary', () => {
      expect(addDaysKey('2026-12-31', 1)).toBe('2027-01-01');
    });

    it('handles leap year', () => {
      expect(addDaysKey('2028-02-28', 1)).toBe('2028-02-29');
      expect(addDaysKey('2028-02-29', 1)).toBe('2028-03-01');
    });
  });

  describe('daysSince / dayNumber', () => {
    it('today is day 1 from today start', () => {
      expect(dayNumber(todayKey())).toBe(1);
    });

    it('day after start is day 2', () => {
      const yesterday = yesterdayKey();
      expect(dayNumber(yesterday)).toBe(2);
    });

    it('daysSince is 0 for today', () => {
      expect(daysSince(todayKey())).toBe(0);
    });
  });

  describe('isTodayKey / isPastKey', () => {
    it('detects today', () => {
      expect(isTodayKey(todayKey())).toBe(true);
      expect(isTodayKey(yesterdayKey())).toBe(false);
    });

    it('detects past', () => {
      expect(isPastKey(yesterdayKey())).toBe(true);
      expect(isPastKey(todayKey())).toBe(false);
      expect(isPastKey(addDaysKey(todayKey(), 5))).toBe(false);
    });
  });

  describe('partOfDay', () => {
    it('returns one of four buckets for current time', () => {
      expect(['morning', 'day', 'evening', 'night']).toContain(partOfDay());
    });

    it.each([
      [5, 'morning'],
      [11, 'morning'],
      [12, 'day'],
      [17, 'day'],
      [18, 'evening'],
      [21, 'evening'],
      [22, 'night'],
      [4, 'night'],
      [0, 'night'],
    ])('hour %i → %s', (hour, expected) => {
      const d = new Date();
      d.setHours(hour, 0, 0, 0);
      expect(partOfDay(d)).toBe(expected);
    });
  });

  describe('parseTime / formatTimeHHMM', () => {
    it('parses HH:MM', () => {
      expect(parseTime('08:30')).toEqual({ hour: 8, minute: 30 });
      expect(parseTime('23:59')).toEqual({ hour: 23, minute: 59 });
      expect(parseTime('00:00')).toEqual({ hour: 0, minute: 0 });
    });

    it('round-trips through formatTimeHHMM', () => {
      const { hour, minute } = parseTime('07:05');
      expect(formatTimeHHMM(hour, minute)).toBe('07:05');
    });

    it('zero-pads single digits', () => {
      expect(formatTimeHHMM(5, 3)).toBe('05:03');
    });
  });

  describe('formatDateUz', () => {
    it('formats month names in Uzbek', () => {
      expect(formatDateUz('2026-05-18')).toBe('18 may 2026');
    });
  });
});
