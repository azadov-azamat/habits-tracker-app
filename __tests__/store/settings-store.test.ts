import { useSettingsStore } from '@/store/settings-store';

beforeEach(() => {
  useSettingsStore.setState({
    theme: 'system',
    language: 'uz',
    notificationsEnabled: true,
    morningGreetingEnabled: true,
    morningGreetingTime: '07:00',
    hapticsEnabled: true,
  });
});

describe('settingsStore', () => {
  it('has sensible defaults', () => {
    const s = useSettingsStore.getState();
    expect(s.theme).toBe('system');
    expect(s.language).toBe('uz');
    expect(s.notificationsEnabled).toBe(true);
    expect(s.morningGreetingEnabled).toBe(true);
    expect(s.morningGreetingTime).toBe('07:00');
    expect(s.hapticsEnabled).toBe(true);
  });

  it('setTheme changes theme', () => {
    useSettingsStore.getState().setTheme('dark');
    expect(useSettingsStore.getState().theme).toBe('dark');
    useSettingsStore.getState().setTheme('light');
    expect(useSettingsStore.getState().theme).toBe('light');
  });

  it('setLanguage changes language', () => {
    useSettingsStore.getState().setLanguage('en');
    expect(useSettingsStore.getState().language).toBe('en');
    useSettingsStore.getState().setLanguage('uz');
    expect(useSettingsStore.getState().language).toBe('uz');
  });

  it('setNotificationsEnabled toggles', () => {
    useSettingsStore.getState().setNotificationsEnabled(false);
    expect(useSettingsStore.getState().notificationsEnabled).toBe(false);
  });

  it('setMorningGreetingTime updates value', () => {
    useSettingsStore.getState().setMorningGreetingTime('06:30');
    expect(useSettingsStore.getState().morningGreetingTime).toBe('06:30');
  });

  it('setHapticsEnabled toggles', () => {
    useSettingsStore.getState().setHapticsEnabled(false);
    expect(useSettingsStore.getState().hapticsEnabled).toBe(false);
  });
});
