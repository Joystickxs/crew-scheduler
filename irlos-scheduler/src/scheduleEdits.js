// ============================================================
// scheduleEdits.js
//
// Editing a schedule that already exists: moving an event to a
// different day, cancelling it outright, or changing its type
// (e.g. a Backpack Stream growing into a Festival). All three
// share the same first step -- find where the event currently
// lives and release its crew -- so that step is factored out as
// releaseEntry.
// ============================================================

const { assignCrew } = require("./assignCrew");
const { explainWhyCannotStaff } = require("./staffingExplanations");
const { DAYS } = require("./schedule");


// ------------------------------------------------------------
// findScheduledDay(daySchedules, eventId)
//
// Locates which day (if any) currently has this event, along
// with its index in that day's entries list. Returns null if the
// event isn't scheduled anywhere -- which includes events that
// were never staffed in the first place.
// ------------------------------------------------------------
function findScheduledDay(daySchedules, eventId) {
    for (const day of DAYS) {
        const entryIndex = daySchedules[day].entries.findIndex(function(entry) {
            return entry.event.id === eventId;
        });

        if (entryIndex !== -1) {
            return { day: day, entryIndex: entryIndex };
        }
    }

    return null;
}


// ------------------------------------------------------------
// releaseEntry(daySchedules, day, entryIndex)
//
// Removes one entry from a day's schedule and frees its crew
// back into that day's available pool. Returns the removed entry
// so the caller can inspect it (e.g. to read the event's old
// type before changing it).
// ------------------------------------------------------------
function releaseEntry(daySchedules, day, entryIndex) {
    const dayInfo = daySchedules[day];
    const entry = dayInfo.entries[entryIndex];

    dayInfo.assignedCrew = dayInfo.assignedCrew.filter(function(name) {
        return !entry.crew.includes(name);
    });

    dayInfo.entries.splice(entryIndex, 1);

    return entry;
}


// ------------------------------------------------------------
// cancelEvent(daySchedules, eventId)
// ------------------------------------------------------------
function cancelEvent(daySchedules, eventId) {
    const location = findScheduledDay(daySchedules, eventId);

    if (!location) {
        return "Could not find a scheduled event with id " + eventId + " to cancel.";
    }

    const entry = releaseEntry(daySchedules, location.day, location.entryIndex);

    return location.day + ": cancelled " + entry.event.name +
        ", freeing up " + entry.crew.join(", ") + ".";
}


// ------------------------------------------------------------
// rescheduleEvent(daySchedules, crew, eventId, newDay)
// ------------------------------------------------------------
function rescheduleEvent(daySchedules, crew, eventId, newDay) {
    const location = findScheduledDay(daySchedules, eventId);

    if (!location) {
        return "Could not find a scheduled event with id " + eventId + " to reschedule.";
    }

    const entry = releaseEntry(daySchedules, location.day, location.entryIndex);
    const newDayInfo = daySchedules[newDay];
    const crewNames = assignCrew(entry.event, crew, newDay, newDayInfo.assignedCrew);

    if (crewNames) {
        newDayInfo.entries.push({ event: entry.event, crew: crewNames });
        return "Moved " + entry.event.name + " from " + location.day + " to " + newDay +
            ", now staffed by " + crewNames.join(", ") + ".";
    }

    return "Moved " + entry.event.name + " from " + location.day + " to " + newDay +
        " but could not restaff it there - " +
        explainWhyCannotStaff(entry.event, crew, newDay, newDayInfo.assignedCrew) + ".";
}


module.exports = { findScheduledDay, releaseEntry, cancelEvent, rescheduleEvent };
