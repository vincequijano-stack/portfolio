import React from 'react';

export default function About() {
  const skills = [
    'React',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'AWS',
    'Docker',
    'GraphQL',
    'Next.js',
    'Python',
    'Redis',
  ];

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
              <strong>React, Node.js, and cloud infrastructure</strong>, and I love the intersection of
              design and engineering.
            </p>
            <p>
              I've shipped apps used by tens of thousands of users, led engineering teams at two startups,
              and consulted for businesses across fintech, ed-tech, and e-commerce. When I'm not coding,
              you'll find me speaking at developer conferences or contributing to open source.
            </p>

            <div className="about-skills">
              {skills.map((skill) => (
                <span key={skill} className="tag">
                  {skill}
                </span>
              ))}
            </div>

            <div className="about-cta-row reveal is-visible">
              <a href="#projects" className="btn btn-amber">
                View My Work
              </a>
              <a href="#contact" className="btn btn-ghost">
                Let's Talk
              </a>
            </div>
          </div>

          {/* Right: Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card reveal reveal-delay-1 is-visible">
              <div className="stat-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="stat-value">3+</div>
              <div className="stat-label">Years Coding</div>
            </div>

            <div className="stat-card reveal reveal-delay-2 is-visible">
              <div className="stat-icon amber">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </div>
              <div className="stat-value">CS</div>
              <div className="stat-label">Major</div>
            </div>

            <div className="stat-card reveal reveal-delay-3 is-visible">
              <div className="stat-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                TS · Py
              </div>
              <div className="stat-label">Top Languages</div>
            </div>

            <div className="stat-card reveal reveal-delay-4 is-visible">
              <div className="stat-icon amber">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="stat-value" style={{ fontSize: '1.4rem' }}>
                Open
              </div>
              <div className="stat-label">Availability</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
