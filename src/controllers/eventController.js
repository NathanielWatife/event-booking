const eventService = require('../services/eventService');

class EventController {
    async initializeEvent(req, res) {
        const { eventId, totalTickets } = req.body;
        await eventService.initializeEvent(eventId, totalTickets);
        res.status(201).json({ message: 'Event initialized' });
    }

    async bookTicket(req, res) {
        const { eventId, userId } = req.body;
        const result = await eventService.bookTicket(eventId, userId);
        res.status(200).json(result);
    }

    async cancelTicket(req, res) {
        const { eventId, userId } = req.body;
        const result = await eventService.cancelTicket(eventId, userId);
        res.status(200).json(result);
    }

    async getEventStatus(req, res) {
        const { eventId } = req.params;
        const status = await eventService.getEventStatus(eventId);
        res.status(200).json(status);
    }
}

module.exports = new EventController();