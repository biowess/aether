import { motion } from 'framer-motion';
import {
  SettingsSection, ToggleRow, SegmentedControl,
  RangeSlider, ChoiceRow,
} from '../components/settings/SettingsSection';
import { useSettings } from '../contexts/SettingsContext';

export default function Settings() {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 'var(--space-10)' }}
        >
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color:         'var(--theme-text-muted)',
            marginBottom:  '0.4rem',
          }}>
            Instrument calibration
          </p>
          <h1 style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight:    300,
            letterSpacing: '-0.02em',
            color:         'var(--theme-text-primary)',
          }}>
            Settings
          </h1>
        </motion.div>

        {/* ── Units ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <SettingsSection title="Measurement units" description="Control how temperature, wind speed, and time are displayed throughout the interface.">
            <SegmentedControl
              label="Temperature"
              value={settings.temperatureUnit}
              onChange={v => updateSetting('temperatureUnit', v)}
              options={[
                { label: '°C Celsius',    value: 'C' },
                { label: '°F Fahrenheit', value: 'F' },
              ]}
            />
            <SegmentedControl
              label="Wind speed"
              value={settings.windUnit}
              onChange={v => updateSetting('windUnit', v)}
              options={[
                { label: 'km/h', value: 'km/h' },
                { label: 'mph',  value: 'mph'  },
                { label: 'm/s',  value: 'm/s'  },
              ]}
            />
            <SegmentedControl
              label="Time format"
              value={settings.timeFormat}
              onChange={v => updateSetting('timeFormat', v)}
              options={[
                { label: '24-hour', value: '24h' },
                { label: '12-hour', value: '12h' },
              ]}
            />
          </SettingsSection>
        </motion.div>

        {/* ── Appearance ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }}>
          <SettingsSection title="Appearance" description="Adjust the visual character of the interface. Aether adapts its palette to the atmosphere — these settings define the intensity.">
            <SegmentedControl
              label="Color scheme"
              value={settings.colorScheme}
              onChange={v => updateSetting('colorScheme', v)}
              options={[
                { label: 'Dark',   value: 'dark'   },
                { label: 'Light',  value: 'light'  },
                { label: 'System', value: 'system' },
              ]}
            />
            <ToggleRow
              label="Compact mode"
              description="Reduce padding and spacing for denser information display."
              value={settings.compactMode}
              onChange={v => updateSetting('compactMode', v)}
            />
            <RangeSlider
              label="Background intensity"
              description="Controls the brightness of the atmospheric sky gradient."
              value={settings.backgroundIntensity}
              onChange={v => updateSetting('backgroundIntensity', v)}
              min={20} max={100} step={5} unit="%"
            />
            <RangeSlider
              label="Glow intensity"
              description="Controls the strength of accent glows on the atmospheric core and UI elements."
              value={settings.glowIntensity}
              onChange={v => updateSetting('glowIntensity', v)}
              min={0} max={100} step={5} unit="%"
            />
          </SettingsSection>
        </motion.div>

        {/* ── Motion & performance ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <SettingsSection title="Motion & performance" description="Aether uses continuous ambient motion to reflect the atmosphere. Reduce these settings to conserve battery or improve performance on lower-end devices.">
            <SegmentedControl
              label="Motion intensity"
              value={settings.motionIntensity}
              onChange={v => updateSetting('motionIntensity', v)}
              options={[
                { label: 'Full',    value: 'full'    },
                { label: 'Reduced', value: 'reduced' },
                { label: 'Minimal', value: 'minimal' },
              ]}
            />
            <ToggleRow
              label="Atmospheric effects"
              description="Particle field, ambient weather textures, and sky animations."
              value={settings.atmosphericEffects}
              onChange={v => updateSetting('atmosphericEffects', v)}
            />
            <ChoiceRow
              label="Performance mode"
              description="Balances visual richness against CPU and battery usage."
              value={settings.performanceMode}
              onChange={v => updateSetting('performanceMode', v)}
              options={[
                { label: 'High fidelity — maximum visual detail',     value: 'high-fidelity'  },
                { label: 'Balanced — recommended for most devices',   value: 'balanced'       },
                { label: 'Battery saver — reduced effects and polls', value: 'battery-saver'  },
                { label: 'Minimal — text-only rendering',             value: 'minimal'        },
              ]}
            />
          </SettingsSection>
        </motion.div>

        {/* ── Location & data ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }}>
          <SettingsSection title="Location & data" description="Control how Aether acquires location data and how often it refreshes atmospheric readings.">
            <ToggleRow
              label="Geolocation"
              description="Allow Aether to automatically detect your location for local weather."
              value={settings.geolocationEnabled}
              onChange={v => updateSetting('geolocationEnabled', v)}
            />
            <ChoiceRow
              label="Refresh interval"
              description="How often Aether polls Open-Meteo for updated atmospheric data."
              value={settings.refreshInterval}
              onChange={v => updateSetting('refreshInterval', Number(v))}
              options={[
                { label: 'Every 5 minutes',  value: 5   },
                { label: 'Every 10 minutes', value: 10  },
                { label: 'Every 15 minutes', value: 15  },
                { label: 'Every 30 minutes', value: 30  },
                { label: 'Every hour',       value: 60  },
              ]}
            />
            <ChoiceRow
              label="Default landing page"
              description="The page Aether opens to by default."
              value={settings.defaultPage}
              onChange={v => updateSetting('defaultPage', v)}
              options={[
                { label: 'Atmospheric overview', value: 'home'      },
                { label: 'Forecast horizon',     value: 'forecast'  },
                { label: 'Locations',            value: 'locations' },
              ]}
            />
          </SettingsSection>
        </motion.div>

        {/* ── Accessibility ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SettingsSection title="Accessibility" description="Aether aims for precision in every interaction. These options ensure the interface is readable and operable for all conditions.">
            <ToggleRow
              label="High contrast"
              description="Increase text and border contrast for improved legibility in bright environments."
              value={settings.highContrast}
              onChange={v => updateSetting('highContrast', v)}
            />
            <ToggleRow
              label="Large text"
              description="Increase base font size across the interface."
              value={settings.largeText}
              onChange={v => updateSetting('largeText', v)}
            />
          </SettingsSection>
        </motion.div>

        {/* ── Reset ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.30 }}>
          <div style={{
            textAlign:  'center',
            padding:    'var(--space-6) 0',
            borderTop:  '1px solid var(--theme-border)',
            marginTop:  'var(--space-4)',
          }}>
            <button
              onClick={resetSettings}
              style={{
                background:    'transparent',
                border:        '1px solid var(--theme-border)',
                borderRadius:  'var(--radius-md)',
                padding:       '0.65rem 1.8rem',
                color:         'var(--theme-text-muted)',
                fontFamily:    'var(--font-mono)',
                fontSize:      'var(--text-xs)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor:        'pointer',
                transition:    'all 200ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--theme-danger)';
                e.currentTarget.style.color = 'var(--theme-danger)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--theme-border)';
                e.currentTarget.style.color = 'var(--theme-text-muted)';
              }}
            >
              Reset to defaults
            </button>
            <p style={{
              fontFamily:  'var(--font-mono)',
              fontSize:    '0.58rem',
              color:       'var(--theme-text-muted)',
              marginTop:   '0.75rem',
              letterSpacing: '0.04em',
            }}>
              Restores all settings to factory defaults
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
