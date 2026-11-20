import React, { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

interface ScrollEffectsProps {
  refreshKey?: string;
}

/**
 * GSAP ScrollTrigger progress bar + desktop image parallax.
 * Native scrolling is never hijacked.
 */
export const ScrollEffects: React.FC<ScrollEffectsProps> = ({ refreshKey }) => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.15,
          },
        });
      }
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || '0.04') || 0.04;
        const shift = Math.round(speed * 500);
        gsap.fromTo(
          el,
          { y: shift },
          {
            y: -shift,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement || el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, [refreshKey]);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  );
};
