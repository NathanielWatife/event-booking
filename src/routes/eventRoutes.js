const express = require('express');
const eventController = require('../controllers/eventController');
const router = express.Router();

router.post('/initialize', eventController.initializeEvent);
router.post('/book', eventController.bookTicket);
router.post('/cancel', eventController.cancelTicket);
router.get('/status/:eventId', eventController.getEventStatus);

module.exports = router;