// tests/api.test.js
const request = require('supertest');
const app = require('../src/app');
const { Order } = require('../src/models');
const EventService = require('../src/services/eventService');

describe('API Endpoints', () => {
  beforeAll(async () => {
    await Order.sync({ force: true });
  });

  test('POST /initialize - should initialize an event', async () => {
    const res = await request(app)
      .post('/initialize')
      .send({ eventId: 1, totalTickets: 100 });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.eventId).toBe(1);
    expect(res.body.totalTickets).toBe(100);
  });

  test('POST /book - should book a ticket', async () => {
    await EventService.initializeEvent(1, 100);
    const res = await request(app)
      .post('/book')
      .send({ eventId: 1, userId: 'user1' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('confirmed');
  });

  test('GET /status/:eventId - should return event status', async () => {
    await EventService.initializeEvent(2, 50);
    const res = await request(app)
      .get('/status/2');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.eventId).toBe(2);
    expect(res.body.totalTickets).toBe(50);
  });
});