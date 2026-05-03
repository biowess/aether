import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocations } from '../../services/geocodingService';
import { useLocation } from '../../contexts/LocationContext';

export default function LocationSearch({ onSelect, placeholder = 'Search city or region…' }) {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const { setActiveLocation } = useLocation();

  const inputRef   = useRef(null);
  const timerRef   = useRef(null);

  const search = useCallback(async (q) => {
    if (q.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await searchLocations(q, 8);
      setResults(res);
      setOpen(res.length > 0);
      setActiveIdx(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 320);
  };

  const handleSelect = (location) => {
    setActiveLocation(location);
    setQuery('');
    setOpen(false);
    setResults([]);
    onSelect?.(location);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.closest('.location-search-wrap')?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className="location-search-wrap"
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Input */}
      <div style={{
        position:     'relative',
        display:      'flex',
        alignItems:   'center',
      }}>
        {/* Search icon */}
        <div style={{
          position:   'absolute',
          left:       'var(--space-4)',
          color:      'var(--theme-text-muted)',
          pointerEvents: 'none',
          display:    'flex',
          alignItems: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          aria-label="Search location"
          aria-expanded={open}
          aria-controls="location-results"
          role="combobox"
          autoComplete="off"
          style={{
            width:         '100%',
            background:    'var(--theme-panel)',
            border:        `1px solid ${open ? 'var(--theme-accent)' : 'var(--theme-border)'}`,
            borderRadius:  open ? 'var(--radius-md) var(--radius-md) 0 0' : 'var(--radius-md)',
            color:         'var(--theme-text-primary)',
            fontFamily:    'var(--font-sans)',
            fontSize:      'var(--text-base)',
            padding:       '0.85rem var(--space-4) 0.85rem calc(var(--space-4) + 28px)',
            outline:       'none',
            transition:    'border-color 200ms, border-radius 200ms',
            boxShadow:     open ? '0 0 0 1px var(--theme-accent)22' : 'none',
            backdropFilter: 'blur(20px)',
          }}
        />

        {/* Loading spinner or clear */}
        {loading && (
          <div style={{ position: 'absolute', right: 'var(--space-4)', color: 'var(--theme-text-muted)' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ width: 14, height: 14, border: '2px solid transparent', borderTopColor: 'var(--theme-accent)', borderRadius: '50%' }}
            />
          </div>
        )}
        {!loading && query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); setResults([]); }}
            aria-label="Clear search"
            style={{
              position:   'absolute',
              right:      'var(--space-4)',
              background: 'none',
              border:     'none',
              color:      'var(--theme-text-muted)',
              cursor:     'pointer',
              padding:    '0.2rem',
              display:    'flex',
              alignItems: 'center',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            id="location-results"
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              position:     'absolute',
              top:          '100%',
              left:         0,
              right:        0,
              zIndex:       'var(--z-overlay)',
              background:   'var(--theme-panel-strong)',
              border:       '1px solid var(--theme-accent)',
              borderTop:    'none',
              borderRadius: '0 0 var(--radius-md) var(--radius-md)',
              backdropFilter: 'blur(28px)',
              overflow:     'hidden',
              listStyle:    'none',
              margin:       0,
              padding:      0,
              boxShadow:    '0 16px 40px var(--theme-shadow)',
            }}
          >
            {results.map((loc, i) => (
              <li
                key={loc.id}
                role="option"
                aria-selected={i === activeIdx}
                onClick={() => handleSelect(loc)}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  padding:     '0.85rem var(--space-5)',
                  cursor:      'pointer',
                  background:  i === activeIdx ? 'var(--theme-panel)' : 'transparent',
                  borderBottom: i < results.length - 1 ? '1px solid var(--theme-border)' : 'none',
                  transition:  'background 120ms',
                  display:     'flex',
                  alignItems:  'center',
                  gap:         'var(--space-3)',
                }}
              >
                {/* Pin icon */}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--theme-text-muted)', flexShrink: 0 }}>
                  <circle cx="8" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M8 14 C8 14 4 10 4 6.5a4 4 0 018 0C12 10 8 14 8 14z" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize:   'var(--text-sm)',
                    color:      'var(--theme-text-primary)',
                    marginBottom: '0.15rem',
                  }}>
                    {loc.name}
                    {loc.region && (
                      <span style={{ color: 'var(--theme-text-muted)', marginLeft: '0.4rem' }}>
                        {loc.region}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontFamily:    'var(--font-mono)',
                    fontSize:      '0.62rem',
                    color:         'var(--theme-text-muted)',
                    letterSpacing: '0.06em',
                  }}>
                    {loc.country}
                    {loc.latitude && ` · ${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°`}
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
