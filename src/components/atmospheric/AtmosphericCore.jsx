import { useRef, useEffect, useState } from 'react';
import { motion, useAnimationFrame } from 'framer-motion';
import { useWeather } from '../../contexts/WeatherContext';
import { useSettings } from '../../contexts/SettingsContext';
import {
  getCondition, describeArc, windDegToCompass,
  getAtmosphericPhrase, clamp, mapRange,
} from '../../utils/weatherUtils';
import { formatTempValue, formatHumidity, formatPressure, formatWind } from '../../utils/formatUtils';

const SIZE   = 440;
const CX     = SIZE / 2;
const CY     = SIZE / 2;
const R_TICK = 200;   // tick ring
const R_CLOUD = 185;  // cloud cover arc
const R_WIND  = 162;  // wind arc
const R_HUM   = 140;  // humidity arc
const R_CORE  = 110;  // glass core
const R_INNER = 80;   // inner detail ring

export default function AtmosphericCore() {
  const { weather, condition, timeOfDay } = useWeather();
  const { settings } = useSettings();

  const rotRef        = useRef(0);
  const [rotation, setRotation] = useState(0);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionEnabled  = settings.motionIntensity !== 'minimal' && !prefersReduced;

  // Slow rotation based on wind speed
  useAnimationFrame((_, delta) => {
    if (!motionEnabled || !weather) return;
    const windSpeed = weather?.current?.windSpeed ?? 0;
    const rpm       = mapRange(windSpeed, 0, 80, 0.3, 2.5);
    rotRef.current  = (rotRef.current + rpm * (delta / 1000) * 6) % 360;
    setRotation(rotRef.current);
  });

  if (!weather) return <CoreSkeleton />;

  const cur          = weather?.current;
  const temp         = formatTempValue(cur?.temperature, settings?.temperatureUnit);
  const feelsLike    = formatTempValue(cur?.feelsLike, settings?.temperatureUnit);
  const unit         = settings?.temperatureUnit === 'F' ? '°F' : '°C';
  const humidity     = clamp(cur?.humidity ?? 0, 0, 100);
  const cloudCover   = clamp(cur?.cloudCover ?? 0, 0, 100);
  const windDir      = cur?.windDirection ?? 0;
  const windSpeed    = cur?.windSpeed ?? 0;
  const pressure     = cur?.pressure ?? 1013;
  const condGroup    = condition?.group ?? 'clear';
  const phrase       = getAtmosphericPhrase(condGroup, timeOfDay);

  // Arc calculations (0–360 degrees → arc)
  const humArcEnd   = mapRange(humidity,   0, 100, 0,   358);
  const cloudArcEnd = mapRange(cloudCover, 0, 100, 0,   358);
  const pressArcEnd = mapRange(pressure,   960, 1060, 0, 358);

  // Tick marks
  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle   = (i * 5 - 90) * (Math.PI / 180);
    const major   = i % 6 === 0;
    const medium  = i % 3 === 0;
    const rOuter  = R_TICK;
    const rInner  = major ? R_TICK - 10 : medium ? R_TICK - 6 : R_TICK - 3;
    return {
      x1: CX + rInner * Math.cos(angle),
      y1: CY + rInner * Math.sin(angle),
      x2: CX + rOuter * Math.cos(angle),
      y2: CY + rOuter * Math.sin(angle),
      major, medium,
    };
  });

  // Wind direction arrow endpoint
  const windRad    = (windDir - 90) * (Math.PI / 180);
  const windArrowX = CX + R_INNER * Math.cos(windRad);
  const windArrowY = CY + R_INNER * Math.sin(windRad);

  // Pulsing glow animation
  const glowIntensity = (settings.glowIntensity ?? 60) / 100;

  return (
    <div style={{
      position:   'relative',
      display:    'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width:      '100%',
    }}>
      {/* Outer ambient glow */}
      <motion.div
        animate={motionEnabled ? { opacity: [0.4 * glowIntensity, 0.75 * glowIntensity, 0.4 * glowIntensity] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position:     'absolute',
          width:        SIZE * 0.9,
          height:       SIZE * 0.9,
          borderRadius: '50%',
          background:   `radial-gradient(circle, var(--theme-glow) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex:       0,
        }}
      />

      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        style={{ position: 'relative', zIndex: 1, maxWidth: '100%', maxHeight: '80vw' }}
        aria-label={`Current temperature ${temp}${unit}, ${condition?.label ?? ''}`}
      >
        <defs>
          {/* Core glass gradient */}
          <radialGradient id="coreGlass" cx="38%" cy="35%" r="70%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.07)" />
            <stop offset="60%"  stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>

          {/* Core border gradient */}
          <linearGradient id="coreBorder" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
            <stop offset="50%"  stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.18)" />
          </linearGradient>

          {/* Humidity arc gradient */}
          <linearGradient id="humGrad" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--theme-accent-cold)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--theme-accent)"      stopOpacity="0.5" />
          </linearGradient>

          {/* Cloud arc gradient */}
          <linearGradient id="cloudGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="var(--theme-text-muted)"   stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--theme-text-muted)"   stopOpacity="0.2" />
          </linearGradient>

          {/* Wind ring gradient */}
          <linearGradient id="windGrad" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--theme-accent)"      stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--theme-accent-warm)" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Inner glow filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Deep shadow for core */}
          <filter id="coreShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="rgba(0,0,0,0.6)" />
          </filter>
        </defs>

        {/* ── Outermost atmospheric haze ── */}
        <circle
          cx={CX} cy={CY} r={R_TICK + 8}
          fill="none"
          stroke="var(--theme-border)"
          strokeWidth="0.5"
          opacity="0.4"
        />

        {/* ── Tick marks ring (rotates with wind) ── */}
        <motion.g
          animate={motionEnabled ? { rotate: rotation } : {}}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        >
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1} y1={t.y1}
              x2={t.x2} y2={t.y2}
              stroke="var(--theme-text-muted)"
              strokeWidth={t.major ? 1.5 : t.medium ? 1 : 0.5}
              opacity={t.major ? 0.7 : t.medium ? 0.45 : 0.25}
            />
          ))}
        </motion.g>

        {/* ── Cardinal labels ── */}
        {[
          { label: 'N', angle: -90 },
          { label: 'E', angle:   0 },
          { label: 'S', angle:  90 },
          { label: 'W', angle: 180 },
        ].map(({ label, angle }) => {
          const rad = (angle) * (Math.PI / 180);
          const r   = R_TICK - 18;
          return (
            <text
              key={label}
              x={CX + r * Math.cos(rad)}
              y={CY + r * Math.sin(rad)}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize="8"
              fill="var(--theme-text-muted)"
              opacity="0.5"
              letterSpacing="0.05em"
            >
              {label}
            </text>
          );
        })}

        {/* ── Cloud cover arc (outer ring) ── */}
        <circle cx={CX} cy={CY} r={R_CLOUD} fill="none" stroke="var(--theme-border)" strokeWidth="1" opacity="0.3" />
        {cloudArcEnd > 2 && (
          <motion.path
            d={describeArc(CX, CY, R_CLOUD, 0, cloudArcEnd)}
            fill="none"
            stroke="url(#cloudGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          />
        )}

        {/* ── Wind arc (middle ring) ── */}
        <circle cx={CX} cy={CY} r={R_WIND} fill="none" stroke="var(--theme-border)" strokeWidth="0.8" opacity="0.25" />
        {windSpeed > 0 && (
          <motion.path
            d={describeArc(CX, CY, R_WIND, 0, mapRange(Math.min(windSpeed, 100), 0, 100, 0, 358))}
            fill="none"
            stroke="url(#windGrad)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        )}

        {/* ── Humidity arc (inner ring) ── */}
        <circle cx={CX} cy={CY} r={R_HUM} fill="none" stroke="var(--theme-border)" strokeWidth="1" opacity="0.3" />
        {humArcEnd > 2 && (
          <motion.path
            d={describeArc(CX, CY, R_HUM, 0, humArcEnd)}
            fill="none"
            stroke="url(#humGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          />
        )}

        {/* ── Glass core circle ── */}
        <circle
          cx={CX} cy={CY} r={R_CORE}
          fill="url(#coreGlass)"
          stroke="url(#coreBorder)"
          strokeWidth="1"
          filter="url(#coreShadow)"
        />

        {/* Core inner ring */}
        <circle cx={CX} cy={CY} r={R_CORE - 12} fill="none" stroke="var(--theme-border)" strokeWidth="0.5" opacity="0.4" />

        {/* ── Wind direction indicator ── */}
        <motion.g
          animate={motionEnabled ? { rotate: windDir } : {}}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Arrow */}
          <line
            x1={CX} y1={CY - 16}
            x2={CX} y2={CY - 65}
            stroke="var(--theme-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Arrowhead */}
          <polygon
            points={`${CX},${CY - 70} ${CX - 4},${CY - 58} ${CX + 4},${CY - 58}`}
            fill="var(--theme-accent)"
            opacity="0.9"
          />
          {/* Counter arrow (tail) */}
          <line
            x1={CX} y1={CY + 16}
            x2={CX} y2={CY + 40}
            stroke="var(--theme-accent)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </motion.g>

        {/* Center pivot dot */}
        <circle cx={CX} cy={CY} r="4" fill="var(--theme-bg-primary)" stroke="var(--theme-border)" strokeWidth="1" />
        <motion.circle
          cx={CX} cy={CY} r="2.5"
          fill="var(--theme-accent)"
          animate={motionEnabled ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* ── Temperature display ── */}
        <text
          x={CX} y={CY - 18}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-sans)"
          fontWeight="300"
          fontSize="52"
          letterSpacing="-0.03em"
          fill="var(--theme-text-primary)"
          fontVariantNumeric="tabular-nums"
          style={{ filter: 'drop-shadow(0 0 20px var(--theme-glow))' }}
        >
          {temp}
        </text>

        {/* Degree + unit */}
        <text
          x={CX + 36} y={CY - 34}
          textAnchor="start"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontWeight="300"
          fontSize="14"
          fill="var(--theme-text-secondary)"
          opacity="0.8"
        >
          {unit}
        </text>

        {/* Feels-like */}
        <text
          x={CX} y={CY + 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight="300"
          fontSize="11"
          fill="var(--theme-text-muted)"
          letterSpacing="0.06em"
        >
          FEELS {feelsLike}{unit}
        </text>

        {/* ── Condition label ── */}
        <text
          x={CX} y={CY + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontWeight="400"
          fontSize="9"
          fill="var(--theme-accent)"
          letterSpacing="0.18em"
          textTransform="uppercase"
          opacity="0.9"
        >
          {(condition?.label ?? 'Unknown').toUpperCase()}
        </text>

        {/* ── Ring labels ── */}
        {/* Humidity label at 9 o'clock of humidity ring */}
        <text
          x={CX - R_HUM - 2} y={CY}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="var(--theme-accent-cold)"
          opacity="0.65"
          letterSpacing="0.08em"
        >
          {humidity}%
        </text>

        {/* Cloud label at 9 o'clock of cloud ring */}
        <text
          x={CX - R_CLOUD - 4} y={CY}
          textAnchor="end"
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="var(--theme-text-muted)"
          opacity="0.55"
          letterSpacing="0.08em"
        >
          {cloudCover}%
        </text>

        {/* Wind compass label */}
        <text
          x={CX} y={CY + 86}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="7"
          fill="var(--theme-text-muted)"
          opacity="0.5"
          letterSpacing="0.12em"
        >
          {windDegToCompass(windDir)} · {Math.round(windSpeed)} KM/H
        </text>

        {/* ── Outer data points (cardinal positions) ── */}
        {[
          { label: 'HUM',  value: formatHumidity(humidity),      angle:  225 },
          { label: 'PRES', value: formatPressure(pressure),       angle:  315 },
        ].map(({ label, value, angle }) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const r   = R_TICK + 24;
          const x   = CX + r * Math.cos(rad);
          const y   = CY + r * Math.sin(rad);
          return (
            <g key={label}>
              <text x={x} y={y - 6}   textAnchor="middle" fontFamily="var(--font-mono)" fontSize="6.5"  fill="var(--theme-text-muted)" opacity="0.5" letterSpacing="0.12em">{label}</text>
              <text x={x} y={y + 6}   textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9.5"  fill="var(--theme-text-secondary)" fontVariantNumeric="tabular-nums">{value}</text>
            </g>
          );
        })}
      </svg>

      {/* ── Atmospheric phrase ── */}
      <motion.div
        key={phrase}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:      'absolute',
          bottom:        -28,
          left:          0,
          right:         0,
          textAlign:     'center',
          fontFamily:    'var(--font-serif)',
          fontStyle:     'italic',
          fontSize:      'var(--text-base)',
          color:         'var(--theme-text-muted)',
          letterSpacing: '0.02em',
          pointerEvents: 'none',
        }}
      >
        {phrase}
      </motion.div>
    </div>
  );
}

function CoreSkeleton() {
  return (
    <div style={{
      width:        SIZE,
      height:       SIZE,
      maxWidth:     '100%',
      maxHeight:    '80vw',
      borderRadius: '50%',
      border:       '1px solid var(--theme-border)',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
    }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          width:        60,
          height:       60,
          borderRadius: '50%',
          border:       '2px solid transparent',
          borderTopColor: 'var(--theme-accent)',
          opacity:      0.5,
        }}
      />
    </div>
  );
}
