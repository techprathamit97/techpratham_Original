'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import './SplashCursor.css';

const ROOT = 'splash-cursor';
const LAYER = 'splash-cursor__goo';
const BLOB = 'splash-cursor__blob';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const parseColor = value => {
  let hex = String(value).replace('#', '').trim();
  if (hex.length === 3) hex = [...hex].map(char => char + char).join('');
  const number = parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(number)) return [255, 255, 255];
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255];
};

// HSV -> [r,g,b] in 0..255, used for the rainbow mode.
const hsv = (h, s, v) => {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const sector = ((i % 6) + 6) % 6;
  const map = [
    [v, t, p],
    [q, v, p],
    [p, v, t],
    [p, q, v],
    [t, p, v],
    [v, p, q]
  ][sector];
  return map.map(channel => Math.round(channel * 255));
};

/**
 * Gooey trailing-blob chain cursor.
 *
 * A chain of circles follows the pointer, each lagging the one ahead of it.
 * They live inside a layer with an SVG gooey filter (blur + alpha contrast),
 * so overlapping blobs melt into one liquid shape and pinch into droplets when
 * the pointer moves fast. Click to pop a few extra droplets.
 *
 * The prop surface mirrors the previous fluid-sim cursor so this stays a
 * drop-in replacement; props that don't map onto a chain are accepted and
 * ignored (force, swirl, shading, quality).
 */
function SplashCursor({
  colors = ['#4f8cff', '#2dd4bf', '#ffd166'],
  rainbow = true,
  colorSpeed = 1,
  intensity = 1,
  size = 1,
  trail = 1,
  momentum = 1,
  glow = 0,
  clickSplash = true,
  intro = true,
  contained = false,
  theme = 'dark',
  zIndex = 50,
  className = '',
  style = undefined
  // Other props from the old fluid cursor (force, swirl, shading, quality) are
  // simply ignored — React drops props we don't destructure.
}) {
  const rootRef = useRef(null);
  const layerRef = useRef(null);
  const filterId = `${useId().replace(/[:]/g, '')}-goo`;

  // Keep the latest props in a ref so the animation loop reads fresh values
  // without being torn down and rebuilt on every prop change.
  const palette = useMemo(
    () => (Array.isArray(colors) && colors.length ? colors : ['#ffffff']).map(parseColor),
    [colors]
  );
  const settingsRef = useRef({});
  settingsRef.current = {
    palette,
    rainbow,
    colorSpeed: Math.max(0, colorSpeed),
    intensity: Math.max(0, intensity),
    size: Math.max(0.2, size),
    trail: Math.max(0.3, trail),
    momentum: clamp(momentum, 0.2, 3),
    glow: clamp(glow, 0, 1),
    clickSplash,
    contained,
    light: theme === 'light'
  };

  // Chain length and the gooey blur both scale with `trail` and `size`.
  // Keep the blur low so the thread stays thin instead of bulging.
  const count = clamp(Math.round(14 + trail * 5), 10, 30);
  const blur = clamp(2 + size * 1.5, 2, 6);

  useEffect(() => {
    const layer = layerRef.current;
    const root = rootRef.current;
    if (!layer || !root) return undefined;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    // When `contained`, measure against the parent box; otherwise the viewport.
    const bounds = () => {
      if (settingsRef.current.contained) return root.getBoundingClientRect();
      return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    };

    // Per-node geometry. The head is largest; the tail tapers to a thin tip.
    const nodes = [];
    for (let i = 0; i < count; i++) {
      const falloff = 1 - i / count;
      const radius = (2 + 4.5 * settingsRef.current.size) * (0.25 + 0.75 * falloff * falloff);
      const el = document.createElement('span');
      el.className = BLOB;
      el.style.width = `${radius * 2}px`;
      el.style.height = `${radius * 2}px`;
      layer.appendChild(el);
      nodes.push({ el, radius, x: -999, y: -999 });
    }

    // Reusable pool of click droplets, drawn in the same gooey layer.
    const droplets = [];
    for (let i = 0; i < 10; i++) {
      const el = document.createElement('span');
      el.className = BLOB;
      el.style.opacity = '0';
      layer.appendChild(el);
      droplets.push({ el, life: 0, x: 0, y: 0, vx: 0, vy: 0, radius: 0 });
    }

    const rect0 = bounds();
    const pointer = {
      x: rect0.width * 0.5,
      y: rect0.height * 0.5,
      has: false
    };
    // Smoothed head position, chased by the rest of the chain.
    let headX = pointer.x;
    let headY = pointer.y;

    let raf = 0;
    let lastActivity = reduced ? -Infinity : performance.now();
    let opacity = 0;
    let introStart = intro && !reduced ? performance.now() + 120 : -1;

    const colorFor = (fraction, now) => {
      const s = settingsRef.current;
      const phase = (((fraction + (now / 1000) * s.colorSpeed * 0.25) % 1) + 1) % 1;
      let rgb;
      if (s.rainbow) {
        rgb = hsv(phase, 0.85, 1);
      } else if (s.palette.length === 1) {
        rgb = s.palette[0];
      } else {
        const pos = phase * s.palette.length;
        const from = s.palette[Math.floor(pos) % s.palette.length];
        const to = s.palette[(Math.floor(pos) + 1) % s.palette.length];
        const t = pos - Math.floor(pos);
        const blend = t * t * (3 - 2 * t);
        rgb = from.map((c, k) => Math.round(c + (to[k] - c) * blend));
      }
      if (s.light) rgb = rgb.map(c => 255 - c);
      return rgb;
    };

    const spawnDroplets = (x, y) => {
      const s = settingsRef.current;
      let spawned = 0;
      for (const drop of droplets) {
        if (drop.life > 0 || spawned >= 5) continue;
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 3;
        drop.x = x;
        drop.y = y;
        drop.vx = Math.cos(angle) * speed;
        drop.vy = Math.sin(angle) * speed;
        drop.radius = (5 + 6 * s.size) * (0.5 + Math.random() * 0.6);
        drop.life = 1;
        spawned += 1;
      }
    };

    const frame = now => {
      raf = 0;
      const s = settingsRef.current;
      const rect = bounds();

      // Scripted intro sweep so the effect announces itself on load.
      if (introStart >= 0) {
        const t = clamp((now - introStart) / 1200, 0, 1);
        if (t > 0) {
          const eased = t * t * (3 - 2 * t);
          pointer.x = rect.width * (0.2 + 0.6 * eased);
          pointer.y = rect.height * (0.5 + 0.14 * Math.sin(eased * Math.PI * 2));
          pointer.has = true;
          lastActivity = now;
        }
        if (t >= 1) introStart = -1;
      }

      // Head eases toward the pointer; momentum controls the snappiness.
      const ease = clamp(0.18 + s.momentum * 0.12, 0.1, 0.6);
      headX += (pointer.x - headX) * ease;
      headY += (pointer.y - headY) * ease;

      // Fade the whole chain in on activity, out when the pointer rests.
      const idle = (now - lastActivity) / 1000;
      const target = pointer.has && idle < 1.2 ? 1 : 0;
      opacity += (target - opacity) * 0.08;
      layer.style.opacity = opacity.toFixed(3);

      // Walk the chain: each node chases the node ahead of it.
      let px = headX;
      let py = headY;
      const link = clamp(0.5 + 0.35 / s.trail, 0.35, 0.85);
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.x < -500) {
          node.x = px;
          node.y = py;
        } else {
          node.x += (px - node.x) * link;
          node.y += (py - node.y) * link;
        }
        px = node.x;
        py = node.y;

        const rgb = colorFor(i / nodes.length, now);
        node.el.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        node.el.style.transform = `translate3d(${node.x - node.radius}px, ${node.y - node.radius}px, 0)`;
      }

      // Advance live click droplets.
      let dropletsAlive = false;
      for (const drop of droplets) {
        if (drop.life <= 0) continue;
        dropletsAlive = true;
        drop.life -= 0.02;
        drop.vx *= 0.94;
        drop.vy *= 0.94;
        drop.vy += 0.15; // gentle gravity
        drop.x += drop.vx;
        drop.y += drop.vy;
        const scale = Math.max(0, drop.life);
        const r = drop.radius * (0.4 + 0.6 * scale);
        const rgb = colorFor(0.5 + 0.5 * drop.life, now);
        drop.el.style.width = `${r * 2}px`;
        drop.el.style.height = `${r * 2}px`;
        drop.el.style.opacity = (scale * opacity).toFixed(3);
        drop.el.style.background = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        drop.el.style.transform = `translate3d(${drop.x - r}px, ${drop.y - r}px, 0)`;
        if (drop.life <= 0) drop.el.style.opacity = '0';
      }

      const resting =
        introStart < 0 && opacity < 0.01 && idle > 1.2 && !dropletsAlive && Math.hypot(pointer.x - headX, pointer.y - headY) < 0.5;
      if (resting) return; // Stop the loop entirely while idle.
      raf = requestAnimationFrame(frame);
    };

    const wake = () => {
      lastActivity = performance.now();
      if (!raf && !reduced) raf = requestAnimationFrame(frame);
    };

    const locate = (clientX, clientY) => {
      const rect = bounds();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (settingsRef.current.contained && (x < 0 || y < 0 || x > rect.width || y > rect.height)) return null;
      return { x, y };
    };

    const onMove = event => {
      const point = locate(event.clientX, event.clientY);
      if (!point) return;
      if (introStart >= 0) introStart = -1; // user took over from the intro
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.has = true;
      wake();
    };

    const onDown = event => {
      if (!settingsRef.current.clickSplash) return;
      const point = locate(event.clientX, event.clientY);
      if (!point) return;
      spawnDroplets(point.x, point.y);
      wake();
    };

    const onLeave = () => {
      lastActivity = performance.now() - 2000; // start fading out
    };

    if (!reduced) {
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerdown', onDown, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      wake();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      nodes.forEach(node => node.el.remove());
      droplets.forEach(drop => drop.el.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, intro]);

  return (
    <div
      ref={rootRef}
      className={[ROOT, className].filter(Boolean).join(' ')}
      style={{ zIndex, ...style }}
      data-contained={contained ? '' : undefined}
      aria-hidden="true"
    >
      <svg className="splash-cursor__defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        ref={layerRef}
        className={LAYER}
        style={{
          filter: `url(#${filterId})`,
          opacity: 0
        }}
      />
    </div>
  );
}

export default SplashCursor;
