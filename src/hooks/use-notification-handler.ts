import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useHabitsStore } from '@/store/habits-store';
import { cancelIds, safeScheduleSnoozeChain } from '@/services/notifications';
import { todayKey } from '@/utils/date-helpers';

export function useNotificationHandler() {
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const action = response.actionIdentifier;
      const data = response.notification.request.content.data as
        | { habitId?: string; type?: string }
        | undefined;
      const habitId = data?.habitId;
      if (!habitId) return;

      const state = useHabitsStore.getState();
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return;

      if (action === 'DONE') {
        state.checkIn(habitId);
        await cancelIds(habit.scheduledNotificationIds.filter((id) => id !== response.notification.request.identifier));
      } else if (action === 'SNOOZE') {
        const scheduled = await safeScheduleSnoozeChain(habit, habit.snoozeIntervalMin);
        if (scheduled.ok) {
          state.attachNotificationIds(habitId, [
            ...habit.scheduledNotificationIds,
            ...scheduled.value,
          ]);
        }
      } else {
        if (data?.type === 'daily' && !habit.checkIns[todayKey()]?.done) {
          const scheduled = await safeScheduleSnoozeChain(habit, habit.snoozeIntervalMin);
          if (scheduled.ok) {
            state.attachNotificationIds(habitId, [
              ...habit.scheduledNotificationIds,
              ...scheduled.value,
            ]);
          }
        }
      }
    });
    return () => sub.remove();
  }, []);
}
