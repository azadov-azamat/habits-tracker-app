import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSafeJsonStorage } from './persist-storage';
import type { AppSettings, LanguageMode, ThemeMode } from './types';

type SettingsState = AppSettings & {
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (language: LanguageMode) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setMorningGreetingEnabled: (v: boolean) => void;
  setMorningGreetingTime: (time: string) => void;
  setHapticsEnabled: (v: boolean) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: 'uz',
      notificationsEnabled: true,
      morningGreetingEnabled: true,
      morningGreetingTime: '07:00',
      hapticsEnabled: true,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      setMorningGreetingEnabled: (morningGreetingEnabled) => set({ morningGreetingEnabled }),
      setMorningGreetingTime: (morningGreetingTime) => set({ morningGreetingTime }),
      setHapticsEnabled: (hapticsEnabled) => set({ hapticsEnabled }),
    }),
    {
      name: 'qirqkun.settings.v1',
      storage: createSafeJsonStorage<AppSettings>('settings'),
      version: 1,
    },
  ),
);
