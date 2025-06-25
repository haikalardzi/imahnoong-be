/**
 * 
 * @param {import('fastify').FastifyRequest} request 
 * @param {import('fastify').FastifyReply} reply 
 */
export default async function authenticate(request, reply) {
    try {
        await request.jwtVerify({ onlyCookie: true });
    } catch (err) {
        reply.code(401).send({ error: 'Unauthorized' });
    }
}