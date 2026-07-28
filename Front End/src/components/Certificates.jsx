import React from 'react';
import ScrollStack from './ScrollStack';

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

        {/* Scroll Stack replaces static grid */}
        <ScrollStack certs={certs} />
      </div>
    </section>
  );
}
