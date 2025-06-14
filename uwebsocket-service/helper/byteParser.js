
export function parseIP(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);

  // IPv4
  if (bytes.length === 4) {
    return bytes.join('.');
  }

  // IPv6
  if (bytes.length === 16) {
    const segments = [];
    for (let i = 0; i < 16; i += 2) {
      segments.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }
    return segments.join(':').replace(/(:0)+$/, ''); // clean trailing zeros
  }

  return 'Unknown IP format';
}