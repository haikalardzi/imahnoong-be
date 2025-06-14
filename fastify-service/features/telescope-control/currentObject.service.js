import cache from "../../utils/cache.js";

export function fetchCurrentObject(){
    return cache.getCurrentData();
}

export function updateCurrentObject(body) {
    cache.setCurrentData(body.data, body.index);
    return cache.getCurrentData();
}

export function cacheAPIData(objects) {
    cache.setAstroAPIData(objects);
    return cache.getAstroAPIData();
}

export function fetchAPIData() {
    return cache.getAstroAPIData();
}