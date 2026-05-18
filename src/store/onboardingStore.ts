import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OnboardingDraft = {
  identity?: string;
  emoji?: string;
  name?: string;
  why?: string;
  intentionWhen?: string;
  intentionThen?: string;
  minimalVersion?: string;
  reminderTime?: string;
  snoozeIntervalMin?: number;
  maxSnoozes?: number;
};

type OnboardingState = {
  completed: boolean;
  draft: OnboardingDraft;
  setDraft: (patch: Partial<OnboardingDraft>) => void;
  resetDraft: () => void;
  markCompleted: () => void;
  reset: () => void;
};

const defaultDraft: OnboardingDraft = {
  reminderTime: '08:00',
  snoozeIntervalMin: 15,
  maxSnoozes: 3,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      draft: defaultDraft,
      setDraft: (patch) => set((s) => ({ draft: { ...s.draft, ...patch } })),
      resetDraft: () => set({ draft: defaultDraft }),
      markCompleted: () => set({ completed: true, draft: defaultDraft }),
      reset: () => set({ completed: false, draft: defaultDraft }),
    }),
    {
      name: 'qirqkun.onboarding.v1',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
