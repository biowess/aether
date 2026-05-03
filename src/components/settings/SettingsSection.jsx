import { motion } from 'framer-motion';

// ── SettingsSection ────────────────────────────────────────────
export function SettingsSection({ title, description, children }) {
  return (
    <section style={{ marginBottom: 'var(--space-8)' }}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h3 style={{
          fontFamily:    'var(--font-sans)',
          fontSize:      'var(--text-sm)',
          fontWeight:    500,
          color:         'var(--theme-text-primary)',
          letterSpacing: '0.02em',
          marginBottom:  '0.35rem',
        }}>
          {title}
        </h3>
        {description && (
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'var(--text-xs)',
            color:      'var(--theme-text-muted)',
            lineHeight: 1.5,
          }}>
            {description}
          </p>
        )}
      </div>
      <div style={{
        background:   'var(--theme-panel)',
        border:       '1px solid var(--theme-border)',
        borderRadius: 'var(--radius-lg)',
        overflow:     'hidden',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        {children}
      </div>
    </section>
  );
}

// ── ToggleRow ─────────────────────────────────────────────────
export function ToggleRow({ label, description, value, onChange, disabled = false }) {
  return (
    <div
      style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         'var(--space-4) var(--space-5)',
        borderBottom:    '1px solid var(--theme-border)',
        opacity:         disabled ? 0.4 : 1,
        transition:      'opacity 200ms',
        cursor:          disabled ? 'not-allowed' : 'pointer',
      }}
      onClick={() => !disabled && onChange(!value)}
      role="switch"
      aria-checked={value}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          onChange(!value);
        }
      }}
    >
      <div style={{ flex: 1, marginRight: 'var(--space-4)' }}>
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize:   'var(--text-sm)',
          color:      'var(--theme-text-primary)',
          marginBottom: description ? '0.25rem' : 0,
        }}>
          {label}
        </div>
        {description && (
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'var(--text-xs)',
            color:      'var(--theme-text-muted)',
            lineHeight: 1.4,
          }}>
            {description}
          </div>
        )}
      </div>

      {/* Toggle pill */}
      <div style={{
        width:        44,
        height:       24,
        borderRadius: 12,
        background:   value ? 'var(--theme-accent)' : 'var(--theme-bg-tertiary)',
        border:       '1px solid var(--theme-border)',
        position:     'relative',
        flexShrink:   0,
        transition:   'background 250ms ease',
        boxShadow:    value ? '0 0 12px var(--theme-glow)' : 'none',
      }}>
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
          style={{
            position:     'absolute',
            top:          3,
            left:         value ? 23 : 3,
            width:        16,
            height:       16,
            borderRadius: '50%',
            background:   value ? '#fff' : 'var(--theme-text-muted)',
            boxShadow:    '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </div>
  );
}

// ── SegmentedControl ──────────────────────────────────────────
export function SegmentedControl({ label, description, options, value, onChange }) {
  return (
    <div style={{
      padding:      'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--theme-border)',
    }}>
      <div style={{
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        gap:             'var(--space-4)',
        flexWrap:        'wrap',
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'var(--text-sm)',
            color:      'var(--theme-text-primary)',
            marginBottom: description ? '0.25rem' : 0,
          }}>
            {label}
          </div>
          {description && (
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   'var(--text-xs)',
              color:      'var(--theme-text-muted)',
            }}>
              {description}
            </div>
          )}
        </div>

        <div style={{
          display:      'flex',
          borderRadius: 'var(--radius-md)',
          background:   'var(--theme-bg-tertiary)',
          border:       '1px solid var(--theme-border)',
          padding:      2,
          flexShrink:   0,
          position:     'relative',
        }}>
          {options.map(opt => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange(opt.value)}
                style={{
                  position:     'relative',
                  padding:      '0.35rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  border:       'none',
                  background:   active ? 'var(--theme-panel-strong)' : 'transparent',
                  color:        active ? 'var(--theme-text-primary)' : 'var(--theme-text-muted)',
                  fontFamily:   'var(--font-mono)',
                  fontSize:     'var(--text-xs)',
                  letterSpacing: '0.06em',
                  cursor:       'pointer',
                  transition:   'all 180ms',
                  boxShadow:    active ? 'inset 0 0 0 1px var(--theme-border)' : 'none',
                  whiteSpace:   'nowrap',
                }}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── RangeSlider ───────────────────────────────────────────────
export function RangeSlider({ label, description, value, onChange, min = 0, max = 100, step = 1, unit = '' }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{
      padding:      'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--theme-border)',
    }}>
      <div style={{
        display:         'flex',
        justifyContent:  'space-between',
        alignItems:      'flex-start',
        marginBottom:    'var(--space-3)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'var(--text-sm)',
            color:      'var(--theme-text-primary)',
            marginBottom: description ? '0.25rem' : 0,
          }}>
            {label}
          </div>
          {description && (
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   'var(--text-xs)',
              color:      'var(--theme-text-muted)',
            }}>
              {description}
            </div>
          )}
        </div>
        <span style={{
          fontFamily:    'var(--font-mono)',
          fontSize:      'var(--text-sm)',
          color:         'var(--theme-accent)',
          fontVariantNumeric: 'tabular-nums',
          marginLeft:    'var(--space-4)',
          flexShrink:    0,
        }}>
          {value}{unit}
        </span>
      </div>

      <div style={{ position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}>
        {/* Track */}
        <div style={{
          position:     'absolute',
          left:         0, right: 0,
          height:       3,
          borderRadius: 'var(--radius-full)',
          background:   'var(--theme-bg-tertiary)',
          border:       '1px solid var(--theme-border)',
          overflow:     'hidden',
        }}>
          <div style={{
            width:        `${pct}%`,
            height:       '100%',
            background:   'var(--theme-accent)',
            boxShadow:    '0 0 8px var(--theme-glow)',
            borderRadius: 'var(--radius-full)',
            transition:   'width 50ms',
          }} />
        </div>

        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position:   'absolute',
            left: 0, right: 0,
            width:      '100%',
            opacity:    0,
            cursor:     'pointer',
            height:     '100%',
            margin:     0,
          }}
          aria-label={label}
        />
      </div>
    </div>
  );
}

// ── ChoiceRow ─────────────────────────────────────────────────
export function ChoiceRow({ label, description, value, options, onChange }) {
  return (
    <div style={{
      padding:      'var(--space-4) var(--space-5)',
      borderBottom: '1px solid var(--theme-border)',
    }}>
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        gap:            'var(--space-4)',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans)',
            fontSize:   'var(--text-sm)',
            color:      'var(--theme-text-primary)',
          }}>
            {label}
          </div>
          {description && (
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontSize:   'var(--text-xs)',
              color:      'var(--theme-text-muted)',
              marginTop:  '0.2rem',
            }}>
              {description}
            </div>
          )}
        </div>
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            background:    'var(--theme-bg-tertiary)',
            border:        '1px solid var(--theme-border)',
            borderRadius:  'var(--radius-sm)',
            color:         'var(--theme-text-secondary)',
            fontFamily:    'var(--font-mono)',
            fontSize:      'var(--text-xs)',
            padding:       '0.4rem 0.75rem',
            cursor:        'pointer',
            flexShrink:    0,
            outline:       'none',
          }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
