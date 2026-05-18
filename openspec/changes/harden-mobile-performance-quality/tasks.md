## 1. Baseline and Naming Audit

- [x] 1.1 Create an inventory of project-owned files under `app/`, `src/`, and `__tests__/`, marking files that must remain framework-reserved Expo Router names.
- [x] 1.2 Record a performance/code-quality baseline for startup, home tab, progress tab, onboarding choices, habit creation, check-in/undo, store selectors, notification flows, dependencies, and bundled assets.
- [x] 1.3 Document current external guidance used for the audit: React Native performance docs, Expo performance/app-size docs, and Shopify React Native performance measurement guidance.

## 2. Kebab-Case File Migration

- [x] 2.1 Rename ordinary project-owned source files to kebab-case and keep Expo Router reserved files such as `_layout.tsx`, `[id].tsx`, and route-group folders valid.
- [x] 2.2 Update all imports, aliases, test paths, and any file references affected by the rename map.
- [x] 2.3 Run TypeScript and Jest after renames, then fix any stale imports or route resolution issues.

## 3. Error Resilience

- [x] 3.1 Add shared recoverable error handling for notification setup, permission checks, scheduling, cancellation, and snooze flows.
- [x] 3.2 Add guarded persistence hydration/write handling for Zustand stores backed by AsyncStorage.
- [x] 3.3 Ensure startup hides the splash screen and keeps navigation usable when noncritical setup or reconciliation fails.
- [x] 3.4 Add localized Uzbek retry/safe-next-step messages for critical user-action failures without exposing raw technical errors in production UI.
- [x] 3.5 Add Jest coverage for notification failure paths, persistence recovery paths, and critical habit action error states.

## 4. Performance Hardening

- [x] 4.1 Optimize home tab derived data, store selectors, check-in callbacks, and micro-habit row rendering where the baseline shows avoidable re-renders.
- [x] 4.2 Optimize progress tab streak/grid calculation paths and repeated stat tile rendering where the baseline shows avoidable recalculation.
- [x] 4.3 Optimize onboarding repeated option lists and emoji/time choices using stable data, callbacks, or memoized row components only where useful.
- [x] 4.4 Review `ScrollView` usage and switch to virtualized list rendering only for screens where item growth can cause visible lag.
- [x] 4.5 Audit dependencies and assets, removing unused weight or documenting why a dependency remains necessary.

## 5. Quality Review and Verification

- [x] 5.1 Review changed code for KISS and DRY, keeping shared logic in existing services/components and avoiding broad abstractions without repeated need.
- [x] 5.2 Run `npm run typecheck`, `npm test`, and available lint checks; document any tooling blocker with exact failure details.
- [ ] 5.3 Perform release-like/manual low-end workflow checks for startup, tab switching, scrolling, onboarding, habit creation, check-in, undo, progress view, settings, and notification permission-denied behavior.
- [x] 5.4 Update README or project notes only if new verification steps or recovery behavior need to be preserved for future maintainers.
