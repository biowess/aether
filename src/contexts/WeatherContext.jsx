import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeather } from '../services/weatherService';
import { useLocation } from './LocationContext';
import { useSettings } from './SettingsContext';
import { getCondition, getTimeOfDay } from '../utils/weatherUtils';
import { selectThemePreset, applyTheme } from '../utils/themeUtils';
import { getCurrentHour } from '../utils/formatUtils';

const WeatherContext = createContext(null);

export function WeatherProvider({ children }) {
  const { activeLocation } = useLocation();
  const { settings } = useSettings();

  const [weather, setWeather]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const intervalRef = useRef(null);
  const abortRef    = useRef(null);
  const cacheRef    = useRef({});

  const loadWeather = useCallback(async (location) => {
    if (!location) return;

    const key = JSON.stringify({ lat: location.latitude, lon: location.longitude });

    // Serve cached data immediately (prevents blank screen)
    if (cacheRef.current[key]) {
      setWeather(cacheRef.current[key]);
    }

    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(
        location.latitude,
        location.longitude,
        location.timezone || 'auto',
        controller.signal
      );

      if (controller.signal.aborted) return;

      // Cache result
      cacheRef.current[key] = data;

      setWeather(data);
      setLastUpdated(Date.now());

      // Apply atmospheric theme
      const condition = getCondition(data.current.weatherCode);
      const hourNow   = getCurrentHour(data.timezone || 'UTC');
      const timeOfDay = getTimeOfDay(isNaN(hourNow) ? new Date().getHours() : hourNow);
      const preset    = selectThemePreset(timeOfDay, condition.group);
      applyTheme(preset);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to load weather data');
      }
    } finally {
      // CRITICAL: always clear loading
      setLoading(false);
    }
  }, []);

  // Load on location change
  useEffect(() => {
    if (!activeLocation) return;
    const key = JSON.stringify({ lat: activeLocation.latitude, lon: activeLocation.longitude });

    if (!cacheRef.current[key]) {
      loadWeather(activeLocation);
    } else {
      setWeather(cacheRef.current[key]);
      setLoading(false);
    }
  }, [activeLocation, loadWeather]);

  // Auto-refresh
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const ms = (settings.refreshInterval ?? 15) * 60 * 1000;
    intervalRef.current = setInterval(() => loadWeather(activeLocation), ms);
    return () => clearInterval(intervalRef.current);
  }, [activeLocation, settings.refreshInterval, loadWeather]);

  const refresh = useCallback(() => {
    loadWeather(activeLocation);
  }, [activeLocation, loadWeather]);

  // Derived state
  const condition   = weather ? getCondition(weather.current.weatherCode) : null;
  const hourNow     = weather ? getCurrentHour(weather.timezone) : new Date().getHours();
  const timeOfDay   = getTimeOfDay(isNaN(hourNow) ? new Date().getHours() : hourNow);

  return (
    <WeatherContext.Provider value={{
      weather,
      loading,
      error,
      lastUpdated,
      refresh,
      condition,
      timeOfDay,
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider');
  return ctx;
}
