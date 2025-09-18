
export function simpleCode() {
  return Math.random().toString(36).slice(2, 7); // 5 chars
}

export function isValidUrl(s) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

// coarse location helper: rounds lat/lon to 1 decimal -> coarse granularity
export function coarseFromCoords(lat, lon) {
  return `${lat.toFixed(1)},${lon.toFixed(1)}`;
}

export function isExpired(createdISO, mins) {
  const created = new Date(createdISO).getTime();
  return Date.now() > created + mins * 60_000;
}
