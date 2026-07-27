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
            <span className="gradient-text">Services</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Tailored engagements for teams and businesses at any stage.
          </p>
        </div>

        <div className="services-grid">
          {/* Service 1: UI/UX Design */}
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
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <h3 className="service-title">UI/UX Design</h3>
            <p className="service-desc">
              Designing clean, intuitive interfaces and user flows for web and mobile products.
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
                Wireframing
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
                Prototyping
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
                User research
              </li>
            </ul>
            <div className="service-footer" style={{ justifyContent: 'center' }}>
              <a href="#contact" className="service-cta amber" style={{ width: '100%', textAlign: 'center' }}>
                Let's Talk
              </a>
            </div>
          </div>

          {/* Service 2: Web Development (featured) */}
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
            <h3 className="service-title">Web Development</h3>
            <p className="service-desc">
              Building responsive, performant websites and web apps from front end to back end.
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
                Responsive builds
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
                API integration
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
                Cross-browser testing
              </li>
            </ul>
            <div className="service-footer" style={{ justifyContent: 'center' }}>
              <a href="#contact" className="service-cta teal" style={{ width: '100%', textAlign: 'center' }}>
                Let's Talk
              </a>
            </div>
          </div>

          {/* Service 3: Software Design */}
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
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h3 className="service-title">Software Design</h3>
            <p className="service-desc">
              Architecting maintainable, scalable software systems and solutions.
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
                System architecture
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
                Database design
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
                Code review
              </li>
            </ul>
            <div className="service-footer" style={{ justifyContent: 'center' }}>
              <a href="#contact" className="service-cta amber" style={{ width: '100%', textAlign: 'center' }}>
                Let's Talk
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
