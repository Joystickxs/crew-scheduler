// ============================================================
// assignCrew.js
//
// The core staffing rule for a SINGLE event on a SINGLE day.
// Given an event, the full crew, a day, and who's already
// claimed that day, this figures out exactly who fills the
// required roles -- and actually claims them by pushing their
// names into assignedCrew.
//
// This file has one job: match people to one event. It doesn't
// know about weeks, other events, or explaining failures (see
// staffingExplanations.js for that).
// ============================================================

const { getAvailableCrew } = require("./crew");


// ------------------------------------------------------------
// assignCrew(event, crew, day, assignedCrew)
//
// Returns an array of the names assigned, or null if this event
// type's requirements can't be met with who's currently free.
// On success, it mutates assignedCrew by pushing the names it
// picked -- callers rely on this side effect to prevent the same
// person being double-booked later in the same day.
// ------------------------------------------------------------
function assignCrew(event, crew, day, assignedCrew) {
    const availableCrew = getAvailableCrew(crew, day, assignedCrew);

    if (event.type === "basic") {
        return assignBasic(availableCrew, assignedCrew);
    }

    if (event.type === "backpack") {
        return assignBackpack(availableCrew, assignedCrew);
    }

    if (event.type === "festival") {
        return assignFestival(availableCrew, assignedCrew);
    }

    return null;
}


// ------------------------------------------------------------
// Solo Stream: needs 1 Lead Broadcast Engineer.
// ------------------------------------------------------------
function assignBasic(availableCrew, assignedCrew) {
    const lead = availableCrew.find(function(person) {
        return person.type === "lead";
    });

    if (!lead) {
        return null;
    }

    assignedCrew.push(lead.name);
    return [lead.name];
}


// ------------------------------------------------------------
// Backpack Stream: 1 Lead AND (1 Junior OR 1 Assistant).
// ------------------------------------------------------------
function assignBackpack(availableCrew, assignedCrew) {
    const lead = availableCrew.find(function(person) {
        return person.type === "lead";
    });

    const juniorOrAssistant = availableCrew.find(function(person) {
        return person.type === "junior" || person.type === "assistant";
    });

    if (!lead || !juniorOrAssistant) {
        return null;
    }

    assignedCrew.push(lead.name);
    assignedCrew.push(juniorOrAssistant.name);
    return [lead.name, juniorOrAssistant.name];
}


// ------------------------------------------------------------
// Multi-Cam Festival: 2 Leads AND 2 Juniors AND 4 MORE of any
// type -- 8 distinct people total, not 4. The 4 "any type"
// workers are picked from whoever's left AFTER the 2 leads and
// 2 juniors are set aside, so nobody is double-counted.
// ------------------------------------------------------------
function assignFestival(availableCrew, assignedCrew) {
    const leads = availableCrew.filter(function(person) {
        return person.type === "lead";
    });

    const juniors = availableCrew.filter(function(person) {
        return person.type === "junior";
    });

    const anyWorkers = availableCrew.filter(function(person) {
        return person.type === "lead" || person.type === "junior" || person.type === "assistant";
    });

    if (leads.length < 2 || juniors.length < 2 || anyWorkers.length < 8) {
        return null;
    }

    const coreCrew = [...leads.slice(0, 2), ...juniors.slice(0, 2)];
    const coreNames = coreCrew.map(function(person) {
        return person.name;
    });

    const remainingWorkers = anyWorkers.filter(function(person) {
        return !coreNames.includes(person.name);
    });

    const selectedCrew = [...coreCrew, ...remainingWorkers.slice(0, 4)];

    for (const person of selectedCrew) {
        assignedCrew.push(person.name);
    }

    return selectedCrew.map(function(person) {
        return person.name;
    });
}


module.exports = { assignCrew };
