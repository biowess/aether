import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const GlassPanel = forwardRef(function GlassPanel({
  children,
  className = '',
  strong = false,
  radius = 'lg',
  padding = 'md',
  animate = false,
  style = {},
  onClick,
  ...props
}, ref) {
  const radii = { sm: 8, md: 12, lg: 16, xl: 24, full: 9999 };
  const pads  = { none: 0, sm: 12, md: 20, lg: 28, xl: 40 };

  const base = {
    background: strong
      ? 'var(--theme-panel-strong)'
      : 'var(--theme-panel)',
    border:        '1px solid var(--theme-border)',
    backdropFilter: 'blur(24px) saturate(160%)',
    WebkitBackdropFilter: 'blur(24px) saturate(160%)',
    borderRadius:  radii[radius] ?? 16,
    padding:       pads[padding] ?? 20,
    position:      'relative',
    overflow:      'hidden',
    ...style,
  };

  if (animate) {
    return (
      <motion.div
        ref={ref}
        className={`glass-panel ${className}`}
        style={base}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div
      ref={ref}
      className={`glass-panel ${className}`}
      style={base}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
});

export default GlassPanel;
