const request = require('supertest');
const app = require('../../src/app');

describe('Event Routes Integration Tests', () => {
  test('POST /initialize', async () => {
    const res = await request(app)
      .post('/api/initialize')
      .send({ eventId: 1, totalTickets: 100 });
    expect(res.statusCode).toBe(201);
  });
});