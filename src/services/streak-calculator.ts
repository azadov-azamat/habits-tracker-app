import { addDaysKey, dayNumber, todayKey } from '@/utils/date-helpers';
import type { Habit } from '@/store/types';

export type StreakStats = {
  currentStreak: number;
  longestStreak: number;
  totalDone: number;
  completionRate: number;
  currentDay: number;
  missedYesterday: boolean;
  missedTwoInARow: boolean;
};

export function computeStreakStats(habit: Habit): StreakStats {
  const today = todayKey();
  const currentDay = Math.max(1, dayNumber(habit.startDate));

  let totalDone = 0;
  let longestStreak = 0;
  let runningStreak = 0;
  for (let i = 0; i < currentDay; i++) {
    const day = addDaysKey(habit.startDate, i);
    if (day > today) break;
    const entry = habit.checkIns[day];
    if (entry?.done) {
      totalDone++;
      runningStreak++;
      if (runningStreak > longestStreak) longestStreak = runningStreak;
    } else {
      if (day !== today) {
        runningStreak = 0;
      }
    }
  }

  let currentStreak = 0;
  for (let i = 0; i < currentDay; i++) {
    const day = addDaysKey(today, -i);
    if (day < habit.startDate) break;
    const entry = habit.checkIns[day];
    if (entry?.done) {
      currentStreak++;
    } else if (day === today) {
      continue;
    } else {
      break;
    }
  }

  const elapsedDays = Math.min(currentDay, 40);
  const completionRate = elapsedDays > 0 ? Math.round((totalDone / elapsedDays) * 100) : 0;

  const yesterday = addDaysKey(today, -1);
  const dayBefore = addDaysKey(today, -2);
  const missedYesterday = yesterday >= habit.startDate && !habit.checkIns[yesterday]?.done;
  const missedTwoInARow =
    missedYesterday &&
    dayBefore >= habit.startDate &&
    !habit.checkIns[dayBefore]?.done;

  return {
    currentStreak,
    longestStreak,
    totalDone,
    completionRate,
    currentDay,
    missedYesterday,
    missedTwoInARow,
  };
}

export function isDoneToday(habit: Habit): boolean {
  return !!habit.checkIns[todayKey()]?.done;
}
