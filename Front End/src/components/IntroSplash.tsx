import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from '../lib/gsap';

interface IntroSplashProps {
  /** Fired the moment the curtain starts opening — triggers Hero GSAP timeline. */
  onReveal?: () => void;
  /** Fired once the curtain has fully opened and the intro can be unmounted. */
  onComplete: () => void;
}

const NAME = 'VINCE QUIJANO';

export const IntroSplash: React.FC<IntroSplashProps> = ({ onReveal, onComplete }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const exitingRef = useRef(false);
  const revealRef = useRef(onReveal);
  const completeRef = useRef(onComplete);
  revealRef.current = onReveal;
  completeRef.current = onComplete;

  const runExit = useCallback((fast = false) => {
    if (exitingRef.current) return;
    exitingRef.current = true;

    const root = rootRef.current;
    if (!root) {
      revealRef.current?.();
      completeRef.current();
      return;
    }

    root.style.pointerEvents = 'none';
    // Trigger hero entrance simultaneously behind the opening curtain
    revealRef.current?.();

    const exitTl = gsap.timeline({
      onComplete: () => completeRef.current(),
    });

    exitTl
      .to(
        [
          root.querySelector('.intro-content'),
          root.querySelector('.intro-skip'),
          root.querySelector('.intro-seam'),
        ],
        {
          opacity: 0,
          scale: 0.96,
          y: -10,
          duration: fast ? 0.18 : 0.28,
          ease: 'power2.in',
        }
      )
      .to(
        root.querySelector('.intro-curtain-top'),
        {
          yPercent: -102,
          duration: fast ? 0.42 : 0.88,
          ease: 'expo.inOut',
        },
        '-=0.08'
      )
      .to(
        root.querySelector('.intro-curtain-bottom'),
        {
          yPercent: 102,
          duration: fast ? 0.42 : 0.88,
          ease: 'expo.inOut',
        },
        '<'
      );
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        runExit(true);
      }
    };
    window.addEventListener('keydown', onKey);

    if (reduce) {
      const quickTimer = window.setTimeout(() => runExit(true), 220);
      return () => {
        window.clearTimeout(quickTimer);
        window.removeEventListener('keydown', onKey);
        document.body.style.overflow = prevOverflow;
      };
    }

    const ctx = gsap.context(() => {
      gsap.set('.intro-seam', { scaleX: 0, opacity: 0 });
      gsap.set('.intro-logo', { opacity: 0, scale: 0.82, y: 14 });
      gsap.set('.intro-char', { opacity: 0, y: 16 });
      gsap.set('.intro-line-fill', { scaleX: 0 });
      gsap.set('.intro-tag', { opacity: 0, y: 6 });

      const tl = gsap.timeline();
      tl.to('.intro-seam', {
        scaleX: 1,
        opacity: 0.65,
        duration: 0.55,
        ease: 'power3.out',
      })
        .to(
          '.intro-logo',
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.65,
            ease: 'expo.out',
          },
          0.08
        )
        .to(
          '.intro-char',
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.032,
            ease: 'power3.out',
          },
          0.26
        )
        .to(
          '.intro-line-fill',
          {
            scaleX: 1,
            duration: 1.0,
            ease: 'power2.inOut',
          },
          0.35
        )
        .to(
          '.intro-tag',
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'power2.out',
          },
          0.55
        )
        .call(() => runExit(false), undefined, 1.58);
    }, rootRef);

    return () => {
      ctx.revert();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [runExit]);

  return (
    <div
      ref={rootRef}
      className="intro-root"
      onClick={() => runExit(true)}
      role="dialog"
      aria-modal="true"
      aria-label="Vince Quijano portfolio intro"
    >
      {/* Curtain panels that split open via GSAP */}
      <div className="intro-curtain intro-curtain-top" />
      <div className="intro-curtain intro-curtain-bottom" />
      <span className="intro-seam" />

      <div className="intro-content">
        {/* VQ monogram */}
        <div className="intro-logo">
          <svg viewBox="0 0 76 46" className="w-16 h-10 sm:w-20 sm:h-12" aria-hidden="true">
            <defs>
              <linearGradient id="introVqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="55%" stopColor="#D4D4D4" />
                <stop offset="100%" stopColor="#8A8A8A" />
              </linearGradient>
            </defs>
            <path d="M1 3 L11 3 L21 32 L31 3 L41 3 L25.5 43 L16.5 43 Z" fill="#FFFFFF" />
            <path
              d="M52 2 C64.5 2 73 10.5 73 22.5 C73 29 70 34.8 64.8 38.4 L72 44.5 L61.5 44.5 L56.8 40.5 C55.2 41 53.6 41.3 52 41.3 C39.5 41.3 31 32.8 31 21.5 C31 10.5 39.5 2 52 2 Z M52 10.8 C44.8 10.8 40.2 15.2 40.2 21.5 C40.2 27.8 44.8 32.5 52 32.5 C54 32.5 55.8 32 57.4 31.1 L50.8 25.5 L59.5 25.5 L61.8 27.5 C62.7 25.8 63.2 23.8 63.2 21.5 C63.2 15.2 59.2 10.8 52 10.8 Z"
              fill="url(#introVqGrad)"
            />
          </svg>
        </div>

        {/* Letter-by-letter name */}
        <div className="intro-name" aria-label={NAME}>
          {NAME.split('').map((c, i) => (
            <span key={i} className="intro-char" aria-hidden="true">
              {c === ' ' ? '\u00A0' : c}
            </span>
          ))}
        </div>

        {/* Horizontal loading line */}
        <div className="intro-line">
          <span className="intro-line-fill" />
        </div>

        <p className="intro-tag">CODE &nbsp;•&nbsp; ANALYZE &nbsp;•&nbsp; INNOVATE</p>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          runExit(true);
        }}
        className="intro-skip"
      >
        SKIP
      </button>
    </div>
  );
};
