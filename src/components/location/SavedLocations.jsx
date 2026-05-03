import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from '../../contexts/LocationContext';
import { formatCoords } from '../../utils/formatUtils';

export default function SavedLocations({ onSelect }) {
  const {
    savedLocations, activeLocation,
    removeLocation, pinLocation,
    setActiveLocation,
  } = useLocation();

  const handleSelect = (loc) => {
    setActiveLocation(loc);
    onSelect?.(loc);
  };

  if (!savedLocations.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <AnimatePresence>
        {savedLocations.map((loc, i) => {
          const isActive = loc.id === activeLocation?.id;
          return (
            <motion.div
              key={loc.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              style={{
                display:       'flex',
                alignItems:    'center',
                gap:           'var(--space-4)',
                padding:       'var(--space-4) var(--space-5)',
                borderRadius:  'var(--radius-md)',
                background:    isActive ? 'var(--theme-panel)' : 'transparent',
                border:        `1px solid ${isActive ? 'var(--theme-border)' : 'transparent'}`,
                cursor:        'pointer',
                transition:    'all 200ms',
              }}
              onClick={() => handleSelect(loc)}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--theme-panel)';
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeLoc"
                  style={{
                    width:        3,
                    height:       32,
                    borderRadius: 'var(--radius-full)',
                    background:   'var(--theme-accent)',
                    boxShadow:    '0 0 8px var(--theme-glow)',
                    flexShrink:   0,
                  }}
                />
              )}

              {/* Pin icon */}
              {loc.isPinned && (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--theme-accent)', flexShrink: 0 }}>
                  <path d="M8 1a4 4 0 014 4c0 3.5-4 9-4 9S4 8.5 4 5a4 4 0 014-4z" stroke="currentColor" strokeWidth="1.3" fill="currentColor" fillOpacity="0.3" />
                  <circle cx="8" cy="5.5" r="1.5" fill="currentColor" />
                </svg>
              )}

              {/* Location info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily:   'var(--font-sans)',
                  fontSize:     'var(--text-sm)',
                  fontWeight:   isActive ? 500 : 400,
                  color:        isActive ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
                  overflow:     'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace:   'nowrap',
                  marginBottom: '0.2rem',
                }}>
                  {loc.name}
                  {loc.region && (
                    <span style={{ color: 'var(--theme-text-muted)', fontWeight: 400, marginLeft: '0.4rem', fontSize: 'var(--text-xs)' }}>
                      {loc.region}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.6rem',
                  color:         'var(--theme-text-muted)',
                  letterSpacing: '0.06em',
                }}>
                  {loc.country} · {loc.latitude?.toFixed(2)}°, {loc.longitude?.toFixed(2)}°
                </div>
              </div>

              {/* Actions */}
              <div
                style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => pinLocation(loc.id)}
                  title="Set as default"
                  aria-label="Set as default location"
                  style={actionBtnStyle(loc.isPinned)}
                >
                  ⊙
                </button>
                <button
                  onClick={() => removeLocation(loc.id)}
                  title="Remove"
                  aria-label="Remove location"
                  style={actionBtnStyle(false, true)}
                >
                  ×
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function actionBtnStyle(active, danger = false) {
  return {
    background:   'transparent',
    border:       `1px solid var(--theme-border)`,
    borderRadius: 'var(--radius-sm)',
    width:        28,
    height:       28,
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    cursor:       'pointer',
    color:        active
      ? 'var(--theme-accent)'
      : danger ? 'var(--theme-danger)' : 'var(--theme-text-muted)',
    fontSize:     '14px',
    lineHeight:   1,
    transition:   'all 150ms',
  };
}
