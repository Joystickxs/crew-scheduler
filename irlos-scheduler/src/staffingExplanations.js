// ============================================================
// staffingExplanations.js
//
// When an event CAN'T be staffed, this figures out why, in
// plain English -- naming the specific people who are missing
// and whether they're out for the day or already claimed by
// something else. Used both when first building a schedule and
// after mid-week changes.
// ============================================================

const { getAvailableCrew, getUnavailabilityReason } = require("./crew");


// ------------------------------------------------------------
// describeUnavailablePerson(person, day, assignedCrew)
//
// One-line explanation for a single person: are they already
// working another event today, or out for a known reason?
// Returns null if neither applies.
// ------------------------------------------------------------
function describeUnavailablePerson(person, day, assignedCrew) {
    if (assignedCrew.includes(person.name)) {
        return person.name + " is already staffing another event today";
    }

    const reason = getUnavailabilityReason(person, day);

    if (reason) {
        return person.name + " is unavailable (" + reason + ")";
    }

    return null;
}


// ------------------------------------------------------------
// explainGroup(people, day, assignedCrew)
//
// Small helper: turn a list of people into their unavailability
// explanations, dropping anyone who doesn't have one to report.
// ------------------------------------------------------------
function explainGroup(people, day, assignedCrew) {
    return people
        .map(function(person) {
            return describeUnavailablePerson(person, day, assignedCrew);
        })
        .filter(Boolean)
        .join("; ");
}


// ------------------------------------------------------------
// explainWhyCannotStaff(event, crew, day, assignedCrew)
//
// Given an event that assignCrew has already failed to staff,
// builds a human-readable explanation naming the specific people
// who were needed and why they weren't free.
// ------------------------------------------------------------
function explainWhyCannotStaff(event, crew, day, assignedCrew) {
    const availableCrew = getAvailableCrew(crew, day, assignedCrew);

    const availableLeads = availableCrew.filter(function(person) {
        return person.type === "lead";
    });
    const availableJuniors = availableCrew.filter(function(person) {
        return person.type === "junior";
    });
    const availableAssistants = availableCrew.filter(function(person) {
        return person.type === "assistant";
    });

    if (event.type === "basic" && availableLeads.length < 1) {
        const leads = crew.filter(function(person) { return person.type === "lead"; });
        return "no Lead Broadcast Engineer available (" + explainGroup(leads, day, assignedCrew) + ")";
    }

    if (event.type === "backpack" &&
        (availableLeads.length < 1 || (availableJuniors.length < 1 && availableAssistants.length < 1))) {
        return "missing a Lead and/or a Junior/Assistant (" + explainGroup(crew, day, assignedCrew) + ")";
    }

    if (event.type === "festival") {
        return "not enough total crew for a festival, needs 8 (" + explainGroup(crew, day, assignedCrew) + ")";
    }

    return "requirements not met";
}


module.exports = { describeUnavailablePerson, explainWhyCannotStaff };
