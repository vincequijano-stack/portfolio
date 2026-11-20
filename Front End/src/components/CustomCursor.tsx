import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

/**
 * GSAP-driven custom cursor (desktop / fine pointers only).
 * - Dot uses gsap.quickSetter for zero-lag pointer tracking.
 * - Ring uses gsap.quickTo for smooth eased following.
 * - [data-magnetic] elements pull smoothly toward the pointer and snap back with elastic ease.
 * - Zero React re-renders during pointer movement.
 */
export const CustomCursor: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    const html = document.documentElement;
    html.classList.add('has-custom-cursor');

    gsap.set([dot, ring], { x: -100, y: -100 });
    const dotX = gsap.quickSetter(dot, 'x', 'px');
    const dotY = gsap.quickSetter(dot, 'y', 'px');
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });

    let visible = false;
    let magnetEl: HTMLElement | null = null;

    const setState = (cls: string, on: boolean) => root.classList.toggle(cls, on);

    const releaseMagnet = () => {
      if (magnetEl) {
        const el = magnetEl;
        magnetEl = null;
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: 'elastic.out(1, 0.4)',
          overwrite: 'auto',
          clearProps: 'transform',
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      if (!visible) {
        visible = true;
        gsap.set(ring, { x: mx, y: my });
        setState('is-visible', true);
      }

      dotX(mx);
      dotY(my);
      ringX(mx);
      ringY(my);

      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      const isText = !!t.closest('input, textarea, select, [contenteditable="true"]');
      const isView = !isText && !!t.closest('[data-cursor="view"]');
      const isHover =
        !isText && !isView && !!t.closest('a, button, [role="button"], label, [data-cursor]');
      setState('is-text', isText);
      setState('is-view', isView);
      setState('is-hover', isHover);

      const mag = t.closest('[data-magnetic]') as HTMLElement | null;
      if (mag !== magnetEl) releaseMagnet();
      if (mag) {
        magnetEl = mag;
        const r = mag.getBoundingClientRect();
        const strength = parseFloat(mag.dataset.magnetic || '0.25') || 0.25;
        const dx = (mx - (r.left + r.width / 2)) * strength;
        const dy = (my - (r.top + r.height / 2)) * strength;
        gsap.to(mag, {
          x: dx,
          y: dy,
          duration: 0.3,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      }
    };

    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        visible = false;
        setState('is-visible', false);
        releaseMagnet();
      }
    };
    const onDown = () => setState('is-down', true);
    const onUp = () => setState('is-down', false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      releaseMagnet();
      html.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span className="cursor-label">View</span>
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
};
