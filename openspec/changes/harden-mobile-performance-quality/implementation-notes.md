## Baseline Inventory

### File naming audit

Framework-reserved Expo Router files/folders to keep as-is:

- `app/_layout.tsx`
- `app/(onboarding)/_layout.tsx`
- `app/(tabs)/_layout.tsx`
- `app/habit/[id].tsx`
- Route group folders: `app/(onboarding)`, `app/(tabs)`

Ordinary files requiring kebab-case rename:

- `src/components/CheckInButton.tsx` -> `src/components/check-in-button.tsx`
- `src/components/EmptyState.tsx` -> `src/components/empty-state.tsx`
- `src/components/FortyDayGrid.tsx` -> `src/components/forty-day-grid.tsx`
- `src/components/MicroHabitRow.tsx` -> `src/components/micro-habit-row.tsx`
- `src/components/MilestoneModal.tsx` -> `src/components/milestone-modal.tsx`
- `src/components/MinimumViableCard.tsx` -> `src/components/minimum-viable-card.tsx`
- `src/components/MotivationCard.tsx` -> `src/components/motivation-card.tsx`
- `src/components/ProgressMeter.tsx` -> `src/components/progress-meter.tsx`
- `src/components/RecoveryCard.tsx` -> `src/components/recovery-card.tsx`
- `src/components/ScreenScaffold.tsx` -> `src/components/screen-scaffold.tsx`
- `src/components/StreakBadge.tsx` -> `src/components/streak-badge.tsx`
- `src/components/TimeIntervalPicker.tsx` -> `src/components/time-interval-picker.tsx`
- `src/components/WhyReminderCard.tsx` -> `src/components/why-reminder-card.tsx`
- `src/data/habitSuggestions.ts` -> `src/data/habit-suggestions.ts`
- `src/data/identityExamples.ts` -> `src/data/identity-examples.ts`
- `src/data/motivationalQuotes.ts` -> `src/data/motivational-quotes.ts`
- `src/hooks/useAppTheme.ts` -> `src/hooks/use-app-theme.ts`
- `src/hooks/useDailyReconcile.ts` -> `src/hooks/use-daily-reconcile.ts`
- `src/hooks/useNotificationHandler.ts` -> `src/hooks/use-notification-handler.ts`
- `src/services/milestoneDetector.ts` -> `src/services/milestone-detector.ts`
- `src/services/streakCalculator.ts` -> `src/services/streak-calculator.ts`
- `src/store/habitsStore.ts` -> `src/store/habits-store.ts`
- `src/store/onboardingStore.ts` -> `src/store/onboarding-store.ts`
- `src/store/settingsStore.ts` -> `src/store/settings-store.ts`
- `src/theme/paperTheme.ts` -> `src/theme/paper-theme.ts`
- `src/utils/dateHelpers.ts` -> `src/utils/date-helpers.ts`
- Test files matching those modules require the same kebab-case conversion.

Already kebab-case/lowercase:

- App route leaf files such as `welcome.tsx`, `habit.tsx`, `progress.tsx`, `settings.tsx`, `new.tsx`, and `index.tsx`
- `src/i18n/index.ts`, `src/i18n/locales/uz.json`, `src/theme/colors.ts`, `src/store/types.ts`, `src/services/notifications.ts`, `src/utils/haptics.ts`

### Performance and code-quality baseline

- Startup: `app/_layout.tsx` runs notification setup before hiding splash; failure is caught, but diagnostics are swallowed.
- Home tab: main/micro habit selectors are separated; `partOfDay()` is called more than once per render; micro rows receive inline callbacks; check-in cancels notifications as a side effect without recoverable UI feedback.
- Progress tab: `computeStreakStats(habit)` is recalculated on every render and `StatTile` is not memoized.
- Onboarding choices: small static arrays are rendered in `ScrollView`; current sizes are low, so virtualization is not justified unless list sizes grow.
- Habit creation: reminder scheduling happens after local habit creation; failures can leave a valid habit but unclear reminder state.
- Stores: Zustand persistence uses raw AsyncStorage storage without shared recoverable error logging or corrupt-value fallback.
- Notifications: cancellation already attempts all IDs, but setup/schedule/permission calls lack shared result/error helpers and tests for failure behavior.
- Dependencies/assets: no image assets are present; dependency review should focus on unused runtime packages and bundle impact rather than asset compression.

### ScrollView and dependency review

- `ScrollView` remains appropriate for current habit detail, new habit, settings, and generic scaffold screens because content is short, form-like, and bounded.
- The onboarding habit suggestions list is still small and static; switching it to `FlatList`/FlashList would add complexity without a measured benefit today. If suggestions become remotely configured or grow beyond a small static set, convert that section to a virtualized list with stable row components.
- No project-owned image assets are bundled.
- Unused dependency candidates found by import audit: `lottie-react-native`, `react-hook-form`, `zod`, and `react-native-vector-icons`. They are not imported by app code. Removing them should be done in a dedicated dependency-maintenance pass that updates the active lockfile cleanly, because the current workspace has both npm and yarn artifacts and an existing dev server running.
- Expo-adjacent packages such as `expo-font`, `expo-linking`, `expo-localization`, `expo-system-ui`, `expo-updates`, `react-native-svg`, and `react-dom` are left in place because they may be required by Expo Router, Expo config plugins, web support, vector icons, or native build tooling.

### Verification

- `npm run typecheck`: passed.
- `npm test -- --runInBand`: passed, 11 suites and 190 tests.
- `npm run lint`: passed after Expo CLI generated `.eslintrc.js`; ESLint dev dependencies were added to `package.json` and `package-lock.json`.
- Release-like/manual low-end device workflow verification was not fully executable from this terminal-only pass. The checks to run on device are startup, tab switching, scrolling, onboarding, habit creation, check-in, undo, progress view, settings, and notification permission-denied behavior.

### External guidance used

- React Native performance docs: keep JS-thread work low during interactions, optimize list rendering only where list size/render cost justifies it, and measure release behavior.
- Expo guidance: review real app size and bundled resources, keep startup/lightweight runtime paths lean, and avoid heavy work on the JS thread.
- Shopify engineering guidance: measure startup, navigation, and screen render paths; validate on low-power Android hardware or release-like builds instead of relying only on simulator impressions.
