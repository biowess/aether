import { useEffect, useRef, useCallback } from 'react';
import { useWeather } from '../../contexts/WeatherContext';
import { useSettings } from '../../contexts/SettingsContext';

const TWO_PI = Math.PI * 2;

export default function AmbientBackground() {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const stateRef   = useRef({ particles: [], tick: 0, initialized: false });

  const { weather, condition, timeOfDay } = useWeather();
  const { settings } = useSettings();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionEnabled  =
    settings.atmosphericEffects !== false &&
    settings.motionIntensity !== 'minimal' &&
    !prefersReduced;

  const getConfig = useCallback(() => {
    const group  = condition?.group ?? 'clear';
    const mode   = settings.performanceMode ?? 'balanced';
    const bgInt  = (settings.backgroundIntensity ?? 75) / 100;

    const countMap = { 'high-fidelity': 80, balanced: 50, 'battery-saver': 25, minimal: 0 };
    const count    = motionEnabled ? (countMap[mode] ?? 50) : 0;

    const configs = {
      clear:  { count, speed: 0.18, size: [1, 2.5],   opacity: [0.06, 0.22], spread: 1.0, color: 'accent'  },
      cloudy: { count, speed: 0.10, size: [1.5, 4],   opacity: [0.04, 0.12], spread: 1.2, color: 'muted'   },
      rain:   { count, speed: 0.55, size: [0.6, 1.5], opacity: [0.08, 0.25], spread: 0.4, color: 'cold'    },
      snow:   { count, speed: 0.20, size: [1.5, 4],   opacity: [0.08, 0.30], spread: 0.8, color: 'white'   },
      storm:  { count, speed: 0.70, size: [0.5, 1.2], opacity: [0.10, 0.30], spread: 0.3, color: 'warning' },
      fog:    { count: Math.floor(count * 0.4), speed: 0.06, size: [3, 8], opacity: [0.04, 0.10], spread: 1.0, color: 'muted' },
    };
    const cfg = configs[group] ?? configs.clear;
    cfg.opacity = cfg.opacity.map(o => o * bgInt);
    return cfg;
  }, [condition, motionEnabled, settings.performanceMode, settings.backgroundIntensity]);

  const initParticles = useCallback((width, height, cfg) => {
    return Array.from({ length: cfg.count }, () => createParticle(width, height, cfg, true));
  }, []);

  function createParticle(width, height, cfg, randomY = false) {
    const s   = cfg.size[0] + Math.random() * (cfg.size[1] - cfg.size[0]);
    const op  = cfg.opacity[0] + Math.random() * (cfg.opacity[1] - cfg.opacity[0]);
    const vx  = (Math.random() - 0.5) * cfg.spread * cfg.speed;
    const vy  = cfg.speed * (0.5 + Math.random() * 0.5);
    return {
      x:   Math.random() * width,
      y:   randomY ? Math.random() * height : -s * 2,
      vx, vy,
      size: s,
      opacity: op,
      baseOpacity: op,
      phase: Math.random() * TWO_PI,
    };
  }

  const drawParticle = useCallback((ctx, p, group, tick) => {
    const breathe = Math.sin(p.phase + tick * 0.01) * 0.15;
    const alpha   = Math.max(0, p.opacity + breathe * p.baseOpacity);

    if (group === 'snow') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TWO_PI);
      ctx.fillStyle = `rgba(200, 225, 255, ${alpha})`;
      ctx.fill();
    } else if (group === 'rain' || group === 'storm') {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.vx * 4, p.y + p.size * 6);
      ctx.strokeStyle = `rgba(140, 180, 220, ${alpha})`;
      ctx.lineWidth   = p.size * 0.5;
      ctx.stroke();
    } else if (group === 'fog') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 20);
      grad.addColorStop(0,   `rgba(160, 180, 200, ${alpha})`);
      grad.addColorStop(1,   `rgba(160, 180, 200, 0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 20, 0, TWO_PI);
      ctx.fillStyle = grad;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TWO_PI);
      ctx.fillStyle = `rgba(160, 200, 240, ${alpha})`;
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width  = 0;
    let height = 0;
    const st = stateRef.current;

    function resize() {
      width          = canvas.offsetWidth;
      height         = canvas.offsetHeight;
      canvas.width   = width;
      canvas.height  = height;
      const cfg      = getConfig();
      st.particles   = initParticles(width, height, cfg);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    function frame() {
      if (!motionEnabled) {
        ctx.clearRect(0, 0, width, height);
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      st.tick++;

      const cfg   = getConfig();
      const group = condition?.group ?? 'clear';

      st.particles.forEach((p, i) => {
        // Apply weather-specific drift
        const wobble = Math.sin(p.phase + st.tick * 0.008) * 0.3;
        p.x += p.vx + wobble;
        p.y += p.vy;

        // Snow drifts more horizontally
        if (group === 'snow') {
          p.x += Math.sin(st.tick * 0.005 + p.phase) * 0.3;
        }

        // Wrap or reset
        if (p.y > height + p.size * 10) {
          const newP     = createParticle(width, height, cfg, false);
          st.particles[i] = newP;
          return;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        drawParticle(ctx, p, group, st.tick);
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [condition, motionEnabled, getConfig, initParticles, drawParticle]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:   'fixed',
        inset:      0,
        width:      '100%',
        height:     '100%',
        pointerEvents: 'none',
        zIndex:     0,
        opacity:    motionEnabled ? 1 : 0,
        transition: 'opacity 1s ease',
      }}
    />
  );
}
