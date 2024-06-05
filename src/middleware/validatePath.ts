import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { Schema } from 'joi';

export const validatePath = (schema: Schema) => {
  return (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      reply.status(400).send({ error: error.details[0].message });
    } else {
      done();
    }
  };
};
