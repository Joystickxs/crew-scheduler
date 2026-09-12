// ============================================================
// crew.js
//
// Everything related to WHO is on the team and WHEN they can
// work. This file doesn't know anything about events or
// scheduling -- it only answers questions like "is this person
// free on this day?" and "who, out of the whole roster, is free
// right now?"
// ============================================================


// The full staff roster for the week. Each person has:
//   - name: display name
//   - type: "lead" | "junior" | "assistant"
//   - unavailable: a list of { day, reason } entries for any day
//     they can't work (vacation, requested day off, etc.)
//
// Sized generously (4 of each role) so an average week of
// bookings can be fully staffed even with a couple of people out.
const crew = [
    { name: "Em", type: "lead", unavailable: [{ day: "Monday", reason: "requested day off" }] },
    { name: "Terry", type: "lead", unavailable: [] },
    { name: "Ana", type: "lead", unavailable: [] },
    { name: "Sam", type: "lead", unavailable: [] },

    { name: "Dennis", type: "junior", unavailable: [] },
    { name: "Ron", type: "junior", unavailable: [] },
    { name: "Miguel", type: "junior", unavailable: [] },
    { name: "Priya", type: "junior", unavailable: [] },

    { name: "Jen", type: "assistant", unavailable: [] },
    { name: "Treya", type: "assistant", unavailable: [] },
    { name: "Cal", type: "assistant", unavailable: [] },
    { name: "Dee", type: "assistant", unavailable: [] }
];


// ------------------------------------------------------------
// isAvailable(person, day)
//
// True if this person has NOT been marked unavailable for this
// specific day. Doesn't know or care whether they're already
// assigned to something else today -- see getAvailableCrew below
// for that.
// ------------------------------------------------------------
function isAvailable(person, day) {
    return !person.unavailable.some(function(entry) {
        return entry.day === day;
    });
}


// ------------------------------------------------------------
// getUnavailabilityReason(person, day)
//
// Returns the reason string ("on vacation", "called in sick",
// etc.) for why this person is out on this day, or null if
// they're not marked unavailable that day at all.
// ------------------------------------------------------------
function getUnavailabilityReason(person, day) {
    const entry = person.unavailable.find(function(entry) {
        return entry.day === day;
    });

    return entry ? entry.reason : null;
}


// ------------------------------------------------------------
// getAvailableCrew(crew, day, assignedCrew)
//
// The real "who can I actually use right now" question: free on
// this day AND not already handed to a different event today.
// assignedCrew is a plain array of names claimed so far that day.
// ------------------------------------------------------------
function getAvailableCrew(crew, day, assignedCrew) {
    return crew.filter(function(person) {
        return isAvailable(person, day) && !assignedCrew.includes(person.name);
    });
}


// ------------------------------------------------------------
// markUnavailable(crewList, name, days, reason)
//
// Returns a NEW crew list with one person's unavailable days
// updated -- it never modifies the original list or person
// objects. This is how we simulate a vacation or a call-in:
// build an updated crew list, then generate (or re-check) a
// schedule against that updated list.
// ------------------------------------------------------------
function markUnavailable(crewList, name, days, reason) {
    return crewList.map(function(person) {
        if (person.name !== name) {
            return person;
        }

        const newEntries = days.map(function(day) {
            return { day: day, reason: reason };
        });

        return {
            name: person.name,
            type: person.type,
            unavailable: person.unavailable.concat(newEntries)
        };
    });
}


module.exports = {
    crew,
    isAvailable,
    getUnavailabilityReason,
    getAvailableCrew,
    markUnavailable
};
