import { FastifyInstance, FastifyRequest } from 'fastify';
import { purchaseItem } from '../services/userService';
import {
  userPurchaseBodySchema,
  userPurchasePathSchema,
} from '../validators/validator';
import { validateBody } from '../middleware/validateBody';
import { validatePath } from '../middleware/validatePath';

interface PurchaseParams {
  id: string;
}

interface PurchaseBody {
  amount: number;
}

export async function userRoutes(server: FastifyInstance) {
  server.post('/users/:id/purchase', {
    preHandler: [
      validateBody(userPurchaseBodySchema),
      validatePath(userPurchasePathSchema),
    ],
    handler: async (
      request: FastifyRequest<{ Params: PurchaseParams; Body: PurchaseBody }>,
      reply
    ) => {
      const userId = parseInt(request.params.id, 10);
      const amount = request.body.amount;

      try {
        await purchaseItem({ userId, amount });
        reply.send({ message: 'Purchase successful' });
      } catch (err) {
        reply.status(500).send(err);
      }
    },
  });
}
