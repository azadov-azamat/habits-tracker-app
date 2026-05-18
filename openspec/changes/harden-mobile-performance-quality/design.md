## Context

40 Kun is an offline-first Expo SDK 52 / React Native app with Expo Router screens in `app/`, reusable UI in `src/components/`, persisted Zustand stores in `src/store/`, and reminder logic in `src/services/notifications.ts`. The requested change is cross-cutting: it touches file naming, import stability, render performance, persistence resilience, notification failures, and quality checks across the app.

Current external guidance aligns on a few practical themes:

- React Native performance docs emphasize keeping 60 FPS, reducing JS-thread work during interactions, using native-driven animations where applicable, and optimizing virtualized lists with layout/windowing configuration when lists grow.
- Expo guidance emphasizes measuring real app size, understanding bundled assets, and reducing lag by avoiding unnecessary JS work and heavy resources.
- Shopify engineering guidance emphasizes measuring React Native rendering times rather than guessing, including startup, navigation, and screen re-render paths, and validating on low-power Android devices.

## Goals / Non-Goals

**Goals:**

- Make project-owned files consistently kebab-case while preserving Expo Router behavior and test/import correctness.
- Establish a measurable performance baseline before optimization and verify improvements after changes.
- Reduce avoidable re-renders and JS-thread work in screens/components that render habit state, progress, and onboarding selections.
- Improve persistence and notification error handling so core offline habit flows do not crash or freeze when storage or OS notification APIs fail.
- Keep implementation simple, local, and consistent with current stores/services/components.

**Non-Goals:**

- Rewriting the app architecture, replacing Zustand, or introducing a server dependency.
- Changing the core habit model, 40-day logic, or Uzbek user-facing product behavior except for clearer error/retry states.
- Adding heavyweight observability, analytics, or remote crash reporting as a required dependency.
- Optimizing for theoretical large data sets beyond reasonable offline habit-tracker use unless profiling shows a real problem.

## Decisions

### Decision 1: Rename project-owned files with an import-safe migration

Use a mechanical, test-backed rename pass for `src/`, `app/`, and `__tests__/` project-owned files. Convert names like `ScreenScaffold.tsx`, `habitsStore.ts`, and `dateHelpers.ts` to kebab-case equivalents while updating all imports in the same change.

Alternatives considered:

- Leave component files PascalCase: less churn, but it does not satisfy the requested convention.
- Rename only `src/`: smaller blast radius, but tests and app route support files would remain inconsistent.

Expo Router caveat: route segment syntax such as `[id].tsx`, `_layout.tsx`, and group folders like `(tabs)` are framework conventions and remain as-is because they are not ordinary file names.

### Decision 2: Measure first, then apply small optimizations

Add lightweight performance audit steps before code changes: identify largest render paths, list-like screens, expensive derived calculations, repeated store selections, and bundled asset/dependency size. Then apply scoped changes such as memoized selectors, stable callbacks for repeated rows, derived-data helpers, and list virtualization only where useful.

Alternatives considered:

- Install FlashList or another list library immediately: possible future option, but current lists appear small; dependency cost should be justified by profiling.
- Blanket `React.memo`/`useMemo` everywhere: can add complexity and stale-prop bugs; use only where repeated rendering or expensive derivation is visible.

### Decision 3: Centralize recoverable error handling at service boundaries

Keep UI screens simple by handling common failures in shared services/hooks: notification setup/scheduling, AsyncStorage-backed persistence hydration, haptic feedback, and startup tasks. Return typed success/failure results or safe fallbacks where callers need to show a retry message, and log developer-facing details in development without crashing production flows.

Alternatives considered:

- Add a full global error boundary only: useful for unknown render errors, but it does not solve recoverable service failures.
- Swallow all errors silently: keeps the app running but hides broken reminders/storage and makes debugging harder.

### Decision 4: Preserve offline-first behavior and startup responsiveness

Core actions must not depend on network access. Startup should hide the splash screen even when noncritical setup fails, and heavy/noncritical work should be deferred until after initial render or user interactions when possible.

Alternatives considered:

- Block launch until reminders and all reconciliation finish: simpler sequencing, but worse perceived performance and more failure-prone on low-end devices.
- Move all reconciliation into screen components: more local, but duplicates logic and increases render pressure.

## Risks / Trade-offs

- File rename churn can break imports or route resolution -> Run TypeScript, Jest, and route smoke checks after renames; keep framework-reserved route file names unchanged.
- Over-optimization can reduce readability -> Require profiling or a clear repeated-render path before adding memoization or new dependencies.
- AsyncStorage corruption or migration errors can lose access to persisted data -> Add guarded hydration/migration handling and tests that preserve valid data while recovering from invalid data.
- Notification APIs vary by platform and permission state -> Keep notification failures nonfatal, expose retryable UI states, and cover permission-denied and scheduling-failure tests.
- Low-end device performance can differ from simulator performance -> Include release-like Android validation and manual checks for startup, tab switching, scrolling, check-in, and onboarding flows.

## Migration Plan

1. Create a rename map for project-owned files and update imports in one focused pass.
2. Run TypeScript/Jest after the rename pass before behavior changes.
3. Add error-handling utilities or result types at service boundaries, then update callers.
4. Profile/render-audit key screens and apply scoped performance improvements.
5. Run final typecheck, Jest, lint where available, and release-like/manual performance verification.

Rollback strategy: because this is source-level hardening without data model changes, rollback is a normal code revert. If persisted-store migration handling is changed, keep versioned migrations backward-compatible and avoid destructive clearing unless stored data is unreadable.
