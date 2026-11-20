import React, { useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Lightweight magnetic hover controller (desktop / fine pointers only).
 * Uses standard OS cursor while pulling [data-magnetic] controls subtly toward the pointer
 * and snapping them back with an elastic GSAP ease.
 */
export const CustomCursor: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.remove('has-custom-cursor');

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    let magnetEl: HTMLElement | null = null;

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
      const t = e.target as Element | null;
      if (!t || !t.closest) return;

      const mag = t.closest('[data-magnetic]') as HTMLElement | null;
      if (mag !== magnetEl) releaseMagnet();
      if (mag) {
        magnetEl = mag;
        const r = mag.getBoundingClientRect();
        const strength = parseFloat(mag.dataset.magnetic || '0.25') || 0.25;
        const dx = (e.clientX - (r.left + r.width / 2)) * strength;
        const dy = (e.clientY - (r.top + r.height / 2)) * strength;
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
        releaseMagnet();
      }
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseout', onOut);
      releaseMagnet();
    };
  }, []);

  return null;
};
