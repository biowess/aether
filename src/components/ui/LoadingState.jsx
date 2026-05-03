import { motion } from 'framer-motion';

export function LoadingState({ message = 'Reading the atmosphere…' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '60vh',
        gap:            '2rem',
      }}
    >
      {/* Atmospheric loading ring */}
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <motion.div
          style={{
            position:     'absolute',
            inset:        0,
            borderRadius: '50%',
            border:       '1px solid var(--theme-border)',
          }}
        />
        <motion.div
          style={{
            position:     'absolute',
            inset:        0,
            borderRadius: '50%',
            border:       '2px solid transparent',
            borderTopColor: 'var(--theme-accent)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          style={{
            position:     'absolute',
            inset:        12,
            borderRadius: '50%',
            border:       '1px solid var(--theme-border)',
          }}
        />
        <motion.div
          style={{
            position:     'absolute',
            inset:        12,
            borderRadius: '50%',
            border:       '1px solid transparent',
            borderTopColor: 'var(--theme-accent-cold)',
            opacity:      0.6,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center dot */}
        <div style={{
          position:     'absolute',
          top:          '50%',
          left:         '50%',
          transform:    'translate(-50%, -50%)',
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   'var(--theme-accent)',
          boxShadow:    '0 0 12px var(--theme-glow)',
        }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--text-xs)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color:      'var(--theme-text-muted)',
        }}>
          {message}
        </p>
      </div>
    </motion.div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '40vh',
        gap:            '1.5rem',
        padding:        '2rem',
        textAlign:      'center',
      }}
    >
      <div style={{
        width:        48,
        height:       48,
        borderRadius: '50%',
        border:       '1px solid var(--theme-danger)',
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        color:        'var(--theme-danger)',
        fontSize:     '1.25rem',
        opacity:      0.8,
      }}>
        ⚠
      </div>
      <div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--text-xs)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:      'var(--theme-text-muted)',
          marginBottom: '0.5rem',
        }}>
          Atmospheric read error
        </p>
        <p style={{
          fontSize:   'var(--text-sm)',
          color:      'var(--theme-text-secondary)',
          maxWidth:   400,
        }}>
          {message || 'Unable to retrieve weather data. Check your connection and try again.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            background:   'transparent',
            border:       '1px solid var(--theme-border)',
            borderRadius: 8,
            padding:      '0.6rem 1.5rem',
            color:        'var(--theme-text-secondary)',
            fontFamily:   'var(--font-mono)',
            fontSize:     'var(--text-xs)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor:       'pointer',
            transition:   'all 200ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--theme-accent)';
            e.currentTarget.style.color = 'var(--theme-accent)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--theme-border)';
            e.currentTarget.style.color = 'var(--theme-text-secondary)';
          }}
        >
          Retry
        </button>
      )}
    </motion.div>
  );
}

export function EmptyState({ title = 'No data', message }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      '30vh',
      gap:            '1rem',
      padding:        '2rem',
      textAlign:      'center',
    }}>
      <div style={{
        width:        40,
        height:       40,
        borderRadius: '50%',
        border:       '1px solid var(--theme-border)',
        opacity:      0.5,
      }} />
      <div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize:   'var(--text-xs)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:      'var(--theme-text-muted)',
          marginBottom: '0.5rem',
        }}>
          {title}
        </p>
        {message && (
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--theme-text-muted)' }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
