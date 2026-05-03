import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageGet, storageSet } from '../services/storageService';
import { applyColorScheme } from '../utils/themeUtils';

const DEFAULTS = {
  // Display
  temperatureUnit:     'C',       // 'C' | 'F'
  windUnit:            'km/h',    // 'km/h' | 'mph' | 'm/s'
  timeFormat:          '24h',     // '24h' | '12h'
  colorScheme:         'dark',    // 'dark' | 'light' | 'system'

  // Behavior
  geolocationEnabled:  true,
  defaultPage:         'home',    // 'home' | 'forecast' | 'locations'
  refreshInterval:     15,        // minutes

  // Visual
  motionIntensity:     'full',    // 'full' | 'reduced' | 'minimal'
  atmosphericEffects:  true,
  backgroundIntensity: 75,        // 0–100
  glowIntensity:       60,        // 0–100
  compactMode:         false,
  performanceMode:     'balanced',// 'high-fidelity' | 'balanced' | 'battery-saver' | 'minimal'

  // Accessibility
  highContrast:        false,
  largeText:           false,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(() => ({
    ...DEFAULTS,
    ...storageGet('settings', {}),
  }));

  // Apply color scheme on mount and change
  useEffect(() => {
    applyColorScheme(settings.colorScheme);
  }, [settings.colorScheme]);

  // Apply glow/background intensity as CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--glow-multiplier', (settings.glowIntensity / 100).toString());
    root.style.setProperty('--bg-intensity', (settings.backgroundIntensity / 100).toString());
  }, [settings.glowIntensity, settings.backgroundIntensity]);

  // Apply high-contrast mode via data attribute (CSS rules in global.css)
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-high-contrast',
      settings.highContrast ? 'true' : 'false'
    );
  }, [settings.highContrast]);

  // Apply large-text mode via data attribute (CSS rules in global.css)
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-large-text',
      settings.largeText ? 'true' : 'false'
    );
  }, [settings.largeText]);

  const updateSetting = useCallback((key, value) => {
    setSettingsState(prev => {
      const next = { ...prev, [key]: value };
      storageSet('settings', next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULTS);
    storageSet('settings', DEFAULTS);
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
