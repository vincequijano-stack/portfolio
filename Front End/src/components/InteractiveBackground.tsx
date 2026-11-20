import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

export const InteractiveBackground: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      if (window.innerWidth >= 768) {
        gsap.to('[data-ambient-orb="1"]', {
          x: 26,
          y: -20,
          scale: 1.06,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
        gsap.to('[data-ambient-orb="2"]', {
          x: -22,
          y: 24,
          scale: 1.05,
          duration: 12,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 1.5,
        });
      }
    }, rootRef);

    if (!fine) {
      return () => ctx.revert();
    }

    let raf = 0;
    let mx = -1000;
    let my = -1000;

    const render = () => {
      raf = 0;
      if (spotlightRef.current) {
        spotlightRef.current.style.background = `radial-gradient(700px circle at ${mx}px ${my}px, rgba(255, 255, 255, 0.045), rgba(200, 200, 200, 0.015) 40%, transparent 75%)`;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      ctx.revert();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Subtle Architectural Monochrome Grid */}
      <div className="absolute inset-0 bg-mono-grid opacity-55" />

      {/* Slow-Moving Ambient Monochrome Lighting Orbs */}
      <div
        data-ambient-orb="1"
        className="absolute -top-40 right-[8%] w-[520px] h-[520px] rounded-full blur-[130px] opacity-20"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 200, 200, 0.26) 0%, rgba(36, 36, 36, 0.05) 60%, transparent 80%)',
        }}
      />
      <div
        data-ambient-orb="2"
        className="absolute top-[45%] -left-36 w-[500px] h-[500px] rounded-full blur-[130px] opacity-15"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(36, 36, 36, 0.05) 60%, transparent 80%)',
        }}
      />

      {/* Interactive Cursor Silver Spotlight */}
      <div
        ref={spotlightRef}
        className="fixed inset-0 transition-opacity duration-300"
      />
    </div>
  );
};
