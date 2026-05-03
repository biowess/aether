import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../../contexts/WeatherContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getCondition } from '../../utils/weatherUtils';
import { formatTempValue, formatHour, formatPrecipChance } from '../../utils/formatUtils';
import { WeatherIcon } from './WeatherIcon';

export default function HourlyTimeline() {
  const { weather } = useWeather();
  const { settings } = useSettings();
  const scrollRef = useRef(null);

  // Desktop: redirect vertical wheel events to horizontal scroll.
  // Uses { passive: false } so we can call preventDefault() and stop
  // the page from scrolling vertically while the pointer is over the timeline.
  const handleWheel = useCallback((e) => {
    const el = scrollRef.current;
    if (!el) return;

    // If the user is already scrolling horizontally (trackpad swipe), let it pass through.
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    const atStart = el.scrollLeft === 0 && e.deltaY < 0;
    const atEnd   = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 && e.deltaY > 0;

    // Only block page scroll when we can actually scroll inside the timeline.
    if (!atStart && !atEnd) {
      e.preventDefault();
    }

    el.scrollLeft += e.deltaY;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  if (!weather?.hourly?.length) return null;

  const hours = weather?.hourly?.slice(0, 24) ?? [];

  return (
    <div style={{ position: 'relative' }}>
      {/* Scroll fade edges */}
      <div style={{
        position:   'absolute',
        left:       0, top: 0, bottom: 0,
        width:      40,
        background: 'linear-gradient(to right, var(--theme-bg-primary), transparent)',
        zIndex:     2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position:   'absolute',
        right:      0, top: 0, bottom: 0,
        width:      40,
        background: 'linear-gradient(to left, var(--theme-bg-primary), transparent)',
        zIndex:     2,
        pointerEvents: 'none',
      }} />

      <div
        ref={scrollRef}
        style={{
          display:     'flex',
          overflowX:   'auto',
          gap:         '0',
          padding:     '0 var(--space-2)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {hours.map((hour, i) => {
          const cond    = getCondition(hour.weatherCode);
          const temp    = formatTempValue(hour.temperature, settings.temperatureUnit);
          const timeStr = formatHour(hour.time, settings.timeFormat);
          const rain    = hour.precipitationChance ?? 0;
          const isFirst = i === 0;

          return (
            <motion.div
              key={hour.time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.4 }}
              style={{
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                gap:            '0.6rem',
                padding:        'var(--space-4) var(--space-4)',
                minWidth:       72,
                position:       'relative',
                borderRight:    i < hours.length - 1 ? '1px solid var(--theme-border)' : 'none',
                background:     isFirst
                  ? 'linear-gradient(180deg, var(--theme-panel) 0%, transparent 100%)'
                  : 'transparent',
                borderRadius:   isFirst ? 'var(--radius-md) 0 0 var(--radius-md)' : 0,
              }}
            >
              {/* Time */}
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                letterSpacing: '0.06em',
                color:         isFirst ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
              }}>
                {isFirst ? 'Now' : timeStr}
              </span>

              {/* Icon */}
              <WeatherIcon code={hour.weatherCode} size={20} />

              {/* Temperature */}
              <span style={{
                fontFamily:    'var(--font-sans)',
                fontSize:      'var(--text-base)',
                fontWeight:    isFirst ? 500 : 400,
                color:         isFirst ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {temp}°
              </span>

              {/* Precipitation */}
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.62rem',
                letterSpacing: '0.04em',
                color:         rain > 30
                  ? 'var(--theme-accent-cold)'
                  : 'var(--theme-text-muted)',
                opacity:       rain < 10 ? 0.4 : 1,
              }}>
                {rain}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
