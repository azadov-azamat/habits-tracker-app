import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useHabitsStore } from '@/store/habitsStore';
import { cancelIds, scheduleSnoozeChain } from '@/services/notifications';
import { todayKey } from '@/utils/dateHelpers';

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
        const newIds = await scheduleSnoozeChain(habit, habit.snoozeIntervalMin);
        state.attachNotificationIds(habitId, [
          ...habit.scheduledNotificationIds,
          ...newIds,
        ]);
      } else {
        if (data?.type === 'daily' && !habit.checkIns[todayKey()]?.done) {
          const newIds = await scheduleSnoozeChain(habit, habit.snoozeIntervalMin);
          state.attachNotificationIds(habitId, [
            ...habit.scheduledNotificationIds,
            ...newIds,
          ]);
        }
      }
    });
    return () => sub.remove();
  }, []);
}
