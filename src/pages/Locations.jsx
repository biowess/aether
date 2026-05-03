import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../components/location/LocationSearch';
import SavedLocations from '../components/location/SavedLocations';
import GlassPanel     from '../components/ui/GlassPanel';
import { SectionHeader } from '../components/ui/MetadataStrip';
import { useLocation }   from '../contexts/LocationContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { reverseGeocode } from '../services/geocodingService';

export default function Locations() {
  const navigate = useNavigate();
  const { activeLocation, recentLocations, setActiveLocation, clearRecents } = useLocation();
  const geo = useGeolocation();
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError,   setGeoError]   = useState(null);

  const handleSelect = (loc) => {
    setActiveLocation(loc);
    setTimeout(() => navigate('/'), 300);
  };

  const handleGeolocate = async () => {
    setGeoLoading(true);
    setGeoError(null);
    geo.request();

    // Poll for result (simple approach)
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const loc = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
              loc.id = `geo_${Date.now()}`;
              setActiveLocation(loc);
              setTimeout(() => navigate('/'), 300);
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          (err) => reject(new Error(err.message)),
          { timeout: 10000 }
        );
      });
    } catch (err) {
      setGeoError(err.message || 'Location access denied');
    } finally {
      setGeoLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-16)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>

        {/* ── Header ── */}
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
            Persistent location
          </p>
          <h1 style={{
            fontFamily:    'var(--font-sans)',
            fontSize:      'clamp(1.4rem, 4vw, 2.2rem)',
            fontWeight:    300,
            letterSpacing: '-0.02em',
            color:         'var(--theme-text-primary)',
          }}>
            Locations
          </h1>
        </motion.div>

        {/* ── Search ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ marginBottom: 'var(--space-6)' }}
        >
          <LocationSearch onSelect={handleSelect} />
        </motion.div>

        {/* ── Geolocation ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <button
            onClick={handleGeolocate}
            disabled={geoLoading}
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          'var(--space-3)',
              padding:      '0.75rem var(--space-5)',
              background:   'var(--theme-panel)',
              border:       '1px solid var(--theme-border)',
              borderRadius: 'var(--radius-md)',
              color:        geoLoading ? 'var(--theme-text-muted)' : 'var(--theme-text-secondary)',
              fontFamily:   'var(--font-sans)',
              fontSize:     'var(--text-sm)',
              cursor:       geoLoading ? 'not-allowed' : 'pointer',
              transition:   'all 200ms',
              width:        '100%',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={e => !geoLoading && (e.currentTarget.style.borderColor = 'var(--theme-accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--theme-border)')}
          >
            <span style={{ fontSize: 16 }}>◎</span>
            {geoLoading ? 'Locating…' : 'Use current location'}
          </button>
          {geoError && (
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize:   'var(--text-xs)',
              color:      'var(--theme-danger)',
              marginTop:  '0.5rem',
              padding:    '0 var(--space-2)',
            }}>
              {geoError}
            </p>
          )}
        </motion.div>

        {/* ── Saved locations ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <SectionHeader
            label="Saved"
            title="Your locations"
          />
          <GlassPanel padding="none" radius="lg" style={{ overflow: 'hidden' }}>
            <SavedLocations onSelect={handleSelect} />
          </GlassPanel>
        </motion.div>

        {/* ── Recent locations ── */}
        {recentLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SectionHeader
              label="History"
              title="Recent searches"
              action={{ label: 'Clear', onClick: clearRecents }}
            />
            <GlassPanel padding="none" radius="lg" style={{ overflow: 'hidden' }}>
              {recentLocations.slice(0, 5).map((loc, i) => (
                <div
                  key={loc.id ?? i}
                  onClick={() => handleSelect(loc)}
                  style={{
                    padding:       'var(--space-4) var(--space-5)',
                    borderBottom:  i < Math.min(recentLocations.length, 5) - 1
                      ? '1px solid var(--theme-border)' : 'none',
                    cursor:        'pointer',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           'var(--space-3)',
                    transition:    'background 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--theme-panel)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--theme-text-muted)', flexShrink: 0, opacity: 0.5 }}>
                    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8 5v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  </svg>
                  <div>
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize:   'var(--text-sm)',
                      color:      'var(--theme-text-secondary)',
                    }}>
                      {loc.name}
                      {loc.region && (
                        <span style={{ color: 'var(--theme-text-muted)', marginLeft: '0.4rem', fontSize: 'var(--text-xs)' }}>
                          {loc.region}
                        </span>
                      )}
                    </span>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize:   '0.6rem',
                      color:      'var(--theme-text-muted)',
                      marginTop:  '0.15rem',
                    }}>
                      {loc.country}
                    </div>
                  </div>
                </div>
              ))}
            </GlassPanel>
          </motion.div>
        )}

        {/* ── Active location details ── */}
        {activeLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginTop: 'var(--space-8)' }}
          >
            <SectionHeader label="Active" title="Current location" />
            <GlassPanel padding="md" radius="lg">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
                {[
                  { label: 'City',      value: activeLocation.name },
                  { label: 'Region',    value: activeLocation.region || '—' },
                  { label: 'Country',   value: activeLocation.country || '—' },
                  { label: 'Latitude',  value: `${activeLocation.latitude?.toFixed(4)}°` },
                  { label: 'Longitude', value: `${activeLocation.longitude?.toFixed(4)}°` },
                  { label: 'Timezone',  value: activeLocation.timezone || 'auto' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{
                      fontFamily:    'var(--font-mono)',
                      fontSize:      '0.58rem',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color:         'var(--theme-text-muted)',
                      marginBottom:  '0.3rem',
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize:   'var(--text-sm)',
                      color:      'var(--theme-text-secondary)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        )}
      </div>
    </div>
  );
}
