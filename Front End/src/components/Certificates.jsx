import React, { useState } from 'react';

/* ─────────────────────────────────────────────────────────────
   Certificates — Clean gallery that shows the actual PDFs
   embedded inline, with a modal lightbox for full-screen view.
───────────────────────────────────────────────────────────── */

const certs = [
  {
    id: 'ai-fluency',
    title: 'AI Fluency',
    issuer: 'Certiport',
    date: 'Aug 2026',
    pdf: '/assets/images/certificates/AI-Fluency.pdf',
    accent: '#7C3AED',
    tag: 'Artificial Intelligence',
  },
  {
    id: 'claude-101',
    title: 'Claude 101',
    issuer: 'Anthropic',
    date: 'Aug 2026',
    pdf: '/assets/images/certificates/Claude-101.pdf',
    accent: '#D97706',
    tag: 'AI / LLMs',
  },
  {
    id: 'software-engineering-python',
    title: 'Software Engineering Principles in Python',
    issuer: 'Coursera',
    date: 'Jul 2026',
    pdf: '/assets/images/certificates/Software-Engineering-Python.pdf',
    accent: '#0EA5E9',
    tag: 'Python · Software Eng.',
  },
];

/* ── External link icon ── */
function ExternalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/* ── Expand icon ── */
function ExpandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </svg>
  );
}

/* ── Close icon ── */
function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/* ── Cert Card ── */
function CertCard({ cert, onExpand }) {
  return (
    <article
      className="cert-card"
      id={`cert-card-${cert.id}`}
      style={{ '--cert-accent': cert.accent }}
    >
      {/* PDF Embed Preview */}
      <div className="cert-card-preview">
        <iframe
          src={`${cert.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          title={`Preview: ${cert.title}`}
          className="cert-card-iframe"
          loading="lazy"
        />
        {/* Overlay with expand button */}
        <div className="cert-card-overlay">
          <button
            className="cert-card-expand-btn"
            onClick={() => onExpand(cert)}
            aria-label={`Expand ${cert.title} certificate`}
          >
            <ExpandIcon />
            View Full
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="cert-card-body">
        <span className="cert-card-tag" style={{ color: cert.accent }}>{cert.tag}</span>
        <h3 className="cert-card-title">{cert.title}</h3>
        <div className="cert-card-meta">
          <span className="cert-card-issuer">{cert.issuer}</span>
          <span className="cert-card-dot" aria-hidden="true">·</span>
          <span className="cert-card-date">{cert.date}</span>
        </div>
        <a
          href={cert.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="cert-card-link"
          aria-label={`Open ${cert.title} certificate in new tab`}
        >
          Open Certificate <ExternalIcon />
        </a>
      </div>
    </article>
  );
}

/* ── Lightbox Modal ── */
function CertLightbox({ cert, onClose }) {
  if (!cert) return null;
  return (
    <div
      className="cert-lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${cert.title} certificate`}
      onClick={onClose}
    >
      <div
        className="cert-lightbox-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cert-lightbox-header">
          <div>
            <h3 className="cert-lightbox-title">{cert.title}</h3>
            <span className="cert-lightbox-issuer">{cert.issuer} · {cert.date}</span>
          </div>
          <div className="cert-lightbox-actions">
            <a
              href={cert.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="cert-lightbox-open"
              aria-label="Open in new tab"
            >
              <ExternalIcon /> Open
            </a>
            <button
              className="cert-lightbox-close"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="cert-lightbox-body">
          <iframe
            src={cert.pdf}
            title={cert.title}
            className="cert-lightbox-iframe"
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function Certificates() {
  const [activeCert, setActiveCert] = useState(null);

  return (
    <>
      <section id="certificates" aria-labelledby="certificates-heading">
        <div className="container">
          <div className="section-header reveal is-visible">
            <span className="section-label">Credentials</span>
            <h2 className="section-title" id="certificates-heading">
              Certificates &amp; <span className="gradient-text">Badges</span>
            </h2>
            <div className="divider" />
            <p className="section-subtitle">
              Verified credentials from industry-leading platforms and organizations.
            </p>
          </div>

          {/* Certificate gallery */}
          <div className="cert-gallery">
            {certs.map((cert) => (
              <CertCard
                key={cert.id}
                cert={cert}
                onExpand={setActiveCert}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeCert && (
        <CertLightbox cert={activeCert} onClose={() => setActiveCert(null)} />
      )}
    </>
  );
}
