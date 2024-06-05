import Fastify from 'fastify';
import { config } from 'dotenv';
import { itemRoutes } from './routes/items';
import { userRoutes } from './routes/users';

config();

export function createServer() {
  const server = Fastify();

  server.register(itemRoutes);
  server.register(userRoutes);

  return server;
}

if (require.main === module) {
  const server = createServer();
  server.listen({ port: parseInt(process.env.PORT || '3000', 10) }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}
