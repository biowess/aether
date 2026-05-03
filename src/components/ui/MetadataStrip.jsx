import { motion } from 'framer-motion';

// ── StatusBadge ────────────────────────────────────────────────
export function StatusBadge({ label, value, unit, variant = 'default', pulse = false }) {
  const colors = {
    default: 'var(--theme-accent)',
    warm:    'var(--theme-accent-warm)',
    cold:    'var(--theme-accent-cold)',
    warning: 'var(--theme-warning)',
    danger:  'var(--theme-danger)',
  };
  const color = colors[variant] ?? colors.default;

  return (
    <div style={{
      display:     'inline-flex',
      alignItems:  'center',
      gap:         '0.5rem',
      padding:     '0.35rem 0.75rem',
      borderRadius: 'var(--radius-full)',
      border:      `1px solid ${color}22`,
      background:  `${color}0f`,
      position:    'relative',
    }}>
      {pulse && (
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width:        5,
            height:       5,
            borderRadius: '50%',
            background:   color,
            boxShadow:    `0 0 6px ${color}`,
            flexShrink:   0,
          }}
        />
      )}
      {label && (
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-xs)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         `${color}aa`,
        }}>
          {label}
        </span>
      )}
      {value !== undefined && (
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-xs)',
          color,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {value}{unit ? <span style={{ opacity: 0.7 }}> {unit}</span> : null}
        </span>
      )}
    </div>
  );
}

// ── MetadataStrip ──────────────────────────────────────────────
export function MetadataStrip({ items = [], separator = true }) {
  return (
    <div style={{
      display:    'flex',
      flexWrap:   'wrap',
      alignItems: 'center',
      gap:        '0.75rem',
    }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {item.label && (
              <span style={{
                fontFamily:    'var(--font-mono)',
                fontSize:      '0.6rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color:         'var(--theme-text-muted)',
              }}>
                {item.label}
              </span>
            )}
            <span style={{
              fontFamily:         'var(--font-mono)',
              fontSize:           'var(--text-sm)',
              color:              item.highlight ? 'var(--theme-accent)' : 'var(--theme-text-secondary)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {item.value}
            </span>
          </div>
          {separator && i < items.length - 1 && (
            <div style={{
              width:      1,
              height:     24,
              background: 'var(--theme-border)',
              flexShrink: 0,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ── SectionHeader ──────────────────────────────────────────────
export function SectionHeader({ label, title, action }) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'flex-end',
      justifyContent: 'space-between',
      marginBottom:   'var(--space-6)',
    }}>
      <div>
        {label && (
          <p style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'var(--theme-text-muted)',
            marginBottom:  '0.4rem',
          }}>
            {label}
          </p>
        )}
        {title && (
          <h2 style={{
            fontSize:    'var(--text-xl)',
            fontWeight:  300,
            color:       'var(--theme-text-primary)',
            letterSpacing: '-0.02em',
          }}>
            {title}
          </h2>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            background:    'transparent',
            border:        'none',
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         'var(--theme-text-muted)',
            cursor:        'pointer',
            padding:       '0.4rem 0.75rem',
            borderRadius:  'var(--radius-sm)',
            transition:    'color 200ms',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--theme-accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--theme-text-muted)'}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
