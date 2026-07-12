import React from 'react';

export default function Certificates() {
  const certs = [
    {
      badge: 'AWS',
      title: 'AWS Solutions Architect — Associate',
      issuer: 'Amazon Web Services',
      date: 'Issued Jan 2024',
      verifyUrl: '#',
    },
    {
      badge: 'Google',
      title: 'Google Professional Cloud Developer',
      issuer: 'Google Cloud',
      date: 'Issued Jun 2023',
      verifyUrl: '#',
    },
    {
      badge: 'Meta',
      title: 'Meta Front-End Developer Professional',
      issuer: 'Meta / Coursera',
      date: 'Issued Mar 2023',
      verifyUrl: '#',
    },
  ];

  return (
    <section id="certificates" aria-labelledby="certificates-heading">
      <div className="container">
        <div className="section-header reveal is-visible">
          <span className="section-label">Credentials</span>
          <h2 className="section-title" id="certificates-heading">
            Certificates &amp; <span className="gradient-text">Badges</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">
            Verified credentials from industry-leading platforms and organizations.
          </p>
        </div>

        <div className="certs-grid">
          {certs.map((c, idx) => (
            <div
              key={c.title}
              className={`cert-card reveal reveal-delay-${idx + 1} hover-lift is-visible`}
            >
              <div className="cert-thumbnail">
                <div className="cert-placeholder">
                  <svg
                    className="cert-placeholder-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="6" />
                    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                </div>
                <span className="cert-badge-overlay">{c.badge}</span>
              </div>
              <div className="cert-body">
                <h3 className="cert-title">{c.title}</h3>
                <div className="cert-issuer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {c.issuer}
                </div>
                <div className="cert-meta">
                  <span className="cert-date">{c.date}</span>
                  <a
                    href={c.verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-verify-link"
                  >
                    Verify
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
