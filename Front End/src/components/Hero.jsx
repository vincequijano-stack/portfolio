import React, { useState } from 'react';

const audienceContent = {
  recruiter: {
    headline: 'Full-Stack Developer &<br>Software Engineer',
    subtagline:
      'Passionate about building clean, efficient, and user-centric web applications.',
  },
  client: {
    headline:
      'Your Vision,<br>Engineered <span class="gradient-text">Brilliantly</span>',
    subtagline:
      'I turn your ideas into polished, high-performance digital products.',
  },
  collaborator: {
    headline:
      "Let's Build<br><span class=\"gradient-text\">Something</span> Amazing",
    subtagline:
      'Open source contributor & hackathon veteran — let’s combine superpowers.',
  },
};

export default function Hero() {
  const [audience, setAudience] = useState('recruiter');

  return (
    <section id="hero" aria-label="Hero">
      {/* Decorative backgrounds */}
      <div className="hero-bg-blob hero-bg-blob-1" aria-hidden="true"></div>
      <div className="hero-bg-blob hero-bg-blob-2" aria-hidden="true"></div>
      <div className="hero-grid-overlay" aria-hidden="true"></div>

      <div className="hero-inner">
        {/* Content Column */}
        <div className="hero-content reveal is-visible">
          <h1
            className="hero-headline"
            id="hero-headline"
            dangerouslySetInnerHTML={{
              __html: audienceContent[audience].headline,
            }}
          />
          <p className="hero-subtagline" id="hero-subtagline">
            {audienceContent[audience].subtagline}
          </p>

          {/* CTA Buttons */}
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-amber" id="hero-cta-projects">
              View Projects
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
            <a href="#contact" className="btn btn-teal" id="hero-cta-hire">
              Hire Me
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </a>
          </div>

          {/* Social Row */}
          <div className="hero-social">
            <span className="hero-social-label">Find me on</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Image Column */}
        <div className="hero-image-wrapper reveal reveal-right is-visible">
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
                  <stop offset="0%" stopColor="#00A89C" />
                  <stop offset="100%" stopColor="#FFB84D" />
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
            />

            {/* Floating Geometric Shapes */}
            <div className="geo-shape geo-shape-1 shape-float-1" aria-hidden="true">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="40,4 76,62 4,62"
                  stroke="#00A89C"
                  strokeWidth="2"
                  fill="rgba(0,168,156,0.08)"
                />
              </svg>
            </div>
            <div className="geo-shape geo-shape-2 shape-float-2" aria-hidden="true">
              <svg
                viewBox="0 0 60 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="4"
                  y="4"
                  width="52"
                  height="52"
                  rx="8"
                  stroke="#FFB84D"
                  strokeWidth="2"
                  fill="rgba(255,184,77,0.08)"
                  transform="rotate(20 30 30)"
                />
              </svg>
            </div>
            <div className="geo-shape geo-shape-3 shape-float-3" aria-hidden="true">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="24,2 46,14 46,34 24,46 2,34 2,14"
                  stroke="#00A89C"
                  strokeWidth="2"
                  fill="rgba(0,168,156,0.06)"
                />
              </svg>
            </div>

            {/* Floating Stat Badges */}
            <div className="hero-stat-badge hero-stat-badge-1" aria-hidden="true">
              <div className="badge-icon teal">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="badge-text">
                <strong>3+ Years</strong>
                <span>Experience</span>
              </div>
            </div>
            <div className="hero-stat-badge hero-stat-badge-2" aria-hidden="true">
              <div className="badge-icon amber">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="badge-text">
                <strong>20+ Projects</strong>
                <span>Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}
