import { FastifyRequest } from 'fastify';

export type AppRequest = FastifyRequest & {
  userId: number;
};
