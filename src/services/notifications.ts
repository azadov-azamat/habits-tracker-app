import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import i18n from '@/i18n';
import type { Habit } from '@/store/types';
import { dayNumber, parseTime } from '@/utils/dateHelpers';

const HABIT_CATEGORY = 'HABIT_REMINDER';
const CHANNEL_ID = 'habit-reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureNotificationSetup(): Promise<void> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: i18n.t('notifications.channel.name'),
      description: i18n.t('notifications.channel.description'),
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  await Notifications.setNotificationCategoryAsync(HABIT_CATEGORY, [
    {
      identifier: 'DONE',
      buttonTitle: i18n.t('notifications.reminder.actionDone'),
      options: { opensAppToForeground: false },
    },
    {
      identifier: 'SNOOZE',
      buttonTitle: i18n.t('notifications.reminder.actionSnooze'),
      options: { opensAppToForeground: false },
    },
  ]);
}

export async function requestPermissions(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) return true;
  const req = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });
  return req.granted;
}

export async function cancelIds(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
}

export async function scheduleDailyReminder(habit: Habit): Promise<string> {
  const { hour, minute } = parseTime(habit.reminderTime);
  const day = Math.max(1, dayNumber(habit.startDate));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.reminder.title', {
        emoji: habit.emoji,
        habitName: habit.name,
      }),
      body: i18n.t('notifications.reminder.body', { day }),
      categoryIdentifier: HABIT_CATEGORY,
      data: { habitId: habit.id, type: 'daily' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
      channelId: CHANNEL_ID,
    },
  });

  return id;
}

export async function scheduleSnoozeChain(
  habit: Habit,
  startInMinutes: number,
): Promise<string[]> {
  const ids: string[] = [];
  const total = Math.min(habit.maxSnoozes, 5);
  for (let i = 1; i <= total; i++) {
    const seconds = (startInMinutes + (i - 1) * habit.snoozeIntervalMin) * 60;
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: i18n.t('notifications.snooze.title', { emoji: habit.emoji }),
        body: i18n.t('notifications.snooze.body'),
        categoryIdentifier: HABIT_CATEGORY,
        data: { habitId: habit.id, type: 'snooze' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
        repeats: false,
        channelId: CHANNEL_ID,
      },
    });
    ids.push(id);
  }
  return ids;
}

export async function cancelHabitNotifications(habit: Habit): Promise<void> {
  await cancelIds(habit.scheduledNotificationIds);
}

export async function rescheduleHabit(habit: Habit): Promise<string[]> {
  await cancelHabitNotifications(habit);
  const dailyId = await scheduleDailyReminder(habit);
  return [dailyId];
}

export async function scheduleMorningGreeting(time: string): Promise<string> {
  const { hour, minute } = parseTime(time);
  return Notifications.scheduleNotificationAsync({
    content: {
      title: i18n.t('notifications.morningGreeting.title'),
      body: i18n.t('notifications.morningGreeting.body', { day: '?' }),
      data: { type: 'morning' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      hour,
      minute,
      repeats: true,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
