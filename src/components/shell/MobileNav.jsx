import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/',          label: 'Atmos',    icon: <CircleIcon /> },
  { path: '/forecast',  label: 'Forecast', icon: <TimelineIcon /> },
  { path: '/locations', label: 'Places',   icon: <PinIcon /> },
  { path: '/settings',  label: 'Settings', icon: <TuneIcon /> },
  { path: '/about',     label: 'About',    icon: <InfoIcon /> },
];

export default function MobileNav() {
  const loc = useLocation();

  return (
    <nav
      aria-label="Mobile navigation"
      style={{
        position:       'fixed',
        bottom:         0,
        left:           0,
        right:          0,
        height:         'var(--mobile-nav-height)',
        zIndex:         'var(--z-drawer)',
        background:     'var(--theme-bg-secondary)',
        borderTop:      '1px solid var(--theme-border)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display:        'flex',
        alignItems:     'stretch',
      }}
    >
      {NAV_ITEMS.map(item => {
        const active = item.path === '/'
          ? loc.pathname === '/'
          : loc.pathname.startsWith(item.path);

        return (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ flex: 1, textDecoration: 'none' }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              style={{
                height:         '100%',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '0.25rem',
                position:       'relative',
              }}
            >
              {active && (
                <motion.div
                  layoutId="mobileActiveBar"
                  style={{
                    position:     'absolute',
                    top:          0,
                    left:         '20%',
                    right:        '20%',
                    height:       1.5,
                    borderRadius: 'var(--radius-full)',
                    background:   'var(--theme-accent)',
                    boxShadow:    '0 0 8px var(--theme-glow)',
                  }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span style={{
                color:      active ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
                display:    'flex',
                alignItems: 'center',
                transition: 'color 200ms',
              }}>
                {item.icon}
              </span>
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.58rem',
                letterSpacing: '0.08em',
                color:         active ? 'var(--theme-accent)' : 'var(--theme-text-muted)',
                transition:    'color 200ms',
              }}>
                {item.label}
              </span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}

function CircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1" />
      <circle cx="8" cy="8" r="1"   fill="currentColor" />
    </svg>
  );
}
function TimelineIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M2 8h12M2 4.5h5M2 11.5h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6.5" r="3" stroke="currentColor" strokeWidth="1" />
      <path d="M8 14 C8 14 4 10 4 6.5a4 4 0 018 0C12 10 8 14 8 14z" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}
function TuneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M2 4h12M5 4v2M11 4v2M2 8h12M4 8v2M10 8v2M2 12h12M7 12v2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
      <path d="M8 7v5M8 5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
