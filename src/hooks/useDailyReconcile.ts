import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useHabitsStore } from '@/store/habitsStore';
import { setHapticsEnabled } from '@/utils/haptics';
import { useSettingsStore } from '@/store/settingsStore';

export function useDailyReconcile() {
  const lastState = useRef<AppStateStatus>(AppState.currentState);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (lastState.current.match(/inactive|background/) && state === 'active') {
        const habits = useHabitsStore.getState().habits;
        for (const _h of habits) {
          // future hook: reconcile pending snoozes vs check-in state
        }
      }
      lastState.current = state;
    });
    return () => sub.remove();
  }, []);
}
