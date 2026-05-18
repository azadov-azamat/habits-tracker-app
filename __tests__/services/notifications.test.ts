import * as Notifications from 'expo-notifications';
import {
  cancelAllNotifications,
  cancelHabitNotifications,
  cancelIds,
  ensureNotificationSetup,
  requestPermissions,
  rescheduleHabit,
  scheduleDailyReminder,
  scheduleSnoozeChain,
} from '@/services/notifications';
import type { Habit } from '@/store/types';
import { todayKey } from '@/utils/dateHelpers';

type ScheduledMap = Map<string, Parameters<typeof Notifications.scheduleNotificationAsync>[0]>;
const scheduled = (Notifications as unknown as { __scheduled: ScheduledMap }).__scheduled;

function habit(over: Partial<Habit> = {}): Habit {
  return {
    id: 'h1',
    tier: 'main',
    name: 'Suv',
    emoji: '💧',
    why: '',
    identity: '',
    intentionWhen: '',
    intentionThen: '',
    minimalVersion: '',
    startDate: todayKey(),
    reminderTime: '08:30',
    snoozeIntervalMin: 10,
    maxSnoozes: 3,
    status: 'active',
    checkIns: {},
    scheduledNotificationIds: [],
    weeklyReflections: {},
    celebratedMilestones: [],
    ...over,
  };
}

beforeEach(() => {
  scheduled.clear();
  jest.clearAllMocks();
});

describe('notifications service', () => {
  describe('ensureNotificationSetup', () => {
    it('registers the action category', async () => {
      await ensureNotificationSetup();
      expect(Notifications.setNotificationCategoryAsync).toHaveBeenCalledWith(
        'HABIT_REMINDER',
        expect.arrayContaining([
          expect.objectContaining({ identifier: 'DONE' }),
          expect.objectContaining({ identifier: 'SNOOZE' }),
        ]),
      );
    });
  });

  describe('requestPermissions', () => {
    it('returns true when already granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: true });
      expect(await requestPermissions()).toBe(true);
      expect(Notifications.requestPermissionsAsync).not.toHaveBeenCalled();
    });

    it('asks if not granted', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: true });
      expect(await requestPermissions()).toBe(true);
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('returns false when denied', async () => {
      (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false });
      (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false });
      expect(await requestPermissions()).toBe(false);
    });
  });

  describe('scheduleDailyReminder', () => {
    it('schedules a repeating calendar trigger with parsed time', async () => {
      const id = await scheduleDailyReminder(habit({ reminderTime: '09:15' }));
      expect(id).toBeTruthy();
      const req = scheduled.get(id)!;
      expect(req.trigger).toMatchObject({ hour: 9, minute: 15, repeats: true });
    });

    it('attaches the HABIT_REMINDER category', async () => {
      const id = await scheduleDailyReminder(habit());
      expect(scheduled.get(id)!.content.categoryIdentifier).toBe('HABIT_REMINDER');
    });

    it('embeds habit id in data payload', async () => {
      const id = await scheduleDailyReminder(habit({ id: 'abc' }));
      expect(scheduled.get(id)!.content.data).toMatchObject({ habitId: 'abc', type: 'daily' });
    });
  });

  describe('scheduleSnoozeChain', () => {
    it('schedules N one-shot notifications', async () => {
      const ids = await scheduleSnoozeChain(habit({ snoozeIntervalMin: 10, maxSnoozes: 3 }), 10);
      expect(ids).toHaveLength(3);
      for (const id of ids) {
        const req = scheduled.get(id)!;
        expect(req.trigger).toMatchObject({ repeats: false });
      }
    });

    it('caps at 5 even if maxSnoozes is higher', async () => {
      const ids = await scheduleSnoozeChain(habit({ maxSnoozes: 20 }), 5);
      expect(ids).toHaveLength(5);
    });

    it('intervals grow correctly', async () => {
      const ids = await scheduleSnoozeChain(habit({ snoozeIntervalMin: 10, maxSnoozes: 3 }), 5);
      const seconds = ids.map((id) => (scheduled.get(id)!.trigger as { seconds: number }).seconds);
      expect(seconds).toEqual([5 * 60, 15 * 60, 25 * 60]);
    });
  });

  describe('cancelIds / cancelHabitNotifications', () => {
    it('cancels by id', async () => {
      const id = await scheduleDailyReminder(habit());
      expect(scheduled.has(id)).toBe(true);
      await cancelIds([id]);
      expect(scheduled.has(id)).toBe(false);
    });

    it('cancels all habit ids', async () => {
      const ids = await scheduleSnoozeChain(habit({ maxSnoozes: 3 }), 5);
      const h = habit({ scheduledNotificationIds: ids });
      await cancelHabitNotifications(h);
      for (const id of ids) {
        expect(scheduled.has(id)).toBe(false);
      }
    });

    it('does not throw on unknown ids', async () => {
      await expect(cancelIds(['nope_1', 'nope_2'])).resolves.toBeUndefined();
    });
  });

  describe('rescheduleHabit', () => {
    it('cancels old ids and schedules a new daily one', async () => {
      const stale = await scheduleDailyReminder(habit());
      const h = habit({ scheduledNotificationIds: [stale] });
      const newIds = await rescheduleHabit(h);
      expect(newIds).toHaveLength(1);
      expect(scheduled.has(stale)).toBe(false);
      expect(scheduled.has(newIds[0]!)).toBe(true);
    });
  });

  describe('cancelAllNotifications', () => {
    it('clears every scheduled item', async () => {
      await scheduleDailyReminder(habit());
      await scheduleSnoozeChain(habit({ maxSnoozes: 2 }), 10);
      await cancelAllNotifications();
      expect(scheduled.size).toBe(0);
    });
  });
});
