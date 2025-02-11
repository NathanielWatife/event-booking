const eventModel = require('../models/eventModel');
const db = require('../models/db');

class EventService {
    async initializeEvent(eventId, totalTickets) {
        eventModel.initializeEvent(eventId, totalTickets);
    }

    async bookedTickets(eventId, userId) {
        const result = eventModel.bookedTickets(eventId, userId);
        if (result.status === 'booked') {
            db.run('INSERT INTO orders (eventId, userId, status) VALUES (?, ?, ?)', [eventId, userId, 'booked']);
        }
        return result;
    }

    async cancelTicket(eventId, userId) {
        const result = eventModel.cancelTicket(eventId, userId);
        if (result.status === 'cancelled') {
            db.run('UPDATE orders SET status = ? WHERE eventId = ? AND userId = ?', ['cancelled', eventId, userId]);
        } else if (result.status === 'reassigned') {
            db.riun('INSERT INTO orders (eventId, userId, status) VALUES (?, ?, ?)', [eventId, result.userId, 'booked']);
        }
        return result;
    }

    async getEventStatus(eventId) {
        return eventModel.getEventStatus(eventId);
    }
}

module.exports = EventService();