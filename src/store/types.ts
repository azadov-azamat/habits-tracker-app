export const CHILLA_LENGTH = 40;
export const MAX_MICRO_HABITS = 2;

export type HabitTier = 'main' | 'micro';
export type HabitStatus = 'active' | 'completed' | 'paused';

export type CheckIn = {
  done: boolean;
  note?: string;
  timestamp: number;
};

export type Habit = {
  id: string;
  tier: HabitTier;
  name: string;
  emoji: string;
  why: string;
  identity: string;
  intentionWhen: string;
  intentionThen: string;
  minimalVersion: string;
  startDate: string;
  reminderTime: string;
  snoozeIntervalMin: number;
  maxSnoozes: number;
  status: HabitStatus;
  checkIns: Record<string, CheckIn>;
  scheduledNotificationIds: string[];
  weeklyReflections: Record<number, string>;
  celebratedMilestones: number[];
};

export type CreateHabitInput = Omit<
  Habit,
  'id' | 'startDate' | 'status' | 'checkIns' | 'scheduledNotificationIds' | 'weeklyReflections' | 'celebratedMilestones'
>;

export type ThemeMode = 'system' | 'light' | 'dark';
export type LanguageMode = 'uz' | 'en';

export type AppSettings = {
  theme: ThemeMode;
  language: LanguageMode;
  notificationsEnabled: boolean;
  morningGreetingEnabled: boolean;
  morningGreetingTime: string;
  hapticsEnabled: boolean;
};
