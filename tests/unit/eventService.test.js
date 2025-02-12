const eventService = require('../../src/services/eventService');

describe('EventService Unit Tests', () => {
  test('Initialize Event', async () => {
    await eventService.initializeEvent(1, 100);
    const status = await eventService.getEventStatus(1);
    expect(status.availableTickets).toBe(100);
  });

  test('Book Ticket', async () => {
    await eventService.initializeEvent(1, 100); // Ensure the event is initialized
    const result = await eventService.bookTicket(1, 'user1'); // Fixed: `booktTicket` -> `bookTicket`
    expect(result.status).toBe('booked');
  });
});