import { useOnboardingStore } from '@/store/onboarding-store';

beforeEach(() => {
  useOnboardingStore.setState({
    completed: false,
    draft: { reminderTime: '08:00', snoozeIntervalMin: 15, maxSnoozes: 3 },
  });
});

describe('onboardingStore', () => {
  it('starts incomplete with default draft', () => {
    const s = useOnboardingStore.getState();
    expect(s.completed).toBe(false);
    expect(s.draft.reminderTime).toBe('08:00');
    expect(s.draft.snoozeIntervalMin).toBe(15);
    expect(s.draft.maxSnoozes).toBe(3);
  });

  it('setDraft patches fields', () => {
    useOnboardingStore.getState().setDraft({ identity: 'sog‘lom inson' });
    expect(useOnboardingStore.getState().draft.identity).toBe('sog‘lom inson');
    expect(useOnboardingStore.getState().draft.reminderTime).toBe('08:00');
  });

  it('setDraft accumulates fields', () => {
    useOnboardingStore.getState().setDraft({ name: 'Suv' });
    useOnboardingStore.getState().setDraft({ emoji: '💧' });
    const d = useOnboardingStore.getState().draft;
    expect(d.name).toBe('Suv');
    expect(d.emoji).toBe('💧');
  });

  it('resetDraft restores defaults', () => {
    useOnboardingStore.getState().setDraft({ identity: 'X', name: 'Y' });
    useOnboardingStore.getState().resetDraft();
    const d = useOnboardingStore.getState().draft;
    expect(d.identity).toBeUndefined();
    expect(d.name).toBeUndefined();
    expect(d.reminderTime).toBe('08:00');
  });

  it('markCompleted flips flag and clears draft', () => {
    useOnboardingStore.getState().setDraft({ identity: 'X' });
    useOnboardingStore.getState().markCompleted();
    expect(useOnboardingStore.getState().completed).toBe(true);
    expect(useOnboardingStore.getState().draft.identity).toBeUndefined();
  });

  it('reset undoes completed', () => {
    useOnboardingStore.getState().markCompleted();
    expect(useOnboardingStore.getState().completed).toBe(true);
    useOnboardingStore.getState().reset();
    expect(useOnboardingStore.getState().completed).toBe(false);
  });
});
