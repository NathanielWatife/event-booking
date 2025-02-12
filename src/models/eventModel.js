class EventModel {
    constructor() {
        this.events = new Map();
    }
    initializeEvent(eventId, totalTickets) {
        this.events.set(eventId, {
            totalTickets,
            bookedTickets: 0,
            waitingList: [],
        });
    }

    bookTicket(eventId, userId) {
        const event = this.events.get(eventId);
        if (!event) throw new Error('Event not found');

        if (event.bookedTickets < event.totalTickets) { // Fixed: `events` -> `event`
            event.bookedTickets++;
            return { status: 'booked', userId };
        } else {
            event.waitingList.push(userId);
            return { status: 'waiting', userId };
        }
    }

    cancelTicket(eventId, userId) {
        const event = this.events.get(eventId);
        if (!event) throw new Error('Event not found');

        if (event.bookedTickets > 0) {
            event.bookedTickets--;
            if (event.waitingList.length > 0) {
                const nextUser = event.waitingList.shift();
                event.bookedTickets++;
                return { status: 'reassigned', userId: nextUser };
            }
        }
        return { status: 'cancelled', userId };
    }

    getEventStatus(eventId) {
        const event = this.events.get(eventId);
        if (!event) throw new Error('Event not found');

        return {
            availableTickets: event.totalTickets - event.bookedTickets, // Fixed: `availableTicket` -> `availableTickets`
            waitingListCount: event.waitingList.length, // Fixed: `waitingList` -> `waitingListCount`
        };
    }
}

module.exports = new EventModel();