import { motion } from 'framer-motion';

const FADE_UP = (delay = 0) => ({
  initial:  { opacity: 0, y: 24 },
  animate:  { opacity: 1, y:  0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
});

export default function About() {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: 'var(--space-24)' }}>

      {/* ── Hero ── */}
      <div style={{
        padding:    'var(--space-20) var(--space-6) var(--space-16)',
        maxWidth:   800,
        margin:     '0 auto',
        textAlign:  'center',
        position:   'relative',
      }}>
        {/* Background glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          aria-hidden
          style={{
            position:   'absolute',
            top:        '10%',
            left:       '50%',
            transform:  'translateX(-50%)',
            width:      600,
            height:     300,
            background: 'radial-gradient(ellipse, var(--theme-glow) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex:     0,
          }}
        />

        {/* Logo mark */}
        <motion.div {...FADE_UP(0)} style={{ position: 'relative', zIndex: 1, marginBottom: 'var(--space-8)' }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            <circle cx="32" cy="32" r="30" stroke="var(--theme-border)" strokeWidth="0.8" />
            <circle cx="32" cy="32" r="20" stroke="var(--theme-accent)" strokeWidth="0.8" opacity="0.5" />
            <circle cx="32" cy="32" r="10" stroke="var(--theme-accent-cold)" strokeWidth="0.8" opacity="0.8" />
            <circle cx="32" cy="32" r="3.5" fill="var(--theme-accent)" opacity="0.9" />
            <circle cx="32" cy="32" r="1.5" fill="white" opacity="0.8" />
            <line x1="32" y1="2" x2="32" y2="12" stroke="var(--theme-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
            <line x1="32" y1="52" x2="32" y2="62" stroke="var(--theme-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            <line x1="2" y1="32" x2="12" y2="32" stroke="var(--theme-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
            <line x1="52" y1="32" x2="62" y2="32" stroke="var(--theme-accent)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          </svg>
        </motion.div>

        <motion.p {...FADE_UP(0.05)} style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-xs)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'var(--theme-text-muted)',
          marginBottom:  'var(--space-4)',
          position:      'relative', zIndex: 1,
        }}>
          Atmospheric Intelligence
        </motion.p>

        <motion.h1 {...FADE_UP(0.1)} style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      'clamp(2.5rem, 7vw, 5rem)',
          fontWeight:    200,
          letterSpacing: '-0.04em',
          color:         'var(--theme-text-primary)',
          lineHeight:    1.05,
          marginBottom:  'var(--space-6)',
          position:      'relative', zIndex: 1,
        }}>
          AETHER
        </motion.h1>

        <motion.p {...FADE_UP(0.18)} style={{
          fontFamily:    'var(--font-serif)',
          fontStyle:     'italic',
          fontSize:      'clamp(1.1rem, 3vw, 1.4rem)',
          color:         'var(--theme-text-secondary)',
          lineHeight:    1.6,
          maxWidth:      500,
          margin:        '0 auto',
          position:      'relative', zIndex: 1,
        }}>
          Precision weather, reimagined as atmosphere, presence, and motion.
        </motion.p>
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height:        1,
          background:    'linear-gradient(to right, transparent, var(--theme-border), transparent)',
          maxWidth:      800,
          margin:        '0 auto var(--space-16)',
          transformOrigin: 'center',
        }}
      />

      {/* ── Philosophy sections ── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 var(--space-6)' }}>

        {/* What is Aether */}
        <Section delay={0.2} label="The instrument">
          <h2 style={headingStyle}>
            Weather has always been felt, not merely read.
          </h2>
          <p style={bodyStyle}>
            Aether was built on a single belief: that the atmosphere deserves an interface as thoughtful as the science behind it.
            Most weather applications present conditions as lists — temperature, humidity, wind. Numbers on cards. Facts in rows.
          </p>
          <p style={bodyStyle}>
            Aether presents weather as presence. As light. As motion. As the quality of air you feel when you step outside.
            Every reading from Open-Meteo's precision models is translated into palette, atmosphere, and physical sensation.
          </p>
        </Section>

        <Divider />

        {/* Why it exists */}
        <Section delay={0.05} label="The philosophy">
          <h2 style={headingStyle}>
            A precision instrument for reading the sky.
          </h2>
          <p style={bodyStyle}>
            The design of Aether draws from the tradition of precision instruments — barometers, sextants, observatory clocks,
            mechanical weather gauges. Objects that encode information through form, material, and movement.
          </p>
          <p style={bodyStyle}>
            The central atmospheric dial is not a metaphor. It is a functional instrument: wind direction encoded in rotation,
            humidity in arc, cloud cover in concentric rings. The interface is the measurement.
          </p>
          <p style={bodyStyle}>
            We believe that software can achieve the same dignity as a finely made instrument. That digital interfaces
            can carry weight, depth, and physical presence. That the act of checking the weather can be, quietly, beautiful.
          </p>
        </Section>

        <Divider />

        {/* Design principles */}
        <Section delay={0.05} label="Design principles">
          <h2 style={headingStyle}>
            Physicality over flatness.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)' }}>
            {[
              { n: '01', title: 'Restraint',       body: 'Every element must earn its presence. Negative space is not absence — it is the medium through which form speaks.' },
              { n: '02', title: 'Depth',            body: 'Surfaces have material quality. Glass, metal, air. The interface is layered, not flat.' },
              { n: '03', title: 'Motion',           body: 'Animation is never decorative. It reflects the physical world — slow, continuous, natural.' },
              { n: '04', title: 'Atmosphere',       body: 'The interface shifts with the sky. Time of day, cloud cover, and temperature change the entire visual mood.' },
              { n: '05', title: 'Hierarchy',        body: 'The most important number is the temperature. Everything else supports it, calmly and precisely.' },
              { n: '06', title: 'Typography',       body: 'Numbers are tabular. Labels are tracked. Prose is set in a classical serif. Every typeface has a purpose.' },
            ].map(p => (
              <div key={p.n} style={{
                padding:      'var(--space-5)',
                background:   'var(--theme-panel)',
                border:       '1px solid var(--theme-border)',
                borderRadius: 'var(--radius-lg)',
                backdropFilter: 'blur(20px)',
              }}>
                <div style={{
                  fontFamily:    'var(--font-mono)',
                  fontSize:      '0.58rem',
                  letterSpacing: '0.18em',
                  color:         'var(--theme-accent)',
                  marginBottom:  'var(--space-2)',
                }}>
                  {p.n}
                </div>
                <div style={{
                  fontFamily:    'var(--font-sans)',
                  fontSize:      'var(--text-sm)',
                  fontWeight:    500,
                  color:         'var(--theme-text-primary)',
                  marginBottom:  'var(--space-2)',
                }}>
                  {p.title}
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize:   'var(--text-base)',
                  color:      'var(--theme-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {p.body}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* Technology */}
        <Section delay={0.05} label="Technology">
          <h2 style={headingStyle}>
            Open science. Open data.
          </h2>
          <p style={bodyStyle}>
            Aether is powered entirely by{' '}
            <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-accent)', textDecoration: 'none' }}>
              Open-Meteo
            </a>
            , a free and open-source weather API providing high-resolution atmospheric models without registration or API keys.
            All data is fetched directly from Open-Meteo's forecast endpoint using the WMO standard weather interpretation codes.
          </p>
          <p style={bodyStyle}>
            The interface is built with React, Framer Motion, and a fully custom design system driven by CSS custom properties.
            The atmospheric theme engine responds to weather conditions and time of day, updating 26 semantic color tokens
            dynamically to shift the entire visual mood of the interface.
          </p>
          <p style={bodyStyle}>
            No external tracking. No advertising. No accounts. Aether stores your preferences locally,
            fetches weather data on demand, and keeps nothing.
          </p>
        </Section>

        <Divider />

        {/* Closing */}
        <Section delay={0.05}>
          <blockquote style={{
            fontFamily:    'var(--font-serif)',
            fontStyle:     'italic',
            fontSize:      'clamp(1.1rem, 3vw, 1.5rem)',
            lineHeight:    1.65,
            color:         'var(--theme-text-secondary)',
            borderLeft:    '2px solid var(--theme-accent)',
            paddingLeft:   'var(--space-6)',
            margin:        `var(--space-4) 0`,
          }}>
            The sky does not announce itself. It simply is. Aether aspires to the same quiet authority.
          </blockquote>
        </Section>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            textAlign:   'center',
            paddingTop:  'var(--space-16)',
            borderTop:   '1px solid var(--theme-border)',
            marginTop:   'var(--space-12)',
          }}
        >
          <div style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            gap:            'var(--space-3)',
            marginBottom:   'var(--space-4)',
          }}>
            <svg width="20" height="20" viewBox="0 0 64 64" fill="none" opacity="0.6">
              <circle cx="32" cy="32" r="28" stroke="var(--theme-text-muted)" strokeWidth="1" />
              <circle cx="32" cy="32" r="16" stroke="var(--theme-text-muted)" strokeWidth="1" opacity="0.6" />
              <circle cx="32" cy="32" r="5"  fill="var(--theme-text-muted)" opacity="0.8" />
            </svg>
            <span style={{
              fontFamily:    'var(--font-sans)',
              fontSize:      'var(--text-base)',
              fontWeight:    300,
              letterSpacing: '0.1em',
              color:         'var(--theme-text-muted)',
            }}>
              AETHER
            </span>
          </div>

          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--theme-text-muted)',
            marginBottom:  'var(--space-2)',
          }}>
            BIOWESS 2026
          </p>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize:   '0.6rem',
            color:      'var(--theme-text-muted)',
            opacity:    0.5,
            letterSpacing: '0.06em',
          }}>
            Powered by Open-Meteo · Weather data is free, open, and unauthenticated
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function Section({ children, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 'var(--space-12)' }}
    >
      {label && (
        <p style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color:         'var(--theme-accent)',
          marginBottom:  'var(--space-4)',
        }}>
          {label}
        </p>
      )}
      {children}
    </motion.div>
  );
}

function Divider() {
  return (
    <div style={{
      height:     1,
      background: 'var(--theme-border)',
      margin:     'var(--space-10) 0',
    }} />
  );
}

const headingStyle = {
  fontFamily:    'var(--font-serif)',
  fontWeight:    400,
  fontSize:      'clamp(1.25rem, 3vw, 1.75rem)',
  color:         'var(--theme-text-primary)',
  lineHeight:    1.3,
  marginBottom:  'var(--space-5)',
  letterSpacing: '-0.01em',
};

const bodyStyle = {
  fontFamily:   'var(--font-serif)',
  fontSize:     'clamp(0.95rem, 2vw, 1.05rem)',
  color:        'var(--theme-text-secondary)',
  lineHeight:   1.75,
  marginBottom: 'var(--space-5)',
};
