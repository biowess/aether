import { useState, useEffect } from 'react';

/**
 * Returns the current time, updated every second.
 * Respects the provided timezone.
 */
export function useTime(timezone) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (format = '24h') => {
    try {
      if (format === '12h') {
        return now.toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
      }
      return now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: format === '12h',
      });
    }
  };

  const formatDate = () => {
    try {
      return now.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
  };

  const getHour = () => {
    try {
      return parseInt(now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        hour12: false,
      }));
    } catch {
      return now.getHours();
    }
  };

  return { now, formatTime, formatDate, getHour };
}
