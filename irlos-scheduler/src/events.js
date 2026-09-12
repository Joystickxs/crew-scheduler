// ============================================================
// events.js
//
// Everything related to WHAT an event is. This file doesn't know
// how to staff an event or schedule it -- it only knows how to
// create one and what the recognized event types are.
// ============================================================


// The three event types this system understands. Kept as a
// single source of truth so nothing else has to spell out these
// strings by hand.
const EVENT_TYPES = ["basic", "backpack", "festival"];

// Friendly display names per type, used when auto-generating
// sample events (see randomBooking.js).
const EVENT_TYPE_LABELS = {
    basic: "Solo Stream",
    backpack: "Backpack Stream",
    festival: "Multi-Cam Festival"
};


// ------------------------------------------------------------
// createEvent(name, type)
//
// Every event gets a unique, auto-incrementing id. This matters
// once events can be rescheduled, cancelled, or have their type
// changed -- we need a reliable way to say "THAT specific event,"
// not just match on its name (two events could easily share a
// name, the same way two crew members could share a name).
// ------------------------------------------------------------
let nextEventId = 1;

function createEvent(name, type) {
    const event = {
        id: nextEventId,
        name: name,
        type: type
    };

    nextEventId++;

    return event;
}


module.exports = {
    EVENT_TYPES,
    EVENT_TYPE_LABELS,
    createEvent
};
