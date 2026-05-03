import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    coords: null,
  });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ loading: false, error: 'Geolocation is not supported', coords: null });
      return;
    }

    setState({ loading: true, error: null, coords: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          coords: {
            latitude:  position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy:  position.coords.accuracy,
          },
        });
      },
      (err) => {
        setState({
          loading: false,
          error: err.message || 'Location access denied',
          coords: null,
        });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { ...state, request };
}
