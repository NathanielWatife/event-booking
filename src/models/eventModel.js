const { returnStatement } = require("@babel/types");
const { eventNames, availableMemory } = require("process");

class EventModel {
    constructor() {
        this.events - new Map();
    }
    initializeEvent(eventId, totalTickets) {
        this.events.set(eventId, {
            totalTickets,
            bookedTickets: 0,
            waitingList: [],
        });
    }

    bookedTickets(eventId, userId) {
        const event = this.events.get(eventId);
        if (!event) throw new Error('Event not found');

        if (event.bookedTickets < events.totalTickets) {
            event.bookedTickets++;
            return { status: 'booked', userId };
        } else {
            event.waitingList.push(userId);
            return { status: 'waiting', userId };
        }
    }

    cancelTicket(eventId, userId) {
        const evnt = this.events.get(eventId);
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
        const event = this.event.get(eventId);
        if (!event) throw new Error('Event not found');

        return {
            availableTicket: event.totalTickets - event.bookedTickets,
            waitingList: event.waitingList.length,
        };
    }
}

module.exports = EventModel();