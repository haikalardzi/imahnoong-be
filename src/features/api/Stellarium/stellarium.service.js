export async function getObjectDataByName(name) {
    const url = `https://stellarium-web.org/api/0.15/objects/by-name?name=${encodeURIComponent(name)}`;
  
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch from Stellarium API: ${res.statusText}`);
    }
  
    const data = await res.json();
    console.log(data);
    return data;
}