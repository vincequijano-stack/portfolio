import React, { useRef, useEffect, useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   ScrollStack — Certificates displayed as a deck of stacked
   cards that animate in as the user scrolls through the section.
   
   Technique:
   - A tall "scroll container" gives the section enough scroll
     room for each card to have its own scroll phase.
   - The cards are sticky-positioned inside it, stacking over
     each other.
   - A scroll event (or IntersectionObserver) drives a
     scrollProgress value [0..1] which we map per-card to
     scale, Y-offset, and opacity.
   
   Reduced-motion fallback: simple vertical fade-in list.
───────────────────────────────────────────────────────────── */

/* ── Cert icon (ribbon / medal SVG) ── */
function CertIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="cert-stack-icon"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

/* ── Verify icon ── */
function ExternalLinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ── Issuer icon ── */
function HeartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/* ── Single card ── */
function CertCard({ cert, style, className }) {
  return (
    <div className={`cert-stack-card ${className || ''}`} style={style}>
      {/* Top: visual area */}
      <div className="cert-stack-thumb">
        <div className="cert-stack-placeholder">
          <CertIcon />
        </div>
        <span className="cert-stack-badge">{cert.badge}</span>
      </div>

      {/* Body */}
      <div className="cert-stack-body">
        <h3 className="cert-stack-title">{cert.title}</h3>
        <div className="cert-stack-issuer">
          <HeartIcon />
          {cert.issuer}
        </div>
        <div className="cert-stack-meta">
          <span className="cert-stack-date">{cert.date}</span>
          <a
            href={cert.verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-stack-verify"
            aria-label={`Verify ${cert.title}`}
          >
            Verify <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Main export ── */
export default function ScrollStack({ certs }) {
  const sectionRef    = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1 through the whole scroll range
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  /* Scroll listener — maps section scroll progress to [0..1] */
  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect   = section.getBoundingClientRect();
      const total  = section.offsetHeight - window.innerHeight;
      // How far we've scrolled past the top of the section
      const scrolled = -rect.top;
      const p = Math.min(Math.max(scrolled / total, 0), 1);
      setProgress(p);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // init

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const n = certs.length;

  // Each card occupies 1/n of the scroll progress range
  // card i becomes "active" (fully visible) at progress = i / n
  // and starts receding at progress = (i+1) / n
  const getCardStyle = (i) => {
    if (prefersReducedMotion.current) return {};

    // Normalized position of this card [0..1] within its own range
    const cardStart = i / n;
    const cardEnd   = (i + 1) / n;
    const local     = Math.min(Math.max((progress - cardStart) / (1 / n), 0), 1);

    // Cards behind the active one (already scrolled past):
    // scale down slightly + push up slightly + reduce opacity
    const behindLocal = Math.min(Math.max((progress - cardEnd) / (1 / n), 0), 1);

    // Entry animation: slide up from 60px, fade in, scale from 0.92
    const entryY    = (1 - local) * 60;
    const entryS    = 0.92 + local * 0.08;
    const entryO    = local;

    // Recession (card gets pushed "back" in the stack as next card comes in)
    const recScaleStep = 0.04; // each card behind scales down by this
    const recYStep     = 12;   // px offset upward per depth level
    const recDepth     = Math.round(behindLocal * 1); // 0 or 1 at most

    const finalScale  = entryS   - recDepth * recScaleStep;
    const finalY      = entryY   - recDepth * recYStep;
    const finalOpacity = Math.max(entryO - recDepth * 0.15, 0);

    return {
      transform:  `translateY(${finalY}px) scale(${finalScale})`,
      opacity:    finalOpacity,
      zIndex:     i + 1,
      position:   'relative',
    };
  };

  /* Scroll-snapping height: give each card its own "screen" worth of scroll */
  const scrollHeight = `${n * 80 + 100}vh`;

  if (prefersReducedMotion.current) {
    /* Reduced-motion fallback: simple vertical list */
    return (
      <div className="cert-stack-fallback">
        {certs.map((c) => (
          <CertCard key={c.title} cert={c} className="cert-stack-static" />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sectionRef}
      className="cert-scroll-root"
      style={{ minHeight: scrollHeight }}
    >
      {/* Sticky viewport that holds the stacked cards */}
      <div className="cert-scroll-sticky">
        <div className="cert-stack-deck">
          {certs.map((cert, i) => (
            <CertCard
              key={cert.title}
              cert={cert}
              style={getCardStyle(i)}
              className="cert-stack-animated"
            />
          ))}
        </div>

        {/* Scroll progress indicator */}
        <div className="cert-scroll-dots" aria-hidden="true">
          {certs.map((_, i) => {
            const isActive = progress >= i / n && progress < (i + 1) / n;
            const isDone   = progress >= (i + 1) / n;
            return (
              <span
                key={i}
                className={`cert-dot ${isActive ? 'cert-dot-active' : ''} ${isDone ? 'cert-dot-done' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
