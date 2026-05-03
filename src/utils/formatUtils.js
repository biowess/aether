// ── Aether Format Utilities ─────────────────────────────────────

/**
 * Format temperature with unit
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '—';
  if (unit === 'F') {
    return `${Math.round(celsius * 9/5 + 32)}°`;
  }
  return `${Math.round(celsius)}°`;
}

/**
 * Format temperature without degree symbol (for display in SVG)
 */
export function formatTempValue(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '—';
  if (unit === 'F') return `${Math.round(celsius * 9/5 + 32)}`;
  return `${Math.round(celsius)}`;
}

/**
 * Format wind speed
 */
export function formatWind(kmh, unit = 'km/h') {
  if (kmh === null || kmh === undefined) return '—';
  if (unit === 'mph')  return `${Math.round(kmh * 0.621371)} mph`;
  if (unit === 'm/s')  return `${(kmh / 3.6).toFixed(1)} m/s`;
  return `${Math.round(kmh)} km/h`;
}

/**
 * Format pressure
 */
export function formatPressure(hpa) {
  if (hpa === null || hpa === undefined) return '—';
  return `${Math.round(hpa)} hPa`;
}

/**
 * Format humidity
 */
export function formatHumidity(pct) {
  if (pct === null || pct === undefined) return '—';
  return `${Math.round(pct)}%`;
}

/**
 * Format visibility (meters → km)
 */
export function formatVisibility(meters) {
  if (meters === null || meters === undefined) return '—';
  if (meters >= 10000) return `${(meters / 1000).toFixed(0)} km`;
  if (meters >= 1000)  return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

/**
 * Format time from ISO string
 */
export function formatTime(isoString, format = '24h') {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date)) return '—';
  if (format === '12h') {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * Format hour label (e.g. "14:00" or "2 PM")
 */
export function formatHour(isoString, format = '24h') {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date)) return '—';
  if (format === '12h') {
    const h = date.getHours();
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h > 12 ? `${h - 12} PM` : `${h} AM`;
  }
  return String(date.getHours()).padStart(2, '0') + ':00';
}

/**
 * Format day label
 */
export function formatDay(isoString, style = 'short') {
  if (!isoString) return '—';
  const date = new Date(isoString + 'T00:00:00');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-US', {
    weekday: style === 'short' ? 'short' : 'long',
  });
}

/**
 * Format coordinates
 */
export function formatCoords(lat, lon) {
  if (lat === null || lon === null) return '—';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

/**
 * Format local time for a timezone
 */
export function getLocalTime(timezone) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}

/**
 * Format date for header
 */
export function formatDateHeader(timezone) {
  try {
    return new Date().toLocaleDateString('en-US', {
      timeZone: timezone,
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
}

/**
 * Get current hour in a timezone
 */
export function getCurrentHour(timezone) {
  try {
    return parseInt(new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      hour12: false,
    }));
  } catch {
    return new Date().getHours();
  }
}

/**
 * Precipitation chance label
 */
export function formatPrecipChance(pct) {
  if (pct === null || pct === undefined) return '—';
  return `${Math.round(pct)}%`;
}

/**
 * Round to 1 decimal
 */
export function round1(n) {
  return Math.round(n * 10) / 10;
}
