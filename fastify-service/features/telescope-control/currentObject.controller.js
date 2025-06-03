import { cacheAPIData, fetchAPIData, fetchCurrentObject, updateCurrentObject } from "./currentObject.service.js";

export function getCurrentObjectHandler(request, response) {
    try {
        const data = fetchCurrentObject();
        response.send(data);  // You can also refine this to send only data.data.table.rows
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
}

export function updateCurrentObjectHandler(request, response) {
    try {
        const data = updateCurrentObject(request.body);
        response.send(data);  // You can also refine this to send only data.data.table.rows
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
}

export function cacheAstroAPIHandler(request, response) {
    try {
        console.log(request.body);
        const data = cacheAPIData(request.body);
        response.send(data);  // You can also refine this to send only data.data.table.rows
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
}

export function getAstroAPIHandler(request, response) {
    try {
        const data = fetchAPIData();
        console.log(data);
        response.send(data);  // You can also refine this to send only data.data.table.rows
    } catch (error) {
        response.status(500).send({ error: error.message });
    }
}