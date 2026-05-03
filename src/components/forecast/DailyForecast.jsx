import { motion } from 'framer-motion';
import { useWeather } from '../../contexts/WeatherContext';
import { useSettings } from '../../contexts/SettingsContext';
import { getCondition } from '../../utils/weatherUtils';
import { formatTempValue, formatDay, formatPrecipChance } from '../../utils/formatUtils';
import { WeatherIcon } from './WeatherIcon';

export default function DailyForecast() {
  const { weather } = useWeather();
  const { settings } = useSettings();

  if (!weather?.daily?.length) return null;

  const days    = weather?.daily ?? [];
  const allMaxes = days.map(d => d.tempMax);
  const allMins  = days.map(d => d.tempMin);
  const absMax   = allMaxes.length ? Math.max(...allMaxes) : 0;
  const absMin   = allMins.length ? Math.min(...allMins) : 0;
  const absRange = absMax - absMin || 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {days.map((day, i) => {
        const cond       = getCondition(day.weatherCode);
        const tempMax    = formatTempValue(day.tempMax, settings.temperatureUnit);
        const tempMin    = formatTempValue(day.tempMin, settings.temperatureUnit);
        const dayLabel   = formatDay(day.date);
        const rainChance = day.precipitationChance ?? 0;

        // Bar width for temp range
        const barLeft  = ((day.tempMin - absMin) / absRange) * 60;
        const barWidth = ((day.tempMax - day.tempMin) / absRange) * 60;

        return (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.45 }}
            style={{
              display:       'grid',
              gridTemplateColumns: '80px 1fr auto',
              alignItems:    'center',
              gap:           'var(--space-4)',
              padding:       'var(--space-4) var(--space-5)',
              borderBottom:  i < days.length - 1 ? '1px solid var(--theme-border)' : 'none',
              transition:    'background 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-panel)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Day + icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <WeatherIcon code={day.weatherCode} size={18} />
              <span style={{
                fontFamily:  'var(--font-sans)',
                fontSize:    'var(--text-sm)',
                fontWeight:  i === 0 ? 500 : 400,
                color:       i === 0 ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
              }}>
                {dayLabel}
              </span>
            </div>

            {/* Temp range bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                color:         'var(--theme-text-muted)',
                width:         28,
                textAlign:     'right',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {tempMin}°
              </span>

              <div style={{
                flex:         1,
                height:       3,
                borderRadius: 'var(--radius-full)',
                background:   'var(--theme-bg-tertiary)',
                position:     'relative',
                overflow:     'visible',
              }}>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position:      'absolute',
                    left:          `${barLeft}%`,
                    width:         `${Math.max(barWidth, 5)}%`,
                    height:        '100%',
                    borderRadius:  'var(--radius-full)',
                    background:    `linear-gradient(to right,
                      var(--theme-accent-cold),
                      var(--theme-accent),
                      var(--theme-accent-warm)
                    )`,
                    transformOrigin: 'left',
                  }}
                />
              </div>

              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                color:         'var(--theme-text-secondary)',
                width:         28,
                fontVariantNumeric: 'tabular-nums',
              }}>
                {tempMax}°
              </span>
            </div>

            {/* Rain chance + condition */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem', minWidth: 60 }}>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                color:         rainChance > 30 ? 'var(--theme-accent-cold)' : 'var(--theme-text-muted)',
                letterSpacing: '0.04em',
              }}>
                {rainChance}%
              </span>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.62rem',
                color:         'var(--theme-text-muted)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textAlign:     'right',
              }}>
                {cond.label.slice(0, 12)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
