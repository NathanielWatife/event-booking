const EventService = require('../src/services/eventService');
const { Order } = require('../src/models');
const sequelize = require('../src/config/database');

describe('EventService', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Order.destroy({ where: {} });
  });

  test('should initialize an event', async () => {
    const eventId = 1;
    const totalTickets = 100;
    const result = await EventService.initializeEvent(eventId, totalTickets);
    
    expect(result.eventId).toBe(eventId);
    expect(result.totalTickets).toBe(totalTickets);
    expect(result.bookedTickets).toBe(0);
  });

  test('should book a ticket when available', async () => {
    const eventId = 1;
    const userId = 'user1';
    await EventService.initializeEvent(eventId, 1);
    
    const result = await EventService.bookTicket(eventId, userId, Order);
    expect(result.status).toBe('confirmed');
    expect(result.position).toBeNull();
  });

  test('should add to waiting list when sold out', async () => {
    const eventId = 1;
    await EventService.initializeEvent(eventId, 1);
    
    // First booking
    await EventService.bookTicket(eventId, 'user1', Order);
    
    // Second booking
    const result = await EventService.bookTicket(eventId, 'user2', Order);
    expect(result.status).toBe('waiting');
    expect(result.position).toBe(1);
  });

  test('should handle cancellation and reassign to waiting list', async () => {
    const eventId = 1;
    await EventService.initializeEvent(eventId, 1);
    
    // Book and create waiting list
    await EventService.bookTicket(eventId, 'user1', Order);
    await EventService.bookTicket(eventId, 'user2', Order);
    
    // Cancel first booking
    const result = await EventService.cancelBooking(eventId, 'user1', Order);
    expect(result.reassigned).toBe(true);
    expect(result.toUserId).toBe('user2');
  });
});