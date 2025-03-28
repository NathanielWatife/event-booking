const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { apiLimiter } = require('../config/rateLimiter');

router.post('/initialize', apiLimiter, eventController.initializeEvent);
router.post('/book', apiLimiter, eventController.bookTicket);
router.post('/cancel', apiLimiter, eventController.cancelBooking);
router.get('/status/:eventId', apiLimiter, eventController.getEventStatus);

module.exports = router;