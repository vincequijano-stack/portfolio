import React, { useRef, useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   BeamsBackground
   Canvas-drawn soft diagonal light beams — no dependencies.
   Replaces the CSS blob + grid-overlay background in Hero.
───────────────────────────────────────────────────────────── */

const BEAMS = [
  { x: 0.15, y: -0.1, angle: 28,  width: 120, opacity: 0.35, speed: 0.00008 },
  { x: 0.45, y: -0.05, angle: 22, width: 160, opacity: 0.25, speed: 0.00005 },
  { x: 0.70, y: -0.15, angle: 32, width: 100, opacity: 0.30, speed: 0.00010 },
  { x: 0.25, y: 0.5,   angle: 18, width: 140, opacity: 0.20, speed: 0.00006 },
  { x: 0.85, y: 0.3,   angle: 25, width: 110, opacity: 0.25, speed: 0.00007 },
  { x: 0.55, y: 0.8,   angle: 20, width: 150, opacity: 0.18, speed: 0.00004 },
];

export default function BeamsBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);
  const startTime = useRef(performance.now());

  useEffect(() => {
    // Respect prefers-reduced-motion — skip canvas entirely
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    /* Resize handler */
    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Mouse parallax — only move 3% of canvas width/height max */
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width;
      mouse.current.y = (e.clientY - rect.top)  / rect.height;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    /* Draw one beam: a blurred linear gradient bar at an angle */
    const drawBeam = (beam, t, W, H) => {
      const parallaxX = (mouse.current.x - 0.5) * 0.03 * W;
      const parallaxY = (mouse.current.y - 0.5) * 0.03 * H;

      // Oscillate position slowly over time
      const drift = Math.sin(t * beam.speed * Math.PI * 2) * 0.06;
      const cx = (beam.x + drift + parallaxX / W) * W;
      const cy = (beam.y + drift * 0.5 + parallaxY / H) * H;

      const rad = (beam.angle * Math.PI) / 180;
      const len = Math.sqrt(W * W + H * H) * 1.1;

      // Direction vector along the beam
      const dx = Math.cos(rad) * len;
      const dy = Math.sin(rad) * len;

      // Perpendicular (for width)
      const nx = -Math.sin(rad);
      const ny =  Math.cos(rad);
      const hw = beam.width / 2;

      // Build a gradient perpendicular to the beam direction
      const gx1 = cx + nx * hw;
      const gy1 = cy + ny * hw;
      const gx2 = cx - nx * hw;
      const gy2 = cy - ny * hw;

      const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);
      grad.addColorStop(0,    `rgba(255,255,255,0)`);
      grad.addColorStop(0.4,  `rgba(255,255,255,${beam.opacity * 0.1})`);
      grad.addColorStop(0.5,  `rgba(255,255,255,${beam.opacity * 1.5})`);
      grad.addColorStop(0.6,  `rgba(255,255,255,${beam.opacity * 0.1})`);
      grad.addColorStop(1,    `rgba(255,255,255,0)`);

      ctx.save();
      ctx.filter = 'blur(6px)';
      ctx.translate(cx, cy);
      ctx.rotate(rad);

      ctx.fillStyle = grad;
      // Draw as a rotated rect spanning the full diagonal length
      ctx.fillRect(-len / 2, -hw, len, hw * 2);

      ctx.restore();
    };

    let frameCount = 0;
    const TARGET_FPS = 30;
    const FRAME_SKIP = Math.round(60 / TARGET_FPS);

    const render = (now) => {
      rafRef.current = requestAnimationFrame(render);
      frameCount++;
      if (frameCount % FRAME_SKIP !== 0) return; // Cap to ~30 fps

      const t = (now - startTime.current) * 0.001; // seconds
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw beams with a subtle fade between them
      BEAMS.forEach((beam) => drawBeam(beam, t, W, H));
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
    };
  }, []);

  return (
    <>
      {/* Canvas layer — sits behind everything in hero */}
      <canvas
        ref={canvasRef}
        className="beams-canvas"
        aria-hidden="true"
      />
      {/* Static fallback gradient for reduced-motion — CSS handles visibility */}
      <div className="beams-static-fallback" aria-hidden="true" />
    </>
  );
}
