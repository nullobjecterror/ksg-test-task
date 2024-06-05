import request from 'supertest';
import { FastifyInstance } from 'fastify';
import { createServer } from '../server';
import pool from '../db';

let server: FastifyInstance;

beforeAll(async () => {
  server = createServer();
  await server.ready();
  await pool.query(`
    INSERT INTO users (id, balance) VALUES (1, 500)
    ON CONFLICT (id) DO NOTHING;
  `);
});

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE id = 1');
  await server.close();
  await pool.end();
});

describe('POST /users/:id/purchase', () => {
  it('should deduct the user balance on successful purchase', async () => {
    const response = await request(server.server)
      .post('/users/1/purchase')
      .send({ amount: 100 });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Purchase successful' });

    const { rows } = await pool.query('SELECT balance FROM users WHERE id = $1', [1]);
    expect(rows[0].balance).toBe(400); // initial balance 500 - 100 = 400
  });

  it('should return an error if the balance is insufficient', async () => {
    const response = await request(server.server)
      .post('/users/1/purchase')
      .send({ amount: 1000 }); // higher than the available balance

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'Insufficient balance');
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(server.server)
      .post('/users/999/purchase')
      .send({ amount: 100 });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('message', 'User not found');
  });
});
