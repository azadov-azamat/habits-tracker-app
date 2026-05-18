import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { todayKey } from '@/utils/dateHelpers';
import {
  CHILLA_LENGTH,
  type CheckIn,
  type CreateHabitInput,
  type Habit,
  MAX_MICRO_HABITS,
} from './types';

type HabitsState = {
  habits: Habit[];
  addHabit: (input: CreateHabitInput) => Habit;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setStatus: (id: string, status: Habit['status']) => void;
  checkIn: (id: string, dateKey?: string, note?: string) => void;
  undoCheckIn: (id: string, dateKey?: string) => void;
  markMilestoneCelebrated: (id: string, day: number) => void;
  addWeeklyReflection: (id: string, week: number, text: string) => void;
  attachNotificationIds: (id: string, ids: string[]) => void;
  clearAll: () => void;
};

function makeId(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],

      addHabit: (input) => {
        const habit: Habit = {
          id: makeId(),
          startDate: todayKey(),
          status: 'active',
          checkIns: {},
          scheduledNotificationIds: [],
          weeklyReflections: {},
          celebratedMilestones: [],
          ...input,
        };
        set((s) => ({ habits: [...s.habits, habit] }));
        return habit;
      },

      updateHabit: (id, patch) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...patch } : h)),
        })),

      deleteHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      setStatus: (id, status) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, status } : h)),
        })),

      checkIn: (id, dateKey, note) => {
        const key = dateKey ?? todayKey();
        const entry: CheckIn = {
          done: true,
          note,
          timestamp: Date.now(),
        };
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? { ...h, checkIns: { ...h.checkIns, [key]: entry } }
              : h,
          ),
        }));
      },

      undoCheckIn: (id, dateKey) => {
        const key = dateKey ?? todayKey();
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h;
            const { [key]: _omit, ...rest } = h.checkIns;
            return { ...h, checkIns: rest };
          }),
        }));
      },

      markMilestoneCelebrated: (id, day) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  celebratedMilestones: Array.from(
                    new Set([...h.celebratedMilestones, day]),
                  ),
                }
              : h,
          ),
        })),

      addWeeklyReflection: (id, week, text) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  weeklyReflections: { ...h.weeklyReflections, [week]: text },
                }
              : h,
          ),
        })),

      attachNotificationIds: (id, ids) =>
        set((s) => ({
          habits: s.habits.map((h) =>
            h.id === id ? { ...h, scheduledNotificationIds: ids } : h,
          ),
        })),

      clearAll: () => set({ habits: [] }),
    }),
    {
      name: 'qirqkun.habits.v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);

export function selectMainHabit(state: HabitsState): Habit | undefined {
  return state.habits.find((h) => h.tier === 'main' && h.status !== 'completed');
}

export function selectMicroHabits(state: HabitsState): Habit[] {
  return state.habits.filter((h) => h.tier === 'micro' && h.status !== 'completed');
}

export function selectCompletedHabits(state: HabitsState): Habit[] {
  return state.habits.filter((h) => h.status === 'completed');
}

export function canAddMicroHabit(state: HabitsState): boolean {
  return selectMicroHabits(state).length < MAX_MICRO_HABITS;
}

export function hasMainHabit(state: HabitsState): boolean {
  return state.habits.some((h) => h.tier === 'main' && h.status !== 'completed');
}

export const CHILLA_DAYS = CHILLA_LENGTH;
