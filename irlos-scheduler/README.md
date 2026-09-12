# Irlos Crew Scheduler

A small program that staffs a Monday-Friday week of streaming events
(Solo Streams, Backpack Streams, and Multi-Cam Festivals) using a crew
of Lead Broadcast Engineers, Junior Stream Techs, and Production
Assistants.

## Running it

```
node demo.js
```

Runs through every scenario the scheduler handles and prints the
results.

## Running the tests

```
npm test
```

Uses Node's built-in test runner (`node --test`) and `node:assert` --
no external dependencies required.

## Project structure

| File | Responsibility |
|---|---|
| `src/crew.js` | The staff roster and everything about who's available when. |
| `src/events.js` | What an event is, and the recognized event types. |
| `src/assignCrew.js` | The staffing rule for a single event on a single day. |
| `src/staffingExplanations.js` | Plain-English reasons why an event couldn't be staffed. |
| `src/schedule.js` | Turns a list of events into a full Monday-Friday plan. |
| `src/scheduleEdits.js` | Reschedule, cancel, and change-type operations on an existing schedule. |
| `src/callOuts.js` | Same-day call-out handling (finding a same-role substitute). |
| `src/randomBooking.js` | Demo tool: generates a random week that's guaranteed fully staffed. |
| `demo.js` | Runnable script proving all of the above works. |
| `tests/` | Automated test coverage, written test-first (TDD). |

## Event requirements

- **Solo Stream** (`basic`): 1 Lead Broadcast Engineer
- **Backpack Stream** (`backpack`): 1 Lead Broadcast Engineer AND (1 Junior Stream Tech OR 1 Production Assistant)
- **Multi-Cam Festival** (`festival`): 2 Lead Broadcast Engineers AND 2 Junior Stream Techs AND 4 more workers of any type (8 distinct people total)

## Known limitations / not yet handled

- `rescheduleEvent`, `cancelEvent`, and `changeEventType` only operate on
  events that already have a day assigned; an event still sitting
  unscheduled can't be manipulated by these functions yet.
- `handleCallOut` looks for a replacement of the exact same role type --
  a Junior calling out of a Backpack Stream currently won't be covered
  by a free Assistant, even though the original requirement allows
  either.
- Unknown or misspelled event/crew type strings are treated as a data
  validation concern outside the scope of this exercise.
