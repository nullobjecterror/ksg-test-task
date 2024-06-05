import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createServer } from '../server';

let server: FastifyInstance;

beforeAll(async () => {
  server = createServer();
  await server.ready();
});

afterAll(async () => {
  await server.close();
});

describe('GET /items', () => {
  it('should return a list of items with tradable and non-tradable prices with real request', async () => {
    const response = await request(server.server).get('/items');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((item: any) => {
      expect(item).toHaveProperty('marketHashName');
      expect(item).toHaveProperty('nonTradableMinPrice');
      expect(item).toHaveProperty('tradableMinPrice');
    });
  }, 50000);
});
