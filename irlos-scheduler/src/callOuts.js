// ============================================================
// callOuts.js
//
// Same-day, last-minute call-outs: someone who was ALREADY
// assigned to a shift can no longer make it. This is different
// from markUnavailable in crew.js -- that's for known-in-advance
// absences applied BEFORE a schedule exists, so the person is
// simply never picked in the first place. This function patches
// a schedule that's already been published, one shift at a time.
// ============================================================

const { getAvailableCrew } = require("./crew");


// ------------------------------------------------------------
// handleCallOut(daySchedules, crew, personName, day)
//
// Finds every entry on this day that includes personName, frees
// them from it, and looks for a same-role stand-in who's still
// free (explicitly excluding personName themselves, since they'd
// otherwise still look "available" the instant we free them). If
// found, swaps them in and the event keeps running. If not, the
// slot is left empty with a note that the event needs a
// reschedule or cancellation decision.
// ------------------------------------------------------------
function handleCallOut(daySchedules, crew, personName, day) {
    const dayInfo = daySchedules[day];
    const notes = [];

    for (const entry of dayInfo.entries) {
        if (!entry.crew.includes(personName)) {
            continue;
        }

        const departingPerson = crew.find(function(person) {
            return person.name === personName;
        });

        dayInfo.assignedCrew = dayInfo.assignedCrew.filter(function(name) {
            return name !== personName;
        });

        const stillAvailable = getAvailableCrew(crew, day, dayInfo.assignedCrew);
        const replacement = stillAvailable.find(function(person) {
            return person.type === departingPerson.type && person.name !== personName;
        });

        if (replacement) {
            entry.crew = entry.crew.map(function(name) {
                return name === personName ? replacement.name : name;
            });
            dayInfo.assignedCrew.push(replacement.name);
            notes.push(
                day + ": " + personName + " called out of " + entry.event.name +
                " - covered by " + replacement.name + " instead."
            );
        } else {
            entry.crew = entry.crew.filter(function(name) {
                return name !== personName;
            });
            notes.push(
                day + ": " + personName + " called out of " + entry.event.name +
                " and no same-role replacement was available - this event needs a reschedule or cancellation."
            );
        }
    }

    if (notes.length === 0) {
        notes.push(day + ": " + personName + " wasn't scheduled for anything that day, so there's nothing to cover.");
    }

    return notes;
}


module.exports = { handleCallOut };
