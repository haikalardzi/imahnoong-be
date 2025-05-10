
export async function getNasaObjectMetadata(name) {
    //https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY
    // const url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(name)}&api_key=${NASA_API_KEY}`;
    const NASA_API_KEY = process.env.NASA_API_KEY;

    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch NASA data: ${res.statusText}`);
    }

    const rateLimitLimit = res.headers.get('X-RateLimit-Limit');
    const rateLimitRemaining = res.headers.get('X-RateLimit-Remaining');
    console.log(`Rate limit: ${rateLimitLimit}, remaining: ${rateLimitRemaining}`);

    const data = await res.json();
    return data;
}