## ADDED Requirements

### Requirement: Performance work is measured and scoped
The system MUST include a performance audit before optimization and MUST document the render, startup, storage, list, asset, or dependency bottlenecks that each optimization addresses.

#### Scenario: Baseline audit exists
- **WHEN** implementation begins
- **THEN** the developer MUST record a baseline review of startup, tab navigation, habit check-in, progress rendering, onboarding choice rendering, store selectors, and bundled asset/dependency weight

#### Scenario: Optimization has rationale
- **WHEN** a performance optimization is introduced
- **THEN** it MUST be tied to an observed bottleneck or a clearly repeated render path
- **AND** it MUST avoid adding broad memoization or new dependencies without measurable value

### Requirement: Core screens remain responsive on low-end devices
The system MUST keep core offline workflows responsive on low-end phones by limiting JS-thread work during initial render, navigation transitions, scrolling, and check-in actions.

#### Scenario: Habit list rendering
- **WHEN** the home screen renders main and micro habits
- **THEN** repeated row components MUST receive stable props or selectors where practical
- **AND** derived progress data MUST avoid unnecessary recalculation across unrelated state changes

#### Scenario: Progress screen rendering
- **WHEN** the progress screen renders 40-day progress and summary tiles
- **THEN** expensive streak or grid calculations MUST be memoized or moved to shared services where practical
- **AND** the screen MUST not perform avoidable synchronous work during navigation transitions

#### Scenario: Onboarding choice rendering
- **WHEN** onboarding screens render habit suggestions, identity examples, emoji choices, or time options
- **THEN** repeated option rows MUST avoid unnecessary inline work that causes avoidable re-renders

### Requirement: App size and dependency weight are reviewed
The system MUST review app bundle/assets/dependencies during performance hardening and remove or defer unused weight where it does not support current behavior.

#### Scenario: Unused dependency check
- **WHEN** dependencies are audited
- **THEN** unused or redundant dependencies MUST be removed or justified

#### Scenario: Asset and bundle check
- **WHEN** release readiness is verified
- **THEN** bundled assets and JavaScript output MUST be reviewed for avoidable weight
- **AND** any recommended follow-up that requires a native/release build MUST be documented

### Requirement: Performance verification covers release-like behavior
The system MUST verify performance-sensitive changes with automated checks and release-like manual checks where local tooling permits.

#### Scenario: Automated checks
- **WHEN** performance hardening is completed
- **THEN** TypeScript, Jest, and available lint checks MUST pass or any blocker MUST be documented

#### Scenario: Manual low-end workflow check
- **WHEN** the app is tested manually or on an emulator/device
- **THEN** startup, tab switching, scrolling, habit creation, check-in, undo, progress view, and settings MUST remain smooth enough for low-end devices without visible freezing
