import { getObjectMetadataHandler } from './stellarium.controller.js';

export default async function stellariumRoutes(app, opts) {
    app.get('/stellarium/object', getObjectMetadataHandler);
}