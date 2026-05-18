## ADDED Requirements

### Requirement: Startup handles noncritical failures safely
The system MUST continue launching when noncritical startup work fails, including notification setup and daily reconciliation.

#### Scenario: Notification setup fails during launch
- **WHEN** notification channel or category setup throws during app startup
- **THEN** the app MUST hide the splash screen
- **AND** core navigation MUST remain usable
- **AND** the failure MUST be available for developer diagnosis in development builds

#### Scenario: Daily reconciliation fails during launch
- **WHEN** daily reconciliation throws or encounters invalid persisted data
- **THEN** the app MUST keep the current screen usable
- **AND** it MUST not block offline habit viewing or check-in actions

### Requirement: Persistence errors are recoverable
The system MUST handle AsyncStorage read, write, hydration, and migration errors without crashing core habit workflows.

#### Scenario: Store hydration fails
- **WHEN** a persisted Zustand store cannot hydrate
- **THEN** the app MUST fall back to a safe in-memory/default state
- **AND** it MUST expose a retry or recovery path where user action is needed

#### Scenario: Store write fails
- **WHEN** a habit, onboarding, or settings update cannot be persisted
- **THEN** the app MUST avoid freezing
- **AND** it MUST surface a clear retryable error state for critical user actions

### Requirement: Notification failures do not corrupt habit state
The system MUST treat notification scheduling, cancellation, permission, and snooze failures as recoverable side effects that do not corrupt habit data.

#### Scenario: Permission denied
- **WHEN** the user denies notification permission
- **THEN** habit creation and check-in workflows MUST still succeed offline
- **AND** the UI MUST communicate that reminders are disabled or need permission

#### Scenario: Scheduling fails
- **WHEN** scheduling or rescheduling a habit reminder fails
- **THEN** the habit data MUST remain valid
- **AND** stored notification identifiers MUST not be replaced with invalid values

#### Scenario: Cancellation partially fails
- **WHEN** cancelling scheduled notification identifiers partially fails
- **THEN** the app MUST continue attempting remaining cancellations
- **AND** the user workflow MUST not crash

### Requirement: User-facing errors use existing localization patterns
The system MUST show recoverable user-facing errors using existing Uzbek localization and UI patterns.

#### Scenario: Critical action error
- **WHEN** habit creation, habit update, check-in, undo, or reminder setup fails in a way the user can act on
- **THEN** the app MUST show localized feedback with a retry or safe next step

#### Scenario: Developer-only diagnostic detail
- **WHEN** an internal error includes technical details
- **THEN** production UI MUST not expose stack traces or raw exception messages
- **AND** development builds MUST retain enough diagnostic information to debug the issue
