import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useHabitsStore } from '@/store/habits-store';
import { setHapticsEnabled } from '@/utils/haptics';
import { useSettingsStore } from '@/store/settings-store';
import { reportRecoverableError } from '@/utils/recoverable-error';

export function useDailyReconcile() {
  const lastState = useRef<AppStateStatus>(AppState.currentState);
  const hapticsEnabled = useSettingsStore((s) => s.hapticsEnabled);

  useEffect(() => {
    setHapticsEnabled(hapticsEnabled);
  }, [hapticsEnabled]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (lastState.current.match(/inactive|background/) && state === 'active') {
        try {
          void useHabitsStore.getState().habits.length;
        } catch (error) {
          reportRecoverableError({
            kind: 'startup',
            messageKey: 'errors.startup',
            retryLabelKey: 'common.tryAgain',
            source: 'dailyReconcile.appState',
            error,
          });
        }
      }
      lastState.current = state;
    });
    return () => sub.remove();
  }, []);
}
