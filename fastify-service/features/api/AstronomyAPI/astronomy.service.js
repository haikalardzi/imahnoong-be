// features/astronomy/service.js
const BASE_URL = 'https://api.astronomyapi.com/api/v2';

const TELESCOPE_LATITUDE = process.env.TELESCOPE_LATITUDE;
const TELESCOPE_LONGITUDE = process.env.TELESCOPE_LONGITUDE;
const TELESCOPE_ELEVATION = process.env.TELESCOPE_ELEVATION;

const ASTRO_API_APP_ID = process.env.ASTRO_API_APP_ID;
const ASTRO_API_APP_SECRET = process.env.ASTRO_API_APP_SECRET;

const AUTH_STRING = Buffer.from(`${ASTRO_API_APP_ID}:${ASTRO_API_APP_SECRET}`).toString('base64');

export async function fetchPlanetaryPositions() {
    const now = new Date();
    const date = now.toISOString().split('T')[0];

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}%3A${minutes}%3A${seconds}`;

    const url = `${BASE_URL}/bodies/positions?longitude=${TELESCOPE_LONGITUDE}&latitude=${TELESCOPE_LATITUDE}&elevation=${TELESCOPE_ELEVATION}&from_date=${date}&to_date=${date}&time=${time}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${AUTH_STRING}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}
