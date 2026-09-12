# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Changed
- Split the single-file prototype into modular `src/` files, one
  responsibility per file: `crew.js`, `events.js`, `assignCrew.js`,
  `staffingExplanations.js`, `schedule.js`, `scheduleEdits.js`,
  `callOuts.js`, `randomBooking.js`.
- Refactored `assignCrew` into three small per-type helpers
  (`assignBasic`, `assignBackpack`, `assignFestival`) instead of one
  long function.
- Extracted a shared `explainGroup` helper in
  `staffingExplanations.js` to remove repeated logic across the
  basic/backpack/festival explanation branches.

### Added
- `demo.js` as the runnable proof-of-concept script.
- `tests/` folder using Node's built-in test runner, no external
  dependencies.

## [0.1.0] - Initial prototype

### Added
- Core crew/event data model and `assignCrew` staffing logic for
  basic, backpack, and festival event types.
- `generateSchedule` to produce a Monday-Friday plan from a list of
  events, rolling over anything that doesn't fit that day to the next.
- `explainWhyCannotStaff` to give a specific, named reason whenever an
  event can't be staffed.
- Reschedule, cancel, and change-event-type operations on an existing
  schedule (`scheduleEdits.js`).
- Same-day call-out handling (`handleCallOut`) with same-role
  substitution.
- Capacity-aware random weekly booking generator
  (`generateWeeklyBooking`) that only confirms events a day can
  actually staff.
- Expanded the crew roster to 12 people (4 leads, 4 juniors, 4
  assistants) so an average week can be fully staffed.
