import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../../contexts/WeatherContext';
import { useLocation as useLocationCtx } from '../../contexts/LocationContext';

const NAV_ITEMS = [
  { path: '/',          label: 'Atmosphere', icon: <CircleIcon /> },
  { path: '/forecast',  label: 'Forecast',   icon: <TimelineIcon /> },
  { path: '/locations', label: 'Locations',  icon: <PinIcon /> },
  { path: '/settings',  label: 'Settings',   icon: <TuneIcon /> },
  { path: '/about',     label: 'About',      icon: <InfoIcon /> },
];

export default function SidebarNav() {
  const loc      = useLocation();
  const { weather } = useWeather();
  const { activeLocation } = useLocationCtx();

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position:   'fixed',
        left:       0,
        top:        0,
        bottom:     0,
        width:      'var(--sidebar-width)',
        zIndex:     'var(--z-drawer)',
        display:    'flex',
        flexDirection: 'column',
        background: 'var(--theme-bg-secondary)',
        borderRight: '1px solid var(--theme-border)',
        padding:    'var(--space-6) 0',
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        padding:      '0 var(--space-6)',
        marginBottom: 'var(--space-8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LogoMark size={28} />
          <div>
            <div style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'var(--text-lg)',
              fontWeight:    300,
              color:         'var(--theme-text-primary)',
              letterSpacing: '0.08em',
              lineHeight:    1,
            }}>
              AETHER
            </div>
            <div style={{
              fontFamily:    'var(--font-mono)',
              fontSize:      '0.55rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'var(--theme-text-muted)',
              marginTop:     2,
            }}>
              Atmospheric
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav items ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 var(--space-3)' }}>
        {NAV_ITEMS.map(item => {
          const active = item.path === '/'
            ? loc.pathname === '/'
            : loc.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: 'none' }}
            >
              <motion.div
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                style={{
                  display:      'flex',
                  alignItems:   'center',
                  gap:          '0.75rem',
                  padding:      '0.7rem var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  background:   active ? 'var(--theme-panel)' : 'transparent',
                  border:       `1px solid ${active ? 'var(--theme-border)' : 'transparent'}`,
                  position:     'relative',
                  cursor:       'pointer',
                  transition:   'background 200ms, border-color 200ms',
                }}
              >
                {/* Active indicator bar */}
                {active && (
                  <motion.div
                    layoutId="activeBar"
                    style={{
                      position:     'absolute',
                      left:         0,
                      top:          '20%',
                      bottom:       '20%',
                      width:        2,
                      borderRadius: 'var(--radius-full)',
                      background:   'var(--theme-accent)',
                      boxShadow:    '0 0 8px var(--theme-glow)',
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                {/* Icon */}
                <span style={{
                  color:      active ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
                  display:    'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                  transition: 'color 200ms',
                }}>
                  {item.icon}
                </span>

                {/* Label */}
                <span style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--text-sm)',
                  fontWeight:    active ? 500 : 400,
                  color:         active ? 'var(--theme-text-primary)' : 'var(--theme-text-secondary)',
                  letterSpacing: '0.01em',
                  transition:    'color 200ms',
                }}>
                  {item.label}
                </span>
              </motion.div>
            </NavLink>
          );
        })}
      </div>

      {/* ── Location + temp footer ── */}
      <div style={{
        padding:   'var(--space-4) var(--space-6)',
        borderTop: '1px solid var(--theme-border)',
        marginTop: 'auto',
      }}>
        <div style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:         'var(--theme-text-muted)',
          marginBottom:  '0.4rem',
        }}>
          Current location
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize:   'var(--text-sm)',
          color:      'var(--theme-text-secondary)',
          overflow:   'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {activeLocation?.name ?? '—'}
        </div>
        {weather && (
          <div style={{
            fontFamily:         'var(--font-mono)',
            fontSize:           'var(--text-lg)',
            color:              'var(--theme-text-primary)',
            fontWeight:         300,
            fontVariantNumeric: 'tabular-nums',
            marginTop:          '0.25rem',
          }}>
            {Math.round(weather?.current?.temperature ?? 0)}°
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Icon components ──────────────────────────────────────────────
function CircleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="1"   fill="currentColor" />
    </svg>
  );
}
function TimelineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 8h12M2 4.5h5M2 11.5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6.5" r="3" stroke="currentColor" strokeWidth="1" />
      <path d="M8 14 C8 14 4 10 4 6.5a4 4 0 018 0C12 10 8 14 8 14z" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
function TuneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4v2M11 4v2M2 8h12M4 8v2M10 8v2M2 12h12M7 12v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="var(--theme-border)" strokeWidth="1" />
      <circle cx="12" cy="12" r="6.5" stroke="var(--theme-accent)" strokeWidth="0.8" opacity="0.7" />
      <circle cx="12" cy="12" r="3"   stroke="var(--theme-accent-cold)" strokeWidth="0.8" opacity="0.9" />
      <circle cx="12" cy="12" r="1.2" fill="var(--theme-accent)" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" stroke="var(--theme-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
