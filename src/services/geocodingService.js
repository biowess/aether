// ── Aether Geocoding Service ────────────────────────────────────
// Uses Open-Meteo's Geocoding API (no key needed)

const GEO_BASE = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Search for locations by name
 */
export async function searchLocations(query, count = 8) {
  if (!query || query.trim().length < 2) return [];

  const params = new URLSearchParams({
    name:     query.trim(),
    count:    count.toString(),
    language: 'en',
    format:   'json',
  });

  const response = await fetch(`${GEO_BASE}?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding error: ${response.status}`);
  }

  const data = await response.json();
  if (!data.results) return [];

  return data.results.map(r => ({
    id:        r.id,
    name:      r.name,
    country:   r.country,
    countryCode: r.country_code,
    region:    r.admin1 ?? '',
    latitude:  r.latitude,
    longitude: r.longitude,
    timezone:  r.timezone,
    elevation: r.elevation,
    population: r.population ?? null,
    displayName: buildDisplayName(r),
  }));
}

/**
 * Build a clean display name for a location
 */
function buildDisplayName(r) {
  const parts = [r.name];
  if (r.admin1 && r.admin1 !== r.name) parts.push(r.admin1);
  parts.push(r.country);
  return parts.join(', ');
}

/**
 * Reverse geocode coordinates using a simple lookup
 * (Open-Meteo doesn't support reverse geocoding, so we do a name search
 *  using rough location context — or fall back to coordinates)
 */
export async function reverseGeocode(latitude, longitude) {
  // Use a free reverse geocode service
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
    const response = await fetch(url, {
      headers: { 'Accept-Language': 'en' }
    });
    if (!response.ok) throw new Error('Nominatim error');
    const data = await response.json();

    const address = data.address ?? {};
    const name = address.city || address.town || address.village || address.county || 'Unknown location';
    const region = address.state || address.region || '';
    const country = address.country || '';
    const countryCode = address.country_code?.toUpperCase() || '';

    return {
      id:          `geo_${latitude}_${longitude}`,
      name,
      region,
      country,
      countryCode,
      latitude,
      longitude,
      timezone:    'auto',
      displayName: [name, region, country].filter(Boolean).join(', '),
    };
  } catch {
    return {
      id:          `geo_${latitude}_${longitude}`,
      name:        'Current location',
      region:      '',
      country:     '',
      countryCode: '',
      latitude,
      longitude,
      timezone:    'auto',
      displayName: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`,
    };
  }
}
