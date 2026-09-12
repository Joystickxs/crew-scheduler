const crew = [
    {
        name: "Em",
        type: "lead",
        unavailable: ["Monday"]
    },
    {
        name: "Terry",
        type: "lead",
        unavailable: []
    },
    {
        name: "Dennis",
        type: "junior",
        unavailable: []
    },
    {
        name: "Ron",
        type: "junior",
        unavailable: []
    },
    {
        name: "Jen",
        type: "assistant",
        unavailable: []
    },
    {
        name: "Treya",
        type: "assistant",
        unavailable: []
    }
];

console.log(crew);

const events = [
    {
        name: "Solo Stream",
        type: "basic"
    },
    {
        name: "Backpack Stream",
        type: "backpack"
    },
    {
        name: "Music Festival",
        type: "festival"
    }
];

console.log(events);

for (const person of crew) {
    if (person.type === "lead") {
        console.log(person.name + " is a Lead Engineer.");
    }
}

function isAvailable(person, day) {
    if (person.unavailable.includes(day)) {
        return false;
    }

    return true;
}

console.log(isAvailable(crew[0], "Monday"));

const availableLeads = crew.filter(function(person) {
    return person.type === "lead" && isAvailable(person, "Monday");
});

console.log(availableLeads);

function getRequirements(eventType) {
    if (eventType === "basic") {
        return {
            leads: 1,
            juniors: 0,
            assistants: 0
        };
    }

    if (eventType === "backpack") {
        return {
            leads: 1,
            juniorsOrAssistants: 1,

        };
    }

    if (eventType === "festival") {
        return {
            leads: 2,
            juniors: 2,
            anyWorkers: 4
        };
    }
}

console.log(getRequirements("basic"));
console.log(getRequirements("backpack"));
console.log(getRequirements("festival"));

console.log(getAvailableCrewByType(crew, "lead", "Monday"));
console.log(getAvailableCrewByType(crew, "junior", "Monday"));
console.log(getAvailableCrewByType(crew, "assistant", "Monday"));

function getAvailableCrewByType(crew, type, day) {
    return crew.filter(function(person) {
        return person.type === type && isAvailable(person, day);
    });
}

function canStaffEvent(event, crew, day) {
    const availableLeads = getAvailableCrewByType(crew, "lead", day);
    const availableJuniors = getAvailableCrewByType(crew, "junior", day);
    const availableAssistants = getAvailableCrewByType(crew, "assistant", day);

    if (event.type === "basic") {
        return availableLeads.length >= 1;
    }

    if (event.type === "backpack") {
        return (
            availableLeads.length >= 1 &&
            (availableJuniors.length >= 1 || availableAssistants.length >= 1)
        );
    }

    if (event.type === "festival") {
        return false;
    }

    return false;
}

    console.log(
    canStaffEvent(events[0], crew, "Monday")
);

console.log(
    canStaffEvent(events[1], crew, "Monday")
);

function getAvailableCrew(crew, day, assignedCrew) {
    return crew.filter(function(person) {
        return isAvailable(person, day) && !assignedCrew.includes(person.name);
    });
}

function assignCrew(event, crew, day, assignedCrew) {
    const availableCrew = getAvailableCrew(crew, day, assignedCrew);

    if (event.type === "basic") {
        const lead = availableCrew.find(function(person) {
            return person.type === "lead";
        });

        if (lead) {
            assignedCrew.push(lead.name);
            return [lead.name];
        }

        return null;
    }

    if (event.type === "backpack") {
        const lead = availableCrew.find(function(person) {
            return person.type === "lead";
        });

        const juniorOrAssistant = availableCrew.find(function(person) {
            return person.type === "junior" || person.type === "assistant";
        });

        if (lead && juniorOrAssistant) {
            assignedCrew.push(lead.name);
            assignedCrew.push(juniorOrAssistant.name);

            return [lead.name, juniorOrAssistant.name];
        }

        return null;
    }
    if (event.type === "festival") {
    const leads = availableCrew.filter(function(person) {
        return person.type === "lead";
    });

    const juniors = availableCrew.filter(function(person) {
        return person.type === "junior";
    });

    const anyWorkers = availableCrew.filter(function(person) {
        return (
            person.type === "lead" ||
            person.type === "junior" ||
            person.type === "assistant"
        );
    });

    if (
        leads.length >= 2 &&
        juniors.length >= 2 &&
        anyWorkers.length >= 8
    ) {
        const selectedCrew = [
            ...leads.slice(0, 2),
            ...juniors.slice(0, 2)
        ];

        for (const person of selectedCrew) {
            assignedCrew.push(person.name);
        }

        return selectedCrew.map(function(person) {
            return person.name;
        });
    }

    return null;
    }
}


const mondayAssigned = [];

console.log(
    assignCrew(events[0], crew, "Monday", mondayAssigned)
);

console.log(
    assignCrew(events[1], crew, "Monday", mondayAssigned)
);

console.log("Monday assigned:", mondayAssigned);

console.log(
    assignCrew(events[2], crew, "Monday", [])
);
