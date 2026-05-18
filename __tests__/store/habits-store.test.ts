import {
  canAddMicroHabit,
  hasMainHabit,
  selectCompletedHabits,
  selectMainHabit,
  selectMicroHabits,
  useHabitsStore,
} from '@/store/habits-store';
import { MAX_MICRO_HABITS, type CreateHabitInput } from '@/store/types';
import { todayKey, yesterdayKey } from '@/utils/date-helpers';

function baseInput(over: Partial<CreateHabitInput> = {}): CreateHabitInput {
  return {
    tier: 'main',
    name: 'Suv ichish',
    emoji: '💧',
    why: 'sog‘liq',
    identity: 'sog‘lom inson',
    intentionWhen: 'ertalab',
    intentionThen: '1 stakan suv',
    minimalVersion: '1 qultum',
    reminderTime: '08:00',
    snoozeIntervalMin: 15,
    maxSnoozes: 3,
    ...over,
  };
}

beforeEach(() => {
  useHabitsStore.setState({ habits: [] });
});

describe('habitsStore', () => {
  describe('addHabit', () => {
    it('creates a habit with defaults', () => {
      const habit = useHabitsStore.getState().addHabit(baseInput());
      expect(habit.id).toBeTruthy();
      expect(habit.status).toBe('active');
      expect(habit.startDate).toBe(todayKey());
      expect(habit.checkIns).toEqual({});
      expect(habit.celebratedMilestones).toEqual([]);
    });

    it('appends to habits list', () => {
      useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'meditatsiya' }));
      expect(useHabitsStore.getState().habits).toHaveLength(2);
    });
  });

  describe('updateHabit', () => {
    it('patches fields without losing others', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().updateHabit(h.id, { name: 'Yangi nom' });
      const updated = useHabitsStore.getState().habits[0]!;
      expect(updated.name).toBe('Yangi nom');
      expect(updated.emoji).toBe('💧');
    });

    it('only touches the matched habit', () => {
      const a = useHabitsStore.getState().addHabit(baseInput({ name: 'A' }));
      const b = useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'B' }));
      useHabitsStore.getState().updateHabit(a.id, { name: 'A2' });
      const habits = useHabitsStore.getState().habits;
      expect(habits.find((h) => h.id === a.id)?.name).toBe('A2');
      expect(habits.find((h) => h.id === b.id)?.name).toBe('B');
    });
  });

  describe('checkIn / undoCheckIn', () => {
    it('marks today done', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().checkIn(h.id);
      expect(useHabitsStore.getState().habits[0]!.checkIns[todayKey()]?.done).toBe(true);
    });

    it('records a note', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().checkIn(h.id, todayKey(), 'qiyin bo‘ldi');
      expect(useHabitsStore.getState().habits[0]!.checkIns[todayKey()]?.note).toBe('qiyin bo‘ldi');
    });

    it('can check in for past date', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().checkIn(h.id, yesterdayKey());
      expect(useHabitsStore.getState().habits[0]!.checkIns[yesterdayKey()]?.done).toBe(true);
      expect(useHabitsStore.getState().habits[0]!.checkIns[todayKey()]).toBeUndefined();
    });

    it('undoCheckIn removes today entry', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().checkIn(h.id);
      useHabitsStore.getState().undoCheckIn(h.id);
      expect(useHabitsStore.getState().habits[0]!.checkIns[todayKey()]).toBeUndefined();
    });

    it('undoCheckIn only removes specified day', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().checkIn(h.id, yesterdayKey());
      useHabitsStore.getState().checkIn(h.id, todayKey());
      useHabitsStore.getState().undoCheckIn(h.id, yesterdayKey());
      const map = useHabitsStore.getState().habits[0]!.checkIns;
      expect(map[yesterdayKey()]).toBeUndefined();
      expect(map[todayKey()]?.done).toBe(true);
    });
  });

  describe('markMilestoneCelebrated', () => {
    it('appends unique values', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().markMilestoneCelebrated(h.id, 7);
      useHabitsStore.getState().markMilestoneCelebrated(h.id, 7);
      useHabitsStore.getState().markMilestoneCelebrated(h.id, 14);
      expect(
        useHabitsStore.getState().habits[0]!.celebratedMilestones.slice().sort((a, b) => a - b),
      ).toEqual([7, 14]);
    });
  });

  describe('addWeeklyReflection', () => {
    it('stores reflection by week index', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().addWeeklyReflection(h.id, 1, 'yaxshi o‘tdi');
      useHabitsStore.getState().addWeeklyReflection(h.id, 2, 'o‘rtacha');
      const r = useHabitsStore.getState().habits[0]!.weeklyReflections;
      expect(r[1]).toBe('yaxshi o‘tdi');
      expect(r[2]).toBe('o‘rtacha');
    });
  });

  describe('setStatus', () => {
    it('updates status', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().setStatus(h.id, 'paused');
      expect(useHabitsStore.getState().habits[0]!.status).toBe('paused');
    });
  });

  describe('deleteHabit / clearAll', () => {
    it('removes single habit', () => {
      const a = useHabitsStore.getState().addHabit(baseInput({ name: 'A' }));
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'B' }));
      useHabitsStore.getState().deleteHabit(a.id);
      expect(useHabitsStore.getState().habits).toHaveLength(1);
      expect(useHabitsStore.getState().habits[0]!.name).toBe('B');
    });

    it('clears all', () => {
      useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'B' }));
      useHabitsStore.getState().clearAll();
      expect(useHabitsStore.getState().habits).toEqual([]);
    });
  });

  describe('attachNotificationIds', () => {
    it('attaches and overwrites ids', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().attachNotificationIds(h.id, ['n1', 'n2']);
      expect(useHabitsStore.getState().habits[0]!.scheduledNotificationIds).toEqual(['n1', 'n2']);
      useHabitsStore.getState().attachNotificationIds(h.id, ['n3']);
      expect(useHabitsStore.getState().habits[0]!.scheduledNotificationIds).toEqual(['n3']);
    });
  });

  describe('selectors', () => {
    it('selectMainHabit ignores micro habits', () => {
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'M' }));
      const main = useHabitsStore.getState().addHabit(baseInput({ tier: 'main', name: 'MAIN' }));
      expect(selectMainHabit(useHabitsStore.getState())?.id).toBe(main.id);
    });

    it('selectMainHabit ignores completed', () => {
      const main = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().setStatus(main.id, 'completed');
      expect(selectMainHabit(useHabitsStore.getState())).toBeUndefined();
    });

    it('selectMicroHabits returns only micros', () => {
      useHabitsStore.getState().addHabit(baseInput({ tier: 'main' }));
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'M1' }));
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'M2' }));
      expect(selectMicroHabits(useHabitsStore.getState())).toHaveLength(2);
    });

    it('selectCompletedHabits returns archived', () => {
      const h = useHabitsStore.getState().addHabit(baseInput());
      useHabitsStore.getState().setStatus(h.id, 'completed');
      expect(selectCompletedHabits(useHabitsStore.getState())).toHaveLength(1);
    });

    it('canAddMicroHabit enforces MAX_MICRO_HABITS', () => {
      expect(MAX_MICRO_HABITS).toBe(2);
      expect(canAddMicroHabit(useHabitsStore.getState())).toBe(true);
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: '1' }));
      expect(canAddMicroHabit(useHabitsStore.getState())).toBe(true);
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: '2' }));
      expect(canAddMicroHabit(useHabitsStore.getState())).toBe(false);
    });

    it('canAddMicroHabit ignores completed micros', () => {
      const a = useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: '1' }));
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: '2' }));
      expect(canAddMicroHabit(useHabitsStore.getState())).toBe(false);
      useHabitsStore.getState().setStatus(a.id, 'completed');
      expect(canAddMicroHabit(useHabitsStore.getState())).toBe(true);
    });

    it('hasMainHabit is false until added', () => {
      expect(hasMainHabit(useHabitsStore.getState())).toBe(false);
      useHabitsStore.getState().addHabit(baseInput({ tier: 'micro', name: 'M' }));
      expect(hasMainHabit(useHabitsStore.getState())).toBe(false);
      useHabitsStore.getState().addHabit(baseInput({ tier: 'main' }));
      expect(hasMainHabit(useHabitsStore.getState())).toBe(true);
    });
  });
});
