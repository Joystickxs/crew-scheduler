// ============================================================
// randomBooking.js
//
// A DEMO/convenience tool, not core scheduling logic: proposes
// random events one at a time and only "confirms" one once a day
// has actually been found to staff it. This guarantees a
// generated week never starts with an unstaffed event -- matching
// "we only accept as many bookings as we have confirmed staff for."
//
// generateSchedule (schedule.js) is still the function that has
// to handle an externally-given list that MIGHT overbook the
// week -- this file is specifically for building sample/demo
// input that's guaranteed to fit.
// ============================================================

const { assignCrew } = require("./assignCrew");
const { createEvent, EVENT_TYPES, EVENT_TYPE_LABELS } = require("./events");
const { DAYS } = require("./schedule");


// ------------------------------------------------------------
// generateWeeklyBooking(crew, targetEventCount)
//
// Keeps proposing random events until either targetEventCount
// have been confirmed, or maxAttempts is hit (meaning the week
// has effectively filled up and nothing more will fit).
// ------------------------------------------------------------
function generateWeeklyBooking(crew, targetEventCount) {
    const daySchedules = {};
    DAYS.forEach(function(day) {
        daySchedules[day] = { assignedCrew: [], entries: [] };
    });

    const confirmedEvents = [];
    const notes = [];
    let attempts = 0;
    const maxAttempts = targetEventCount * 20;

    while (confirmedEvents.length < targetEventCount && attempts < maxAttempts) {
        attempts++;

        const randomIndex = Math.floor(Math.random() * EVENT_TYPES.length);
        const type = EVENT_TYPES[randomIndex];
        const candidate = createEvent(EVENT_TYPE_LABELS[type] + " #" + (confirmedEvents.length + 1), type);

        let placed = false;

        for (const day of DAYS) {
            const dayInfo = daySchedules[day];
            const crewNames = assignCrew(candidate, crew, day, dayInfo.assignedCrew);

            if (crewNames) {
                dayInfo.entries.push({ event: candidate, crew: crewNames });
                confirmedEvents.push(candidate);
                notes.push(day + ": booked and staffed " + candidate.name + " with " + crewNames.join(", ") + ".");
                placed = true;
                break;
            }
        }

        if (!placed) {
            notes.push("Rejected a proposed " + candidate.type + " event - no day this week had capacity left for it.");
        }
    }

    return {
        daySchedules: daySchedules,
        confirmedEvents: confirmedEvents,
        notes: notes
    };
}


module.exports = { generateWeeklyBooking };
