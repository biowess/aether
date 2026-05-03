// ── Aether Weather Utilities ────────────────────────────────────

/**
 * WMO Weather Interpretation Codes → Aether condition tokens
 */
export const WMO_CONDITIONS = {
  0:  { id: 'clear',       label: 'Clear sky',         group: 'clear'  },
  1:  { id: 'mostly-clear',label: 'Mostly clear',       group: 'clear'  },
  2:  { id: 'partly-cloudy',label:'Partly cloudy',      group: 'cloudy' },
  3:  { id: 'overcast',    label: 'Overcast',           group: 'cloudy' },
  45: { id: 'fog',         label: 'Fog',                group: 'fog'    },
  48: { id: 'fog',         label: 'Icy fog',            group: 'fog'    },
  51: { id: 'drizzle',     label: 'Light drizzle',      group: 'rain'   },
  53: { id: 'drizzle',     label: 'Drizzle',            group: 'rain'   },
  55: { id: 'drizzle',     label: 'Dense drizzle',      group: 'rain'   },
  56: { id: 'freezing-drizzle', label: 'Freezing drizzle', group: 'rain' },
  57: { id: 'freezing-drizzle', label: 'Heavy freezing drizzle', group: 'rain' },
  61: { id: 'rain',        label: 'Light rain',         group: 'rain'   },
  63: { id: 'rain',        label: 'Moderate rain',      group: 'rain'   },
  65: { id: 'rain',        label: 'Heavy rain',         group: 'rain'   },
  66: { id: 'freezing-rain', label: 'Freezing rain',    group: 'rain'   },
  67: { id: 'freezing-rain', label: 'Heavy freezing rain', group: 'rain' },
  71: { id: 'snow',        label: 'Light snow',         group: 'snow'   },
  73: { id: 'snow',        label: 'Moderate snow',      group: 'snow'   },
  75: { id: 'snow',        label: 'Heavy snow',         group: 'snow'   },
  77: { id: 'snow',        label: 'Snow grains',        group: 'snow'   },
  80: { id: 'showers',     label: 'Light showers',      group: 'rain'   },
  81: { id: 'showers',     label: 'Showers',            group: 'rain'   },
  82: { id: 'showers',     label: 'Heavy showers',      group: 'rain'   },
  85: { id: 'snow-showers',label: 'Snow showers',       group: 'snow'   },
  86: { id: 'snow-showers',label: 'Heavy snow showers', group: 'snow'   },
  95: { id: 'thunderstorm',label: 'Thunderstorm',       group: 'storm'  },
  96: { id: 'thunderstorm',label: 'Thunderstorm w/ hail', group: 'storm' },
  99: { id: 'thunderstorm',label: 'Violent thunderstorm', group: 'storm' },
};

export function getCondition(code) {
  return WMO_CONDITIONS[code] ?? { id: 'unknown', label: 'Unknown', group: 'clear' };
}

/**
 * Atmospheric phrase — changes with time + conditions
 */
const PHRASES = {
  clear: {
    morning: ['Luminous morning air', 'Dawn breaking clear', 'Golden horizon, still air'],
    day:     ['Clear blue atmosphere', 'Open sky, sharp light', 'Crisp and cloudless'],
    sunset:  ['Amber light descending', 'The horizon warming', 'Last light over the city'],
    night:   ['Deep clear night', 'Stars overhead, still air', 'Quiet night atmosphere'],
  },
  cloudy: {
    morning: ['Soft overcast morning', 'Muted light, low cloud', 'Grey-blue diffusion'],
    day:     ['Overcast and still', 'Cloud layer holding', 'Filtered afternoon light'],
    sunset:  ['Clouds catching the last light', 'Diffused golden haze', 'Muted dusk palette'],
    night:   ['Overcast night sky', 'Cloud cover, no stars', 'Ambient urban glow'],
  },
  rain: {
    morning: ['Rain moving through', 'Wet morning air', 'Precipitation persisting'],
    day:     ['Rain approaching', 'Steady rainfall', 'Atmospheric moisture rising'],
    sunset:  ['Clearing after rain', 'Wet surfaces reflecting light', 'Rain passing west'],
    night:   ['Rain in the night air', 'Persistent overnight rain', 'Wet and still'],
  },
  snow: {
    morning: ['Snow falling quietly', 'Pale winter morning', 'Fresh snowfall overnight'],
    day:     ['Snow continues', 'White sky, soft light', 'Snowfall reducing visibility'],
    sunset:  ['Snow in fading light', 'Blue-white dusk', 'Winter atmosphere'],
    night:   ['Snowfall in darkness', 'Silent winter night', 'Deep cold, still snow'],
  },
  storm: {
    morning: ['Storm building', 'Tension in the air', 'Unstable morning conditions'],
    day:     ['Thunderstorm active', 'Severe weather warning', 'Atmospheric disturbance'],
    sunset:  ['Storm at dusk', 'Electrical activity nearby', 'Dangerous conditions'],
    night:   ['Night storm passing', 'Thunder in the distance', 'Storm system overhead'],
  },
  fog: {
    morning: ['Dense morning fog', 'Visibility reduced', 'Fog layer persisting'],
    day:     ['Fog lifting slowly', 'Misty midday atmosphere', 'Low visibility conditions'],
    sunset:  ['Evening fog rolling in', 'Haze at the horizon', 'Soft foggy dusk'],
    night:   ['Night fog', 'Dense mist, still air', 'Fog obscuring the stars'],
  },
};

export function getAtmosphericPhrase(weatherGroup, timeOfDay) {
  const group = PHRASES[weatherGroup] ?? PHRASES.clear;
  const period = group[timeOfDay] ?? group.day;
  return period[Math.floor(Date.now() / 60000) % period.length];
}

/**
 * Determine time-of-day period from hour
 */
export function getTimeOfDay(hour) {
  if (hour >= 5  && hour < 9)  return 'morning';
  if (hour >= 9  && hour < 17) return 'day';
  if (hour >= 17 && hour < 21) return 'sunset';
  return 'night';
}

/**
 * Wind direction degrees → compass label
 */
export function windDegToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

/**
 * Beaufort scale from km/h
 */
export function getBeaufortDescription(kmh) {
  if (kmh < 1)   return 'Calm';
  if (kmh < 6)   return 'Light air';
  if (kmh < 12)  return 'Light breeze';
  if (kmh < 20)  return 'Gentle breeze';
  if (kmh < 29)  return 'Moderate breeze';
  if (kmh < 39)  return 'Fresh breeze';
  if (kmh < 50)  return 'Strong breeze';
  if (kmh < 62)  return 'High wind';
  if (kmh < 75)  return 'Gale';
  if (kmh < 89)  return 'Severe gale';
  if (kmh < 103) return 'Storm';
  if (kmh < 118) return 'Violent storm';
  return 'Hurricane';
}

/**
 * UV index label
 */
export function getUVLabel(uv) {
  if (uv <= 2)  return 'Low';
  if (uv <= 5)  return 'Moderate';
  if (uv <= 7)  return 'High';
  if (uv <= 10) return 'Very high';
  return 'Extreme';
}

/**
 * Pressure trend label
 */
export function getPressureTrend(current, previous) {
  if (!previous) return 'Steady';
  const diff = current - previous;
  if (diff > 2)  return 'Rising';
  if (diff < -2) return 'Falling';
  return 'Steady';
}

/**
 * Temperature comfort label
 */
export function getTempComfort(celsius) {
  if (celsius < -10) return 'Extremely cold';
  if (celsius < 0)   return 'Freezing';
  if (celsius < 5)   return 'Very cold';
  if (celsius < 10)  return 'Cold';
  if (celsius < 15)  return 'Cool';
  if (celsius < 20)  return 'Mild';
  if (celsius < 25)  return 'Comfortable';
  if (celsius < 30)  return 'Warm';
  if (celsius < 35)  return 'Hot';
  return 'Extremely hot';
}

/**
 * SVG arc path helper — used in AtmosphericCore rings
 */
export function describeArc(cx, cy, r, startAngle, endAngle) {
  const toRad = (a) => (a - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map a value from one range to another
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}
