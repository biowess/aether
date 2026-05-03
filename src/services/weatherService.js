// ── Aether Weather Service ───────────────────────────────────────
// Fetches weather data from Open-Meteo (no API key required)

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Fetch complete weather data for a location
 */
export async function fetchWeather(latitude, longitude, timezone = 'auto', signal) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone,

    // Current conditions
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'surface_pressure',
      'visibility',
    ].join(','),

    // Hourly (next 48 hours)
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'wind_speed_10m',
      'wind_direction_10m',
      'visibility',
      'uv_index',
    ].join(','),

    // Daily (7 days)
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
      'uv_index_max',
    ].join(','),

    forecast_days: '7',
    hourly_units: 'auto',
  });

  const response = await fetch(`${BASE_URL}?${params}`, { signal });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return transformWeatherData(data);
}

/**
 * Transform raw API response into Aether's weather model
 */
function transformWeatherData(raw) {
  const current = raw.current;
  const hourly  = raw.hourly;
  const daily   = raw.daily;

  // Current conditions
  const currentWeather = {
    temperature:       current.temperature_2m,
    feelsLike:         current.apparent_temperature,
    humidity:          current.relative_humidity_2m,
    precipitation:     current.precipitation,
    weatherCode:       current.weather_code,
    cloudCover:        current.cloud_cover,
    windSpeed:         current.wind_speed_10m,
    windDirection:     current.wind_direction_10m,
    windGusts:         current.wind_gusts_10m,
    pressure:          current.surface_pressure,
    visibility:        current.visibility,
    isDay:             current.is_day === 1,
    time:              current.time,
  };

  // Hourly forecast (next 48 entries from now)
  const now = new Date();
  const hourlyForecast = hourly.time.map((time, i) => ({
    time,
    temperature:           hourly.temperature_2m[i],
    precipitationChance:   hourly.precipitation_probability[i],
    precipitation:         hourly.precipitation[i],
    weatherCode:           hourly.weather_code[i],
    cloudCover:            hourly.cloud_cover[i],
    windSpeed:             hourly.wind_speed_10m[i],
    windDirection:         hourly.wind_direction_10m[i],
    visibility:            hourly.visibility[i],
    uvIndex:               hourly.uv_index[i],
  })).filter(h => new Date(h.time) >= now).slice(0, 48);

  // Daily forecast
  const dailyForecast = daily.time.map((date, i) => ({
    date,
    weatherCode:           daily.weather_code[i],
    tempMax:               daily.temperature_2m_max[i],
    tempMin:               daily.temperature_2m_min[i],
    feelsLikeMax:          daily.apparent_temperature_max[i],
    feelsLikeMin:          daily.apparent_temperature_min[i],
    sunrise:               daily.sunrise[i],
    sunset:                daily.sunset[i],
    precipitationSum:      daily.precipitation_sum[i],
    precipitationChance:   daily.precipitation_probability_max[i],
    windSpeedMax:          daily.wind_speed_10m_max[i],
    windDirectionDominant: daily.wind_direction_10m_dominant[i],
    uvIndexMax:            daily.uv_index_max[i],
  }));

  return {
    current:  currentWeather,
    hourly:   hourlyForecast,
    daily:    dailyForecast,
    timezone: raw.timezone,
    timezone_abbreviation: raw.timezone_abbreviation,
    elevation: raw.elevation,
    fetchedAt: Date.now(),
  };
}
