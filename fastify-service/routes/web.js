//set all routes here
// import { stellariumMetadataHandler } from "../features/api/Stellarium/stellarium.controller.js";
// import { nasaMetadataHandler } from "../features/api/NASA/nasa.controller.js";
import { loginHandler, registerHandler } from "../features/user/public/user.controller.js";
import { getPlanetaryDataHandler } from "../features/api/AstronomyAPI/astronomy.controller.js";
import { getCurrentObjectHandler, updateCurrentObjectHandler, cacheAstroAPIHandler, getAstroAPIHandler } from "../features/telescope-control/currentObject.controller.js";
import { checkControl, fetchAllReservation, fetchUserReservation, makeReservation } from "../features/reservation/public/reservation.controller.js";
import { createUserHandler, deleteUserHandler, editUserHandler, getAllUsersHandler } from "../features/user/admin/user.controller.js";
import { getAllReservationHandler, getReservationByUserHandler, createReservationHandler, editReservationStatusHandler, deleteReservationHandler } from "../features/reservation/admin/reservation.controller.js";
import { viewerCount } from "../features/telescope-stream/viewer.js";
import { saveRecordHandler } from "../features/observation-records/public/records-controller.js";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default function webRoutes(fastify) {
    fastify.get('/', (request, reply) => reply.send('hello world!'));
    fastify.post('/register', registerHandler);
    fastify.post('/login', loginHandler);
    
    fastify.get('/current-object', getCurrentObjectHandler);
    fastify.get('/get-api-data', getAstroAPIHandler);
    fastify.post('/update-current-object', { preHandler: [fastify.authenticate] }, updateCurrentObjectHandler);
    fastify.post('/cache-api-data', { preHandler: [fastify.authenticate] }, cacheAstroAPIHandler);

    fastify.get('/auth/ws-control', { preHandler: [fastify.authenticate] }, checkControl);

    //Reservation
    fastify.get('/reservations', { preHandler: [fastify.authenticate] }, fetchAllReservation);
    fastify.get('/reservations/:username', { preHandler: [fastify.authenticate] }, fetchUserReservation);
    fastify.post('/reservations', { preHandler: [fastify.authenticate] }, makeReservation);

    //Observation Records
    fastify.post('/save-record', { preHandler: [fastify.authenticate] }, saveRecordHandler);

    //API External
    fastify.register(function (routes) {
        // routes.get('/stellarium/object', stellariumMetadataHandler);
        // routes.get('/nasa/object', nasaMetadataHandler);
        routes.get('/astronomy-api/planetary', getPlanetaryDataHandler);
        routes.get ('/astronomy-api/planetary/:id', getPlanetaryDataHandler);
    }, { prefix: '/api' });

    //Admin Service
    fastify.register(function (routes) {
        
        //User
        routes.get('/users', { preHandler: [fastify.requireAdmin] }, getAllUsersHandler);
        routes.post('/users', { preHandler: [fastify.requireAdmin] }, createUserHandler);
        routes.put('/users/:id', { preHandler: [fastify.requireAdmin] }, editUserHandler);
        routes.delete('/users/:id', { preHandler: [fastify.requireAdmin] }, deleteUserHandler);

        //Reservation
        routes.get('/reservations', { preHandler: [fastify.requireAdmin] }, getAllReservationHandler);
        routes.get('/reservations/:username', { preHandler: [fastify.requireAdmin] }, getReservationByUserHandler);
        routes.post('/reservations', { preHandler: [fastify.requireAdmin] }, createReservationHandler);
        routes.put('/reservations/:id', { preHandler: [fastify.requireAdmin] }, editReservationStatusHandler);
        routes.delete('/reservations/:id', { preHandler: [fastify.requireAdmin] }, deleteReservationHandler);

        //Stream
        routes.get('/viewers', { preHandler: [fastify.requireAdmin] }, viewerCount);
    }, { prefix: '/admin' });
}