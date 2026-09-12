// ============================================================
// changeEventType.js
//
// An event's requirements changing after it's already scheduled
// -- a Solo Stream growing into a Backpack Stream, a Backpack
// Stream growing into a Festival, or shrinking the other way.
//
// Kept separate from scheduleEdits.js: reschedule/cancel only
// move or remove an event, but this one changes WHAT the event
// needs, which is a meaningfully different kind of operation.
// ============================================================

const { assignCrew } = require("./assignCrew");
const { explainWhyCannotStaff } = require("./staffingExplanations");
const { findScheduledDay, releaseEntry } = require("./scheduleEdits");


// ------------------------------------------------------------
// changeEventType(daySchedules, crew, eventId, newType)
//
// Deliberately simple: release EVERYONE currently on the event,
// update its type, then re-staff from scratch. A more "clever"
// version might try to keep whoever still fits and only add/
// remove the difference -- but that's real extra complexity for
// very little benefit here, and this way is easy to prove
// correct: whatever comes out satisfies the new requirement, or
// the event is clearly flagged as unable to be restaffed.
// ------------------------------------------------------------
function changeEventType(daySchedules, crew, eventId, newType) {
    const location = findScheduledDay(daySchedules, eventId);

    if (!location) {
        return "Could not find a scheduled event with id " + eventId + " to change.";
    }

    const entry = releaseEntry(daySchedules, location.day, location.entryIndex);
    const oldType = entry.event.type;
    entry.event.type = newType;

    const dayInfo = daySchedules[location.day];
    const crewNames = assignCrew(entry.event, crew, location.day, dayInfo.assignedCrew);

    if (crewNames) {
        dayInfo.entries.push({ event: entry.event, crew: crewNames });
        return location.day + ": " + entry.event.name + " changed from " + oldType + " to " + newType +
            ", now staffed by " + crewNames.join(", ") + ".";
    }

    return location.day + ": " + entry.event.name + " changed from " + oldType + " to " + newType +
        " but could not be restaffed - " +
        explainWhyCannotStaff(entry.event, crew, location.day, dayInfo.assignedCrew) + ".";
}


module.exports = { changeEventType };
