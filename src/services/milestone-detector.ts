import { dayNumber } from '@/utils/date-helpers';
import type { Habit } from '@/store/types';

export const MILESTONE_DAYS = [1, 7, 14, 21, 30, 40] as const;
export type MilestoneDay = (typeof MILESTONE_DAYS)[number];

export function getUnseenMilestone(habit: Habit): MilestoneDay | null {
  const current = dayNumber(habit.startDate);
  for (const day of MILESTONE_DAYS) {
    if (current >= day && !habit.celebratedMilestones.includes(day)) {
      const reachedDayKey = Object.keys(habit.checkIns).filter(
        (k) => habit.checkIns[k]?.done,
      );
      if (reachedDayKey.length >= day) {
        return day;
      }
    }
  }
  return null;
}

export function isChillaComplete(habit: Habit): boolean {
  const doneCount = Object.values(habit.checkIns).filter((c) => c.done).length;
  return doneCount >= 40;
}
