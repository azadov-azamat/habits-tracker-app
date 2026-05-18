import { computeStreakStats, isDoneToday } from '@/services/streakCalculator';
import type { Habit } from '@/store/types';
import { addDaysKey, todayKey } from '@/utils/dateHelpers';

function makeHabit(overrides: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    tier: 'main',
    name: 'Test',
    emoji: '🌱',
    why: 'why',
    identity: 'sog‘lom',
    intentionWhen: 'ertalab',
    intentionThen: 'qilaman',
    minimalVersion: 'kichik',
    startDate: todayKey(),
    reminderTime: '08:00',
    snoozeIntervalMin: 15,
    maxSnoozes: 3,
    status: 'active',
    checkIns: {},
    scheduledNotificationIds: [],
    weeklyReflections: {},
    celebratedMilestones: [],
    ...overrides,
  };
}

function checkInsFor(startKey: string, pattern: boolean[]): Habit['checkIns'] {
  const map: Habit['checkIns'] = {};
  pattern.forEach((done, i) => {
    if (done) {
      map[addDaysKey(startKey, i)] = { done: true, timestamp: i };
    }
  });
  return map;
}

describe('streakCalculator', () => {
  describe('isDoneToday', () => {
    it('false when no check-in', () => {
      expect(isDoneToday(makeHabit())).toBe(false);
    });

    it('true when today is checked in', () => {
      const today = todayKey();
      const habit = makeHabit({ checkIns: { [today]: { done: true, timestamp: 0 } } });
      expect(isDoneToday(habit)).toBe(true);
    });

    it('false when done is explicitly false', () => {
      const today = todayKey();
      const habit = makeHabit({ checkIns: { [today]: { done: false, timestamp: 0 } } });
      expect(isDoneToday(habit)).toBe(false);
    });
  });

  describe('computeStreakStats', () => {
    it('day 1, no check-in: zero stats', () => {
      const stats = computeStreakStats(makeHabit());
      expect(stats.currentDay).toBe(1);
      expect(stats.currentStreak).toBe(0);
      expect(stats.longestStreak).toBe(0);
      expect(stats.totalDone).toBe(0);
      expect(stats.completionRate).toBe(0);
    });

    it('day 1 checked in', () => {
      const today = todayKey();
      const habit = makeHabit({ checkIns: { [today]: { done: true, timestamp: 0 } } });
      const stats = computeStreakStats(habit);
      expect(stats.totalDone).toBe(1);
      expect(stats.currentStreak).toBe(1);
      expect(stats.longestStreak).toBe(1);
      expect(stats.completionRate).toBe(100);
    });

    it('5 consecutive days starting 5 days ago', () => {
      const start = addDaysKey(todayKey(), -4);
      const habit = makeHabit({
        startDate: start,
        checkIns: checkInsFor(start, [true, true, true, true, true]),
      });
      const stats = computeStreakStats(habit);
      expect(stats.currentDay).toBe(5);
      expect(stats.totalDone).toBe(5);
      expect(stats.currentStreak).toBe(5);
      expect(stats.longestStreak).toBe(5);
      expect(stats.completionRate).toBe(100);
    });

    it('broken streak: 3 done, 1 missed, 1 done', () => {
      const start = addDaysKey(todayKey(), -4);
      const habit = makeHabit({
        startDate: start,
        checkIns: checkInsFor(start, [true, true, true, false, true]),
      });
      const stats = computeStreakStats(habit);
      expect(stats.totalDone).toBe(4);
      expect(stats.longestStreak).toBe(3);
      expect(stats.currentStreak).toBe(1);
      expect(stats.completionRate).toBe(80);
    });

    it('detects missed yesterday', () => {
      const start = addDaysKey(todayKey(), -2);
      const habit = makeHabit({
        startDate: start,
        checkIns: checkInsFor(start, [true, false, false]),
      });
      const stats = computeStreakStats(habit);
      expect(stats.missedYesterday).toBe(true);
      expect(stats.missedTwoInARow).toBe(false);
    });

    it('detects two days in a row missed', () => {
      const start = addDaysKey(todayKey(), -3);
      const habit = makeHabit({
        startDate: start,
        checkIns: checkInsFor(start, [true, false, false, false]),
      });
      const stats = computeStreakStats(habit);
      expect(stats.missedYesterday).toBe(true);
      expect(stats.missedTwoInARow).toBe(true);
    });

    it('today not done does not break running streak', () => {
      const start = addDaysKey(todayKey(), -2);
      const habit = makeHabit({
        startDate: start,
        checkIns: checkInsFor(start, [true, true, false]),
      });
      const stats = computeStreakStats(habit);
      expect(stats.currentStreak).toBe(2);
      expect(stats.missedYesterday).toBe(false);
    });

    it('completion rate caps at 40 elapsed days', () => {
      const start = addDaysKey(todayKey(), -49);
      const checkIns: Habit['checkIns'] = {};
      for (let i = 0; i < 20; i++) {
        checkIns[addDaysKey(start, i)] = { done: true, timestamp: i };
      }
      const habit = makeHabit({ startDate: start, checkIns });
      const stats = computeStreakStats(habit);
      expect(stats.completionRate).toBeLessThanOrEqual(100);
      expect(stats.completionRate).toBeGreaterThan(0);
    });
  });
});
