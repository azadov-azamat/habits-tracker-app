/* eslint-disable */
// AsyncStorage in-memory mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// expo-haptics is a noop in tests
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// expo-notifications mock with controllable scheduling
jest.mock('expo-notifications', () => {
  let counter = 0;
  const scheduled = new Map();

  return {
    __scheduled: scheduled,
    setNotificationHandler: jest.fn(),
    setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
    setNotificationCategoryAsync: jest.fn(() => Promise.resolve()),
    getPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    requestPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    scheduleNotificationAsync: jest.fn(async (req) => {
      const id = `notif_${++counter}`;
      scheduled.set(id, req);
      return id;
    }),
    cancelScheduledNotificationAsync: jest.fn(async (id) => {
      scheduled.delete(id);
    }),
    cancelAllScheduledNotificationsAsync: jest.fn(async () => {
      scheduled.clear();
    }),
    addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
    SchedulableTriggerInputTypes: {
      CALENDAR: 'calendar',
      TIME_INTERVAL: 'timeInterval',
      DAILY: 'daily',
    },
    AndroidImportance: { HIGH: 4, DEFAULT: 3, LOW: 2, MIN: 1 },
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key, vars) => (vars ? `${key}:${JSON.stringify(vars)}` : key) }),
  initReactI18next: { type: '3rdParty', init: () => {} },
  I18nextProvider: ({ children }) => children,
}));

jest.mock('i18next', () => ({
  __esModule: true,
  default: {
    use: () => ({ init: () => Promise.resolve() }),
    t: (key, vars) => (vars ? `${key}:${JSON.stringify(vars)}` : key),
  },
}));
