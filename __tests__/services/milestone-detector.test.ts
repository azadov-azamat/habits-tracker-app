import { getUnseenMilestone, isChillaComplete, MILESTONE_DAYS } from '@/services/milestone-detector';
import type { Habit } from '@/store/types';
import { addDaysKey, todayKey } from '@/utils/date-helpers';

function habitWithDone(daysAgo: number, doneCount: number, celebrated: number[] = []): Habit {
  const start = addDaysKey(todayKey(), -daysAgo);
  const checkIns: Habit['checkIns'] = {};
  for (let i = 0; i < doneCount; i++) {
    checkIns[addDaysKey(start, i)] = { done: true, timestamp: i };
  }
  return {
    id: 'h',
    tier: 'main',
    name: 'X',
    emoji: '🌱',
    why: '',
    identity: '',
    intentionWhen: '',
    intentionThen: '',
    minimalVersion: '',
    startDate: start,
    reminderTime: '08:00',
    snoozeIntervalMin: 15,
    maxSnoozes: 3,
    status: 'active',
    checkIns,
    scheduledNotificationIds: [],
    weeklyReflections: {},
    celebratedMilestones: celebrated,
  };
}

describe('milestoneDetector', () => {
  describe('MILESTONE_DAYS', () => {
    it('matches the chilla rhythm', () => {
      expect(MILESTONE_DAYS).toEqual([1, 7, 14, 21, 30, 40]);
    });
  });

  describe('getUnseenMilestone', () => {
    it('returns null on day 1 with no check-ins', () => {
      expect(getUnseenMilestone(habitWithDone(0, 0))).toBeNull();
    });

    it('returns 1 on day 1 with one check-in', () => {
      expect(getUnseenMilestone(habitWithDone(0, 1))).toBe(1);
    });

    it('skips already-celebrated milestones', () => {
      expect(getUnseenMilestone(habitWithDone(0, 1, [1]))).toBeNull();
    });

    it('returns 7 after a week of check-ins', () => {
      expect(getUnseenMilestone(habitWithDone(6, 7, [1]))).toBe(7);
    });

    it('returns the lowest unseen milestone', () => {
      // Day 7 reached but unseen even though 14 is also passed
      const h = habitWithDone(13, 14, [1]);
      expect(getUnseenMilestone(h)).toBe(7);
    });

    it('returns 14 when 1 and 7 already celebrated', () => {
      const h = habitWithDone(13, 14, [1, 7]);
      expect(getUnseenMilestone(h)).toBe(14);
    });

    it('returns 40 only when 40 check-ins reached', () => {
      const partial = habitWithDone(45, 35, [1, 7, 14, 21, 30]);
      expect(getUnseenMilestone(partial)).toBeNull();
      const complete = habitWithDone(45, 40, [1, 7, 14, 21, 30]);
      expect(getUnseenMilestone(complete)).toBe(40);
    });

    it('does not return milestone if elapsed but check-ins insufficient', () => {
      // 21 days elapsed but only 5 done
      const h = habitWithDone(20, 5, [1]);
      expect(getUnseenMilestone(h)).toBeNull();
    });
  });

  describe('isChillaComplete', () => {
    it('false under 40 done', () => {
      expect(isChillaComplete(habitWithDone(45, 39))).toBe(false);
    });

    it('true at 40 done', () => {
      expect(isChillaComplete(habitWithDone(45, 40))).toBe(true);
    });

    it('true above 40 done', () => {
      expect(isChillaComplete(habitWithDone(50, 45))).toBe(true);
    });
  });
});
