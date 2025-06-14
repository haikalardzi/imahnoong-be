// features/astronomy/controller.js
import { fetchPlanetaryPositions } from './astronomy.service.js';

export async function getPlanetaryDataHandler(request, response) {
    try {
        const data = await fetchPlanetaryPositions();
        response.send(data);  // You can also refine this to send only data.data.table.rows
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
}
