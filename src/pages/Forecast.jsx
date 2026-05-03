import { useState } from 'react';
import { motion } from 'framer-motion';
import HourlyTimeline from '../components/forecast/HourlyTimeline';
import DailyForecast  from '../components/forecast/DailyForecast';
import GlassPanel     from '../components/ui/GlassPanel';
import { LoadingState, ErrorState } from '../components/ui/LoadingState';
import { useWeather }   from '../contexts/WeatherContext';
import { useSettings }  from '../contexts/SettingsContext';
import { useLocation }  from '../contexts/LocationContext';
import { useTime }      from '../hooks/useTime';
import { formatTemp }   from '../utils/formatUtils';
import { WeatherIcon }  from '../components/forecast/WeatherIcon';
import { getCondition } from '../utils/weatherUtils';

export default function Forecast() {
  const { weather, loading, error, refresh } = useWeather();
  const { settings }       = useSettings();
  const { activeLocation } = useLocation();
  const { formatDate }     = useTime(weather?.timezone ?? activeLocation?.timezone);
  const [view, setView]    = useState('hourly'); // 'hourly' | 'daily'

  if (!weather && loading) return <LoadingState message="Calculating forecast horizon…" />;
  if (!weather && error)   return <ErrorState message={error} onRetry={refresh} />;
  if (!weather) return <LoadingState message="Calculating forecast horizon…" />;

  const u = settings.temperatureUnit;

  // Temperature sparkline data for hourly
  const hourlyTemps  = weather?.hourly?.slice(0, 24).map(h => h.temperature) ?? [];
  const minTemp      = hourlyTemps.length ? Math.min(...hourlyTemps) : 0;
  const maxTemp      = hourlyTemps.length ? Math.max(...hourlyTemps) : 0;
  const tempRange    = maxTemp - minTemp || 1;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         'var(--theme-text-muted)',
            marginBottom:  '0.4rem',
          }}>
            Forecast horizon
          </p>
          <h1 style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight:    300,
            letterSpacing: '-0.02em',
            color:         'var(--theme-text-primary)',
          }}>
            {activeLocation?.name}
          </h1>
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            color:         'var(--theme-text-muted)',
            marginTop:     '0.4rem',
          }}>
            {formatDate()}
          </p>
        </motion.div>

        {/* ── View toggle ── */}
        <div style={{
          display:       'flex',
          gap:           2,
          marginBottom:  'var(--space-6)',
          background:    'var(--theme-bg-secondary)',
          borderRadius:  'var(--radius-md)',
          border:        '1px solid var(--theme-border)',
          padding:       3,
          width:         'fit-content',
        }}>
          {[
            { id: 'hourly', label: 'Hourly' },
            { id: 'daily',  label: '7-Day' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                padding:      '0.45rem 1.4rem',
                borderRadius: 'var(--radius-sm)',
                border:       'none',
                background:   view === tab.id ? 'var(--theme-panel-strong)' : 'transparent',
                color:        view === tab.id ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                fontFamily:   'var(--font-mono)',
                fontSize:     'var(--text-xs)',
                letterSpacing: '0.08em',
                cursor:       'pointer',
                transition:   'all 180ms',
                boxShadow:    view === tab.id ? 'inset 0 0 0 1px var(--theme-border)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Hourly view ── */}
        {view === 'hourly' && (
          <motion.div
            key="hourly"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.4 }}
          >
            {/* Temperature sparkline */}
            <GlassPanel padding="none" radius="lg" style={{ overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--theme-border)' }}>
                <span style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      'var(--text-xs)',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         'var(--theme-text-muted)',
                }}>
                  Temperature · next 24 hours
                </span>
              </div>

              {/* SVG sparkline */}
              <div style={{ padding: 'var(--space-3) var(--space-5) var(--space-2)' }}>
                <svg
                  viewBox="0 0 600 60"
                  style={{ width: '100%', height: 60, overflow: 'visible' }}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="var(--theme-accent)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--theme-accent)" stopOpacity="0"   />
                    </linearGradient>
                  </defs>
                  {/* Area fill */}
                  <path
                    d={[
                      hourlyTemps.map((t, i) => {
                        const x = (i / (hourlyTemps.length - 1)) * 600;
                        const y = 55 - ((t - minTemp) / tempRange) * 48;
                        return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                      }).join(' '),
                      `L600,60 L0,60 Z`,
                    ].join(' ')}
                    fill="url(#sparkGrad)"
                  />
                  {/* Line */}
                  <polyline
                    points={hourlyTemps.map((t, i) => {
                      const x = (i / (hourlyTemps.length - 1)) * 600;
                      const y = 55 - ((t - minTemp) / tempRange) * 48;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="var(--theme-accent)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                  />
                </svg>
              </div>

              {/* Hourly timeline */}
              <HourlyTimeline />
            </GlassPanel>

            {/* Extended hourly detail — next 12 hours in cards */}
            <div style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap:                 'var(--space-3)',
              marginTop:           'var(--space-6)',
            }}>
              {weather?.hourly?.slice(0, 12).map((h, i) => {
                const cond  = getCondition(h.weatherCode);
                const hour  = new Date(h.time).getHours();
                const label = i === 0 ? 'Now'
                  : settings.timeFormat === '12h'
                    ? `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'}`
                    : `${String(hour).padStart(2, '0')}:00`;

                return (
                  <motion.div
                    key={h.time}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.4 }}
                  >
                    <GlassPanel padding="sm" radius="md" style={{
                      display:        'flex',
                      flexDirection:  'column',
                      alignItems:     'center',
                      gap:            '0.5rem',
                      textAlign:      'center',
                      paddingTop:     16, paddingBottom: 16,
                    }}>
                      <span style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '0.62rem',
                        color:         i === 0 ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
                        letterSpacing: '0.08em',
                      }}>
                        {label}
                      </span>
                      <WeatherIcon code={h.weatherCode} size={22} />
                      <span style={{
                        fontFamily:    'var(--font-sans)',
                        fontSize:      'var(--text-lg)',
                        fontWeight:    300,
                        color:         'var(--theme-text-primary)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {formatTemp(h.temperature, u)}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize:   '0.62rem',
                        color:      h.precipitationChance > 30
                          ? 'var(--theme-accent-cold)'
                          : 'var(--theme-text-muted)',
                      }}>
                        {h.precipitationChance ?? 0}%
                      </span>
                      <span style={{
                        fontFamily:    'var(--font-mono)',
                        fontSize:      '0.58rem',
                        color:         'var(--theme-text-muted)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}>
                        {cond.label.slice(0, 12)}
                      </span>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Daily view ── */}
        {view === 'daily' && (
          <motion.div
            key="daily"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4 }}
          >
            <GlassPanel padding="none" radius="lg" style={{ overflow: 'hidden' }}>
              <div style={{
                display:             'grid',
                gridTemplateColumns: '80px 1fr 80px',
                padding:             'var(--space-3) var(--space-5)',
                borderBottom:        '1px solid var(--theme-border)',
              }}>
                {['Day', 'Temperature range', 'Rain'].map(h => (
                  <span key={h} style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.6rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color:         'var(--theme-text-muted)',
                  }}>
                    {h}
                  </span>
                ))}
              </div>
              <DailyForecast />
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
