// ── Aether Weather Icons ─────────────────────────────────────────
// Clean, minimal SVG icons for each weather condition group.

export function WeatherIcon({ code, size = 24, style = {} }) {
  const group = getIconGroup(code);

  const iconStyle = {
    display:    'block',
    flexShrink: 0,
    ...style,
  };

  switch (group) {
    case 'clear-day':     return <ClearDayIcon     size={size} style={iconStyle} />;
    case 'clear-night':   return <ClearNightIcon   size={size} style={iconStyle} />;
    case 'partly-cloudy': return <PartlyCloudyIcon size={size} style={iconStyle} />;
    case 'cloudy':        return <CloudyIcon       size={size} style={iconStyle} />;
    case 'drizzle':       return <DrizzleIcon      size={size} style={iconStyle} />;
    case 'rain':          return <RainIcon         size={size} style={iconStyle} />;
    case 'snow':          return <SnowIcon         size={size} style={iconStyle} />;
    case 'storm':         return <StormIcon        size={size} style={iconStyle} />;
    case 'fog':           return <FogIcon          size={size} style={iconStyle} />;
    default:              return <ClearDayIcon     size={size} style={iconStyle} />;
  }
}

function getIconGroup(code) {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 20;

  if (code === 0)                        return isDay ? 'clear-day' : 'clear-night';
  if (code === 1)                        return isDay ? 'clear-day' : 'clear-night';
  if (code === 2)                        return 'partly-cloudy';
  if (code === 3)                        return 'cloudy';
  if (code === 45 || code === 48)        return 'fog';
  if (code >= 51 && code <= 57)         return 'drizzle';
  if (code >= 61 && code <= 67)         return 'rain';
  if (code >= 71 && code <= 77)         return 'snow';
  if (code >= 80 && code <= 82)         return 'rain';
  if (code >= 85 && code <= 86)         return 'snow';
  if (code >= 95)                        return 'storm';
  return 'clear-day';
}

const S = (size) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none' });

function ClearDayIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <circle cx="12" cy="12" r="4.5" stroke="var(--theme-accent-warm)" strokeWidth="1.2" />
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const r = Math.PI * deg / 180;
        const x1 = 12 + 7 * Math.cos(r), y1 = 12 + 7 * Math.sin(r);
        const x2 = 12 + 9 * Math.cos(r), y2 = 12 + 9 * Math.sin(r);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--theme-accent-warm)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />;
      })}
    </svg>
  );
}

function ClearNightIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M20 13.5A8 8 0 1110.5 4a6 6 0 009.5 9.5z" stroke="var(--theme-accent)" strokeWidth="1.2" fill="none" />
      <circle cx="17" cy="5" r="0.8" fill="var(--theme-accent-cold)" opacity="0.6" />
      <circle cx="20" cy="9" r="0.5" fill="var(--theme-accent-cold)" opacity="0.4" />
    </svg>
  );
}

function PartlyCloudyIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <circle cx="9" cy="10" r="3.5" stroke="var(--theme-accent-warm)" strokeWidth="1" opacity="0.9" />
      <path d="M7 14h8a3 3 0 000-6 3 3 0 00-6 0" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <path d="M5 14h11a2.5 2.5 0 000-5 2.5 2.5 0 00-5 0" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CloudyIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M6 15h12a3 3 0 000-6 3 3 0 00-6-1.5A3 3 0 006 15z" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function DrizzleIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M6 12h12a3 3 0 000-6 3 3 0 00-6-1.5A3 3 0 006 12z" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" />
      {[9,12,15].map((x, i) => (
        <line key={i} x1={x} y1={15} x2={x - 1} y2={19} stroke="var(--theme-accent-cold)" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      ))}
    </svg>
  );
}

function RainIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M5 12h14a3.5 3.5 0 000-7 3.5 3.5 0 00-7-1A3.5 3.5 0 005 12z" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" />
      {[8,12,16,10,14].map((x, i) => (
        <line key={i} x1={x} y1={14 + (i%2)*1} x2={x - 1.5} y2={19 + (i%2)*1} stroke="var(--theme-accent-cold)" strokeWidth="1.2" strokeLinecap="round" opacity={0.6 + i * 0.08} />
      ))}
    </svg>
  );
}

function SnowIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M5 10h14a3 3 0 000-6 3 3 0 00-6-1A3 3 0 005 10z" stroke="var(--theme-text-secondary)" strokeWidth="1.2" fill="none" />
      {[8,12,16].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={16} r="1" fill="var(--theme-accent-cold)" opacity="0.7" />
          <circle cx={x-1} cy={19.5} r="0.7" fill="var(--theme-accent-cold)" opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

function StormIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      <path d="M5 11h14a3.5 3.5 0 000-7 3.5 3.5 0 00-7-1A3.5 3.5 0 005 11z" stroke="var(--theme-text-muted)" strokeWidth="1.2" fill="none" />
      <path d="M13 13l-3 5h4l-3 3" stroke="var(--theme-accent-warm)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FogIcon({ size, style }) {
  return (
    <svg {...S(size)} style={style}>
      {[7,5,7].map((w, i) => (
        <line key={i} x1={12 - w} y1={9 + i * 3} x2={12 + w} y2={9 + i * 3} stroke="var(--theme-text-muted)" strokeWidth="1.2" strokeLinecap="round" opacity={1 - i * 0.2} />
      ))}
    </svg>
  );
}
