import React from 'react';

export default function Hero() {
  return (
    <section id="hero" aria-label="Hero">
      <div className="hero-inner">
        {/* Left Column: Name & Role */}
        <div className="hero-text-column reveal is-visible">
          <h1 className="hero-headline">Vince Quijano</h1>
          <div className="hero-roles">
            <div className="hero-role-card">
              <h3>Software Engineer</h3>
            </div>
            <div className="hero-role-card">
              <h3>Web Developer</h3>
            </div>
            <div className="hero-role-card">
              <h3>UI/UX Design</h3>
            </div>
          </div>
        </div>

        {/* Right Column: Visuals & CTAs */}
        <div className="hero-visual-column" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          {/* Image Column */}
          <div className="hero-image-wrapper reveal is-visible" style={{ margin: '0 auto' }}>
          <div className="hero-image-outer">
            {/* Decorative ring SVG */}
            <svg
              className="geo-ring-svg"
              aria-hidden="true"
              viewBox="0 0 480 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="240"
                cy="240"
                r="220"
                stroke="url(#ringGrad)"
                strokeWidth="1"
                strokeDasharray="8 16"
              />
              <defs>
                <linearGradient
                  id="ringGrad"
                  x1="0"
                  y1="0"
                  x2="480"
                  y2="480"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%"   stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#555555" />
                </linearGradient>
              </defs>
            </svg>

            {/* Pulse rings */}
            <div className="pulse-ring" aria-hidden="true"></div>
            <div className="pulse-ring" aria-hidden="true"></div>

            <img
              src="/assets/images/headshot/headshot.jpg"
              alt="Vince Quijano — Full-Stack Developer"
              className="hero-headshot"
              width="360"
              height="360"
              loading="eager"
              style={{ objectPosition: '5% center' }}
            />

            {/* Floating Geometric Shapes — kept for extra depth above beams */}
            <div className="geo-shape geo-shape-1 shape-float-1" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon
                  points="40,4 76,62 4,62"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="rgba(255,255,255,0.05)"
                />
              </svg>
            </div>
            <div className="geo-shape geo-shape-2 shape-float-2" aria-hidden="true">
              <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect
                  x="4" y="4" width="52" height="52" rx="8"
                  stroke="#888888"
                  strokeWidth="2"
                  fill="rgba(136,136,136,0.06)"
                  transform="rotate(20 30 30)"
                />
              </svg>
            </div>
            <div className="geo-shape geo-shape-3 shape-float-3" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon
                  points="24,2 46,14 46,34 24,46 2,34 2,14"
                  stroke="#CCCCCC"
                  strokeWidth="2"
                  fill="rgba(200,200,200,0.04)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div
          className="hero-content reveal reveal-right is-visible"
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <p className="hero-subtagline" id="hero-subtagline">
            Passionate about building clean, efficient, and user-centric web applications.
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas" style={{ justifyContent: 'center' }}>
            <a href="#projects" className="btn btn-amber" id="hero-cta-projects">
              View Projects
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-teal" id="hero-cta-hire">
              Hire Me
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
