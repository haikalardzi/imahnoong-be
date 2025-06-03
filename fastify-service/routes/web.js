//set all routes here
import { stellariumMetadataHandler } from "../features/api/Stellarium/stellarium.controller.js";
import { nasaMetadataHandler } from "../features/api/NASA/nasa.controller.js";
import { loginHandler, registerHandler } from "../features/user/auth.controller.js";
import { getPlanetaryDataHandler } from "../features/api/AstronomyAPI/astronomy.controller.js";
import { getCurrentObjectHandler, updateCurrentObjectHandler, cacheAstroAPIHandler, getAstroAPIHandler } from "../features/telescope-control/currentObject.controller.js";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function webRoutes(fastify) {
    fastify.get('/', (request, reply) => reply.send('hello world!'));
    
    //API External
    fastify.register(async function (routes) {
        // routes.get('/stellarium/object', stellariumMetadataHandler);
        // routes.get('/nasa/object', nasaMetadataHandler);
        routes.get('/astronomy-api/planetary', getPlanetaryDataHandler);
        routes.get ('/astronomy-api/planetary/:id', getPlanetaryDataHandler);
    }, { prefix: '/api' });

    fastify.post('/register', registerHandler);
    fastify.post('/login', loginHandler);

    fastify.get('/current-object', getCurrentObjectHandler);
    fastify.post('/update-current-object', { preHandler: [fastify.authenticate] }, updateCurrentObjectHandler);
    fastify.get('/get-api-data', getAstroAPIHandler);
    fastify.post('/cache-api-data', { preHandler: [fastify.authenticate] }, cacheAstroAPIHandler);
}