import { createContext, useContext, useState, useCallback } from 'react';
import { storageGet, storageSet } from '../services/storageService';

// Default location: London
const DEFAULT_LOCATION = {
  id:          'london_default',
  name:        'London',
  region:      'England',
  country:     'United Kingdom',
  countryCode: 'GB',
  latitude:    51.5074,
  longitude:   -0.1278,
  timezone:    'Europe/London',
  displayName: 'London, England, United Kingdom',
  isPinned:    true,
};

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [activeLocation, setActiveLocationState] = useState(() =>
    storageGet('activeLocation', DEFAULT_LOCATION)
  );

  const [savedLocations, setSavedLocations] = useState(() =>
    storageGet('savedLocations', [DEFAULT_LOCATION])
  );

  const [recentLocations, setRecentLocations] = useState(() =>
    storageGet('recentLocations', [])
  );

  const setActiveLocation = useCallback((location) => {
    setActiveLocationState(location);
    storageSet('activeLocation', location);

    // Add to recents (avoid duplicates)
    setRecentLocations(prev => {
      const filtered = prev.filter(l => l.id !== location.id).slice(0, 9);
      const next = [location, ...filtered];
      storageSet('recentLocations', next);
      return next;
    });
  }, []);

  const saveLocation = useCallback((location) => {
    setSavedLocations(prev => {
      if (prev.find(l => l.id === location.id)) return prev;
      const next = [...prev, location];
      storageSet('savedLocations', next);
      return next;
    });
  }, []);

  const removeLocation = useCallback((locationId) => {
    setSavedLocations(prev => {
      const next = prev.filter(l => l.id !== locationId);
      storageSet('savedLocations', next);
      return next;
    });
  }, []);

  const pinLocation = useCallback((locationId) => {
    setSavedLocations(prev => {
      const next = prev.map(l => ({ ...l, isPinned: l.id === locationId }));
      storageSet('savedLocations', next);
      return next;
    });
  }, []);

  const clearRecents = useCallback(() => {
    setRecentLocations([]);
    storageSet('recentLocations', []);
  }, []);

  return (
    <LocationContext.Provider value={{
      activeLocation,
      savedLocations,
      recentLocations,
      setActiveLocation,
      saveLocation,
      removeLocation,
      pinLocation,
      clearRecents,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within LocationProvider');
  return ctx;
}
