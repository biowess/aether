import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SidebarNav from './SidebarNav';
import MobileNav  from './MobileNav';
import AmbientBackground from '../atmospheric/AmbientBackground';
import { useSettings } from '../../contexts/SettingsContext';

const PAGE_VARIANTS = {
  initial:  { opacity: 0, y: 14 },
  animate:  { opacity: 1, y: 0  },
  exit:     { opacity: 0, y: -8 },
};

const PAGE_TRANSITION = {
  duration: 0.38,
  ease:     [0.16, 1, 0.3, 1],
};

export default function AppShell() {
  const location   = useLocation();
  const contentRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{
      display:    'flex',
      width:      '100%',
      minHeight:  '100vh',
      background: 'var(--theme-bg-primary)',
      position:   'relative',
    }}>
      <style>{`
        .aether-sidebar    { display: none; }
        .aether-mobile-nav { display: block; }
        .aether-content    { margin-left: 0; }
        @media (min-width: 768px) {
          .aether-sidebar    { display: flex !important; }
          .aether-mobile-nav { display: none !important; }
          .aether-content    { margin-left: var(--sidebar-width); }
        }
      `}</style>

      {/* Sky gradient */}
      <div aria-hidden="true" style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        background:    'radial-gradient(ellipse 90% 65% at 50% -15%, var(--theme-sky-top) 0%, var(--theme-sky-mid) 45%, var(--theme-sky-bottom) 100%)',
        opacity:       (settings.backgroundIntensity ?? 75) / 100,
        transition:    'background 1.4s ease, opacity 0.8s ease',
        pointerEvents: 'none',
      }} />

      {/* Particles */}
      <AmbientBackground />

      {/* Sidebar */}
      <div className="aether-sidebar" style={{
        position:      'fixed',
        left:          0, top: 0, bottom: 0,
        width:         'var(--sidebar-width)',
        zIndex:        'var(--z-drawer)',
        flexDirection: 'column',
      }}>
        <SidebarNav />
      </div>

      {/* Main content */}
      <main ref={contentRef} className="aether-content" style={{
        flex:      1,
        position:  'relative',
        zIndex:    1,
        minHeight: '100vh',
        minWidth:  0,
        overflowX: 'hidden',
      }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={PAGE_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={PAGE_TRANSITION}
            style={{ minHeight: '100vh', width: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile nav */}
      <div className="aether-mobile-nav">
        <MobileNav />
      </div>
    </div>
  );
}
