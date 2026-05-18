import uz from '@/i18n/locales/uz.json';

const REQUIRED_PATHS = [
  'app.name',
  'common.next',
  'common.cancel',
  'common.delete',
  'onboarding.welcome.headline',
  'onboarding.welcome.start',
  'onboarding.identity.title',
  'onboarding.identity.label',
  'onboarding.habit.title',
  'onboarding.habit.nameLabel',
  'onboarding.why.title',
  'onboarding.intention.title',
  'onboarding.intention.whenLabel',
  'onboarding.intention.thenLabel',
  'onboarding.intention.minimalLabel',
  'onboarding.schedule.title',
  'onboarding.schedule.timeLabel',
  'onboarding.schedule.intervalLabel',
  'onboarding.permissions.title',
  'onboarding.permissions.allow',
  'home.greetingMorning',
  'home.greetingDay',
  'home.greetingEvening',
  'home.dayCounter',
  'home.checkIn',
  'home.alreadyDone',
  'home.undo',
  'home.whyTitle',
  'home.microHabitsTitle',
  'home.addMicroHabit',
  'home.minimalCard.title',
  'home.missedCard.title',
  'home.twoMissedCard.title',
  'progress.title',
  'progress.currentStreak',
  'progress.longestStreak',
  'progress.totalDone',
  'progress.completionRate',
  'habit.details',
  'habit.delete',
  'habit.pause',
  'habit.resume',
  'habit.newMicroHabit',
  'milestones.day1.title',
  'milestones.day7.title',
  'milestones.day14.title',
  'milestones.day21.title',
  'milestones.day30.title',
  'milestones.day40.title',
  'milestones.continue',
  'settings.title',
  'settings.theme',
  'settings.notifications',
  'settings.clearData',
  'notifications.channel.name',
  'notifications.reminder.title',
  'notifications.reminder.body',
  'notifications.reminder.actionDone',
  'notifications.reminder.actionSnooze',
  'quotes.section',
];

function pluck(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

describe('uz.json', () => {
  for (const path of REQUIRED_PATHS) {
    it(`provides "${path}"`, () => {
      const v = pluck(uz as unknown as Record<string, unknown>, path);
      expect(typeof v).toBe('string');
      expect((v as string).length).toBeGreaterThan(0);
    });
  }

  it('milestones have title and body for each day', () => {
    for (const day of [1, 7, 14, 21, 30, 40]) {
      expect(pluck(uz as unknown as Record<string, unknown>, `milestones.day${day}.title`)).toBeTruthy();
      expect(pluck(uz as unknown as Record<string, unknown>, `milestones.day${day}.body`)).toBeTruthy();
    }
  });
});
