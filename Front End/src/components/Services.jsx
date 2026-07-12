import React from 'react';

export default function Services() {
  return (
    <section id="services" aria-labelledby="services-heading">
      {/* Decorative rings */}
      <div className="services-bg-ring services-bg-ring-1" aria-hidden="true"></div>
      <div className="services-bg-ring services-bg-ring-2" aria-hidden="true"></div>

      <div className="container">
        <div className="section-header reveal is-visible">
          <span className="section-label">What I Offer</span>
          <h2 className="section-title" id="services-heading" style={{ color: '#fff' }}>
            Services <span className="gradient-text">&amp; Rates</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Tailored engagements for teams and businesses at any stage.
          </p>
        </div>

        <div className="services-grid">
          {/* Service 1: Consulting */}
          <div className="service-card reveal reveal-delay-1 is-visible">
            <div className="service-icon amber">
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
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <h3 className="service-title">Tech Consulting</h3>
            <p className="service-desc">
              Architecture reviews, stack decisions, hiring strategy, and roadmap planning for
              early-stage and scaling startups.
            </p>
            <ul className="service-features">
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Architecture review
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Tech stack selection
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Team augmentation
              </li>
            </ul>
            <div className="service-footer">
              <div>
                <div className="service-price amber">
                  $200
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>/hr</span>
                </div>
                <div className="service-price-label">Starting rate</div>
              </div>
              <a href="#contact" className="service-cta amber">
                Book Call
              </a>
            </div>
          </div>

          {/* Service 2: Contract Dev (featured) */}
          <div className="service-card featured reveal reveal-delay-2 is-visible">
            <div className="service-icon teal">
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
            <h3 className="service-title">Contract Development</h3>
            <p className="service-desc">
              End-to-end feature development, API integrations, performance optimization, and
              technical debt reduction on retainer.
            </p>
            <ul className="service-features">
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Full-stack development
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                API integrations
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                CI/CD &amp; DevOps
              </li>
            </ul>
            <div className="service-footer">
              <div>
                <div className="service-price teal">
                  $150
                  <span style={{ fontSize: '1rem', fontWeight: 500 }}>/hr</span>
                </div>
                <div className="service-price-label">Or fixed project rate</div>
              </div>
              <a href="#contact" className="service-cta teal">
                Get Quote
              </a>
            </div>
          </div>

          {/* Service 3: Speaking / Talks */}
          <div className="service-card reveal reveal-delay-3 is-visible">
            <div className="service-icon amber">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 11l19-9-9 19-2-8-8-2z" />
              </svg>
            </div>
            <h3 className="service-title">Speaking Engagements</h3>
            <p className="service-desc">
              Conference talks, workshops, and podcast appearances on full-stack development, AI
              tooling, and developer productivity.
            </p>
            <ul className="service-features">
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Keynote &amp; panel talks
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Live workshops
              </li>
              <li>
                <span className="feature-check">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Podcast interviews
              </li>
            </ul>
            <div className="service-footer">
              <div>
                <div className="service-price amber">Custom</div>
                <div className="service-price-label">Per engagement</div>
              </div>
              <a href="#contact" className="service-cta amber">
                Invite Me
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
