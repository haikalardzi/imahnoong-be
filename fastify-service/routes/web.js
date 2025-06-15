//set all routes here
// import { stellariumMetadataHandler } from "../features/api/Stellarium/stellarium.controller.js";
// import { nasaMetadataHandler } from "../features/api/NASA/nasa.controller.js";
import { loginHandler, registerHandler } from "../features/user/auth.controller.js";
import { getPlanetaryDataHandler } from "../features/api/AstronomyAPI/astronomy.controller.js";
import { getCurrentObjectHandler, updateCurrentObjectHandler, cacheAstroAPIHandler, getAstroAPIHandler } from "../features/telescope-control/currentObject.controller.js";
import { fetchAllReservation, fetchUserReservation, makeReservation } from "../features/reservation/reservation.controller.js";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function webRoutes(fastify) {
    fastify.get('/', (request, reply) => reply.send('hello world!'));
    fastify.post('/register', registerHandler);
    fastify.post('/login', loginHandler);
    
    fastify.get('/current-object', getCurrentObjectHandler);
    fastify.get('/get-api-data', getAstroAPIHandler);
    fastify.post('/update-current-object', { preHandler: [fastify.authenticate] }, updateCurrentObjectHandler);
    fastify.post('/cache-api-data', { preHandler: [fastify.authenticate] }, cacheAstroAPIHandler);
    
    //Reservation
    fastify.get('/reservations', { preHandler: [fastify.authenticate] }, fetchAllReservation);
    fastify.get('/reservations/:username', { preHandler: [fastify.authenticate] }, fetchUserReservation);
    fastify.post('/reservations', { preHandler: [fastify.authenticate] }, makeReservation);

    //API External
    fastify.register(async function (routes) {
        // routes.get('/stellarium/object', stellariumMetadataHandler);
        // routes.get('/nasa/object', nasaMetadataHandler);
        routes.get('/astronomy-api/planetary', getPlanetaryDataHandler);
        routes.get ('/astronomy-api/planetary/:id', getPlanetaryDataHandler);
    }, { prefix: '/api' });
}