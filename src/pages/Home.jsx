import { motion } from 'framer-motion';
import AtmosphericCore from '../components/atmospheric/AtmosphericCore';
import { MetadataStrip, StatusBadge } from '../components/ui/MetadataStrip';
import GlassPanel from '../components/ui/GlassPanel';
import { LoadingState, ErrorState } from '../components/ui/LoadingState';
import { useWeather } from '../contexts/WeatherContext';
import { useSettings } from '../contexts/SettingsContext';
import { useLocation } from '../contexts/LocationContext';
import { useTime } from '../hooks/useTime';
import {
  windDegToCompass, getTempComfort, getBeaufortDescription,
  getUVLabel,
} from '../utils/weatherUtils';
import {
  formatWind, formatPressure, formatHumidity,
  formatVisibility, formatTemp,
} from '../utils/formatUtils';
import { WeatherIcon } from '../components/forecast/WeatherIcon';

export default function Home() {
  const { weather, loading, error, refresh, condition, timeOfDay } = useWeather();
  const { settings } = useSettings();
  const { activeLocation } = useLocation();
  const { formatTime, formatDate } = useTime(weather?.timezone ?? activeLocation?.timezone);

  if (!weather && loading) return <LoadingState message="Reading the atmosphere…" />;
  if (!weather && error)   return <ErrorState message={error} onRetry={refresh} />;
  if (!weather) return <LoadingState message="Reading the atmosphere…" />;

  const cur = weather?.current;
  const u   = settings?.temperatureUnit ?? 'C';

  // Build metadata items
  const metaItems = [
    { label: 'Wind',     value: formatWind(cur?.windSpeed, settings?.windUnit) },
    { label: 'Dir',      value: windDegToCompass(cur?.windDirection ?? 0) },
    { label: 'Humidity', value: formatHumidity(cur?.humidity) },
    { label: 'Pressure', value: formatPressure(cur?.pressure) },
    { label: 'Visibility', value: formatVisibility(cur?.visibility) },
  ];

  const today = weather?.daily?.[0];
  const uvMax = today?.uvIndexMax;

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 var(--space-16) 0' }}>

      {/* ── Hero section ── */}
      <div style={{
        padding:     'var(--space-8) var(--space-6) 0',
        maxWidth:    900,
        margin:      '0 auto',
      }}>

        {/* Location header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display:        'flex',
            alignItems:     'flex-start',
            justifyContent: 'space-between',
            flexWrap:       'wrap',
            gap:            'var(--space-4)',
            marginBottom:   'var(--space-6)',
          }}
        >
          <div>
            <div style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      'var(--text-xs)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color:         'var(--theme-text-muted)',
              marginBottom:  '0.4rem',
            }}>
              Current atmosphere
            </div>
            <h1 style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'clamp(1.4rem, 4vw, 2.2rem)',
              fontWeight:    300,
              letterSpacing: '-0.02em',
              color:         'var(--theme-text-primary)',
              lineHeight:    1.1,
            }}>
              {activeLocation?.name}
              {activeLocation?.region && (
                <span style={{ color: 'var(--theme-text-muted)', fontWeight: 300, marginLeft: '0.5rem', fontSize: '75%' }}>
                  {activeLocation.region}
                </span>
              )}
            </h1>
            <div style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      'var(--text-xs)',
              color:         'var(--theme-text-muted)',
              marginTop:     '0.4rem',
              letterSpacing: '0.04em',
            }}>
              {formatDate()} · {formatTime(settings.timeFormat)}
            </div>
          </div>

          {/* Status badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
            <StatusBadge
              label={condition?.label ?? ''}
              variant={condition?.group === 'storm' ? 'danger' : condition?.group === 'rain' ? 'cold' : 'default'}
              pulse
            />
            <StatusBadge
              label="Comfort"
              value={getTempComfort(cur?.temperature ?? 0)}
              variant={(cur?.temperature ?? 0) > 30 ? 'warm' : (cur?.temperature ?? 0) < 5 ? 'cold' : 'default'}
            />
          </div>
        </motion.div>

        {/* ── Atmospheric Core ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            display:        'flex',
            justifyContent: 'center',
            padding:        'var(--space-6) 0 var(--space-16)',
            position:       'relative',
          }}
        >
          <AtmosphericCore />
        </motion.div>

        {/* ── Ring legend ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            display:        'flex',
            justifyContent: 'center',
            gap:            'var(--space-6)',
            marginBottom:   'var(--space-8)',
            flexWrap:       'wrap',
          }}
        >
          {[
            { color: 'var(--theme-text-muted)',   label: 'Cloud cover', value: `${cur?.cloudCover ?? 0}%` },
            { color: 'var(--theme-accent)',        label: 'Wind',        value: getBeaufortDescription(cur?.windSpeed ?? 0) },
            { color: 'var(--theme-accent-cold)',   label: 'Humidity',    value: `${cur?.humidity ?? 0}%` },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width:        16,
                height:       2,
                borderRadius: 'var(--radius-full)',
                background:   item.color,
                opacity:      0.7,
              }} />
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                color:         'var(--theme-text-muted)',
                letterSpacing: '0.06em',
              }}>
                {item.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize:   'var(--text-xs)',
                color:      'var(--theme-text-secondary)',
              }}>
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Metadata strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <GlassPanel padding="md" radius="lg" style={{ marginBottom: 'var(--space-6)' }}>
            <MetadataStrip items={metaItems} />
          </GlassPanel>
        </motion.div>

        {/* ── Today's range + UV ── */}
        {today && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap:                 'var(--space-4)',
              marginBottom:        'var(--space-8)',
            }}
          >
            {[
              {
                label: 'Today\'s high',
                value: formatTemp(today.tempMax, u),
                sub:   'Max temperature',
                variant: 'warm',
              },
              {
                label: 'Today\'s low',
                value: formatTemp(today.tempMin, u),
                sub:   'Min temperature',
                variant: 'cold',
              },
              {
                label: 'UV Index',
                value: uvMax !== undefined ? `${Math.round(uvMax)}` : '—',
                sub:   uvMax !== undefined ? getUVLabel(uvMax) : '—',
                variant: uvMax > 7 ? 'warning' : 'default',
              },
              {
                label: 'Gusts',
                value: formatWind(cur?.windGusts, settings?.windUnit),
                sub:   getBeaufortDescription(cur?.windGusts ?? 0),
                variant: (cur?.windGusts ?? 0) > 60 ? 'warning' : 'default',
              },
            ].map(card => (
              <GlassPanel key={card.label} padding="md" radius="md" animate>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.6rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         'var(--theme-text-muted)',
                  marginBottom:  '0.6rem',
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--text-2xl)',
                  fontWeight:    300,
                  color:         card.variant === 'warm' ? 'var(--theme-accent-warm)'
                               : card.variant === 'cold' ? 'var(--theme-accent-cold)'
                               : card.variant === 'warning' ? 'var(--theme-warning)'
                               : 'var(--theme-text-primary)',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom:  '0.25rem',
                }}>
                  {card.value}
                </div>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      'var(--text-xs)',
                  color:         'var(--theme-text-muted)',
                  letterSpacing: '0.04em',
                }}>
                  {card.sub}
                </div>
              </GlassPanel>
            ))}
          </motion.div>
        )}

        {/* ── Hourly mini-preview ── */}
        {weather?.hourly?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <div style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      'var(--text-xs)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color:         'var(--theme-text-muted)',
              marginBottom:  'var(--space-3)',
            }}>
              Next 6 hours
            </div>
            <GlassPanel padding="none" radius="lg" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
                {weather?.hourly?.slice(0, 6).map((h, i) => {
                  const hour = new Date(h.time).getHours();
                  const label = i === 0 ? 'Now'
                    : settings?.timeFormat === '12h'
                      ? `${hour % 12 || 12}${hour < 12 ? ' AM' : ' PM'}`
                      : `${String(hour).padStart(2,'0')}:00`;
                  return (
                    <div key={h.time} style={{
                      flex:           '0 0 auto',
                      display:        'flex',
                      flexDirection:  'column',
                      alignItems:     'center',
                      gap:            '0.5rem',
                      padding:        'var(--space-4) var(--space-5)',
                      borderRight:    i < 5 ? '1px solid var(--theme-border)' : 'none',
                      minWidth:       70,
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: i === 0 ? 'var(--theme-accent)' : 'var(--theme-text-muted)' }}>
                        {label}
                      </span>
                      <WeatherIcon code={h.weatherCode} size={18} />
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--theme-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                        {formatTemp(h.temperature, u)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
