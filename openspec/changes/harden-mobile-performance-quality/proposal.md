## Why

The app should stay smooth and reliable on low-end phones while remaining easy to maintain as the codebase grows. Current file naming is mixed, performance safeguards are not explicit, and error handling is inconsistent, which increases the risk of regressions in core offline habit flows.

## What Changes

- Rename project-owned source and test files to kebab-case, updating imports and Expo Router route files without changing user-facing routes unless required by router conventions.
- Add a code-quality pass focused on KISS and DRY: remove avoidable duplication, keep shared logic in existing services/components, and avoid premature abstractions.
- Profile and lighten screens that can re-render often, especially habit lists, progress grids, onboarding choice lists, store selectors, persisted state hydration, and notification flows.
- Add a consistent error-handling baseline for app startup, AsyncStorage-backed stores, notification permissions/scheduling, check-in actions, and navigation-critical screens.
- Add performance guardrails based on current React Native, Expo, and senior mobile engineering recommendations: measure first, optimize list rendering, reduce JS-thread work during interactions, keep bundles/assets lean, and validate changes on release-like builds.
- Preserve offline-first behavior: habit creation, check-ins, progress, settings, onboarding, and reminders must keep working without network access.

## Capabilities

### New Capabilities

- `kebab-case-file-conventions`: Defines required naming conventions for project-owned files and import stability after renames.
- `mobile-performance-hardening`: Defines runtime performance expectations, profiling checks, low-end-device safeguards, and bundle/assets review expectations.
- `app-error-resilience`: Defines user-safe and developer-observable error handling for startup, persistence, notifications, and critical habit actions.

### Modified Capabilities

- None.

## Impact

- Affected code: `app/`, `src/`, `__tests__/`, imports, store persistence, notification services, common UI components, and tests.
- Affected tooling: TypeScript, Jest, Expo lint, Expo Router route file conventions, and release-like build/performance verification.
- Possible dependency changes: optional performance tooling or list/image libraries only if profiling shows value and they fit the app's small offline scope.
- External research informing implementation: React Native performance guidance, Expo app size/performance guidance, and Shopify engineering recommendations for measuring React Native render times and validating on low-power Android hardware.
