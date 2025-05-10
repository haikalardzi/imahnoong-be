//set all routes here
import { stellariumMetadataHandler } from "../features/api/Stellarium/stellarium.controller.js";
import { nasaMetadataHandler } from "../features/api/NASA/nasa.controller.js";
import { loginHandler, registerHandler } from "../features/user/auth.controller.js";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function webRoutes(fastify) {
    fastify.get('/', (request, reply) => reply.send('hello world!'));
    fastify.get('/stellarium/object', stellariumMetadataHandler);
    fastify.get('/nasa/object', nasaMetadataHandler);
    fastify.post('/register', registerHandler);
    fastify.post('/login', loginHandler);
}