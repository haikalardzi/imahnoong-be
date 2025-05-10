import stellariumRoutes from './stellarium.routes.js';

export default async function registerStellariumFeature(app) {
    await app.register(stellariumRoutes, { prefix: '/api' });
}