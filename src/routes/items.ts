import { FastifyInstance } from 'fastify';
import { getItems } from '../services/itemsService';

export async function itemRoutes(server: FastifyInstance) {
  server.get('/items', async (_request, reply) => {
    try {
      const items = await getItems();
      reply.send(items);
    } catch (err) {
      reply.status(500).send(err);
    }
  });
}
