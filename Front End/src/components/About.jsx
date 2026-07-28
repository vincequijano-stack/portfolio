import React from 'react';
import LogoLoop from './LogoLoop';

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <div className="container">
        <div className="about-grid">
          {/* Left: Bio */}
          <div className="about-bio" id="about-bio">
            <span className="section-label">About Me</span>
            <h2 id="about-heading">
              The Developer<br />Behind the Code
            </h2>
            <div className="divider"></div>

            <p>
              Hey, I'm <strong>Vince Quijano</strong> — a full-stack developer with a passion for building
              products that are as beautiful under the hood as they are on screen. I specialize in{' '}
              <strong>full-stack development across Java, Python, Node.js, and Go, with a strong focus on clean UI/UX</strong>.
            </p>
            <p>
              I've shipped apps used by tens of thousands of users, led engineering teams at two startups,
              and consulted for businesses across fintech, ed-tech, and e-commerce. When I'm not coding,
              you'll find me speaking at developer conferences or contributing to open source.
            </p>

            {/* ── Logo Loop replaces skill pills ── */}
            <LogoLoop />

            <div className="about-cta-row reveal is-visible">
              <a href="#projects" className="btn btn-amber">
                View My Work
              </a>
              <a href="#contact" className="btn btn-ghost">
                Let's Talk
              </a>
            </div>

            <div className="about-social" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
              <span className="hero-social-label" style={{ color: 'var(--text-muted)' }}>Find me on</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-link"
                aria-label="Twitter / X"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                  viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Role Badges */}
          <div className="stat-cards" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
            <div className="stat-card reveal reveal-delay-1 is-visible" style={{ padding: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#F5F5F5' }}>Software Engineer</h3>
            </div>
            <div className="stat-card reveal reveal-delay-2 is-visible" style={{ padding: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#F5F5F5' }}>Web Developer</h3>
            </div>
            <div className="stat-card reveal reveal-delay-3 is-visible" style={{ padding: '2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#F5F5F5' }}>UI/UX Design</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
