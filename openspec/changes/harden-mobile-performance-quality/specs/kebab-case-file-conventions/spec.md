## ADDED Requirements

### Requirement: Project source files use kebab-case names
The system MUST keep project-owned source and test file names in kebab-case, except for framework-reserved Expo Router file names and dynamic route syntax.

#### Scenario: Source file audit
- **WHEN** project-owned files under `src/`, `app/`, and `__tests__/` are audited
- **THEN** ordinary file names MUST be kebab-case
- **AND** framework-reserved names such as `_layout.tsx`, group folders such as `(tabs)`, and dynamic route files such as `[id].tsx` MUST remain valid for Expo Router

#### Scenario: No broken imports after rename
- **WHEN** the file rename migration is completed
- **THEN** TypeScript module resolution MUST succeed with no stale imports pointing to old file names

### Requirement: Naming migration preserves behavior
The system MUST preserve existing routes, tests, translations, habit data, and notification behavior after file renames.

#### Scenario: Existing tests after rename
- **WHEN** the test suite is run after the rename pass
- **THEN** existing Jest tests MUST pass without requiring product behavior changes

#### Scenario: Route compatibility after rename
- **WHEN** the app is launched after route-support files are renamed or intentionally left unchanged
- **THEN** onboarding, tabs, habit detail, and new-habit navigation MUST remain reachable
