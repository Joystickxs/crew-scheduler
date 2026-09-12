// ============================================================
// schedule.js
//
// Turns a list of events into a Monday-Friday plan. Events are
// tried in priority order each day; anything that doesn't fit
// today rolls over and gets tried again tomorrow. This is the
// core function the assignment actually asks for: "given a list
// of events, produce the work schedule."
// ============================================================

const { assignCrew } = require("./assignCrew");
const { explainWhyCannotStaff } = require("./staffingExplanations");

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];


// ------------------------------------------------------------
// generateSchedule(events, crew)
//
// Returns:
//   daySchedules      - { [day]: { assignedCrew: [...], entries: [...] } }
//                        kept around (not thrown away) so later
//                        code can reschedule/cancel/edit events.
//   unscheduledEvents - events that never found a day this week
//   notes             - a plain-English log of every attempt,
//                        success or failure
// ------------------------------------------------------------
function generateSchedule(events, crew) {
    const daySchedules = {};
    DAYS.forEach(function(day) {
        daySchedules[day] = { assignedCrew: [], entries: [] };
    });

    const notes = [];
    let remainingEvents = [...events];

    for (const day of DAYS) {
        const dayInfo = daySchedules[day];
        const stillRemaining = [];

        for (const event of remainingEvents) {
            const crewNames = assignCrew(event, crew, day, dayInfo.assignedCrew);

            if (crewNames) {
                dayInfo.entries.push({ event: event, crew: crewNames });
                notes.push(day + ": " + event.name + " staffed by " + crewNames.join(", ") + ".");
            } else {
                stillRemaining.push(event);
                notes.push(
                    day + ": could not staff " + event.name + " - " +
                    explainWhyCannotStaff(event, crew, day, dayInfo.assignedCrew) + "."
                );
            }
        }

        remainingEvents = stillRemaining;
    }

    return {
        daySchedules: daySchedules,
        unscheduledEvents: remainingEvents,
        notes: notes
    };
}


// ------------------------------------------------------------
// printSchedule(daySchedules)
//
// Strips daySchedules down to just { day: [{ event, crew }] },
// dropping the internal assignedCrew bookkeeping -- this is the
// shape meant for actually displaying a schedule to a person.
// ------------------------------------------------------------
function printSchedule(daySchedules) {
    const display = {};

    DAYS.forEach(function(day) {
        display[day] = daySchedules[day].entries.map(function(entry) {
            return { event: entry.event.name, crew: entry.crew };
        });
    });

    return display;
}


module.exports = { DAYS, generateSchedule, printSchedule };
