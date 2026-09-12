// ============================================================
// demo.js
//
// Runs through every scenario the scheduler supports, printing
// results as it goes. This is the manual "proof it works" --
// the tests/ folder is the formal, automated version of the
// same proof.
// ============================================================

const { crew, markUnavailable } = require("./src/crew");
const { createEvent } = require("./src/events");
const { generateSchedule, printSchedule, DAYS } = require("./src/schedule");
const { rescheduleEvent, cancelEvent } = require("./src/scheduleEdits");
const { changeEventType } = require("./src/changeEventType");
const { handleCallOut } = require("./src/callOuts");
const { generateWeeklyBooking } = require("./src/randomBooking");


console.log("=== WEEKLY SCHEDULE with the full crew ===");
const events = [
    createEvent("Solo Stream", "basic"),
    createEvent("Backpack Stream", "backpack"),
    createEvent("Music Festival", "festival")
];
const weekResult = generateSchedule(events, crew);
console.log(JSON.stringify(printSchedule(weekResult.daySchedules), null, 2));
weekResult.notes.forEach(function(note) { console.log(note); });


console.log("\n=== Reschedule, cancel, and change an event's type ===");
console.log(rescheduleEvent(weekResult.daySchedules, crew, events[1].id, "Thursday"));
console.log(cancelEvent(weekResult.daySchedules, events[0].id));
console.log(changeEventType(weekResult.daySchedules, crew, events[2].id, "backpack"));
console.log(JSON.stringify(printSchedule(weekResult.daySchedules), null, 2));


console.log("\n=== Em calls in sick Wednesday, Terry is on vacation all week ===");
let scenarioCrew = crew;
scenarioCrew = markUnavailable(scenarioCrew, "Em", ["Wednesday"], "called in sick");
scenarioCrew = markUnavailable(scenarioCrew, "Terry", DAYS, "on vacation");
const scenarioEvents = [
    createEvent("Solo Stream A", "basic"),
    createEvent("Backpack Stream B", "backpack"),
    createEvent("Solo Stream C", "basic")
];
const scenarioResult = generateSchedule(scenarioEvents, scenarioCrew);
console.log(JSON.stringify(printSchedule(scenarioResult.daySchedules), null, 2));
scenarioResult.notes.forEach(function(note) { console.log(note); });


console.log("\n=== Randomly generated, fully-confirmed weekly booking ===");
const booking = generateWeeklyBooking(crew, 6);
console.log(JSON.stringify(printSchedule(booking.daySchedules), null, 2));
booking.notes.forEach(function(note) { console.log(note); });


console.log("\n=== Call-out case 1: a substitute IS available (fixed input) ===");
const coEvents = [createEvent("Solo Stream X", "basic")];
const coResult = generateSchedule(coEvents, crew);
handleCallOut(coResult.daySchedules, crew, "Terry", "Monday").forEach(function(note) { console.log(note); });
console.log(JSON.stringify(printSchedule(coResult.daySchedules), null, 2));


console.log("\n=== Call-out case 2: no substitute available (fixed input) ===");
const smallCrew = [
    { name: "Em", type: "lead", unavailable: [{ day: "Monday", reason: "requested day off" }] },
    { name: "Terry", type: "lead", unavailable: [] },
    { name: "Dennis", type: "junior", unavailable: [] }
];
const coEvents2 = [createEvent("Solo Stream Y", "basic")];
const coResult2 = generateSchedule(coEvents2, smallCrew);
handleCallOut(coResult2.daySchedules, smallCrew, "Terry", "Monday").forEach(function(note) { console.log(note); });
console.log(JSON.stringify(printSchedule(coResult2.daySchedules), null, 2));
