const { Order } = require('../models');
const eventService = require('../services/eventService');


exports.initializeEvent = async (req, res) => {
    try {
        const { eventId, totalTickets } = req.body;
        if (!eventId || !totalTickets) {
            return res.status(400).json({ error: 'eventId and totalTickets are required' });
        }
        
        const event = await eventService.initializeEvent( eventId, totalTickets);
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Add this debug check
console.log('Order model methods:', {
    findOne: typeof Order.findOne,
    create: typeof Order.create,
    update: typeof Order.update
  });



exports.bookTicket = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        if (!eventId || !userId) {
            return res.status(400).json({ error: 'eventId and userId are required' });
        }

        console.log('Passing Order model to service:', Order);
        const result = await eventService.bookTicket(eventId, userId, Order);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        if (!eventId || !userId) {
            return res.status(400).json({ error: 'eventId and userId are required' });
        }

        const result = await eventService.cancelBooking(eventId, userId, Order);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



exports.getEventStatus = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!eventId) {
            return res.status(400).json({ error: 'eventId is required' });
        }

        const status = await eventService.getEventStatus(eventId);
        res.status(200).json(status);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};