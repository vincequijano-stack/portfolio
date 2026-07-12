import React, { useState } from 'react';

export default function Projects() {
  const [activeCard, setActiveCard] = useState(null);

  const handleCardTouch = (index, e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
    setActiveCard(activeCard === index ? null : index);
  };

  const largeProjects = [
    {
      title: 'Analytics Dashboard SaaS',
      metric: '↑ 42% Revenue',
      img: '/assets/images/projects/project-1.jpg',
      summary:
        'Real-time business intelligence platform serving 10,000+ users with custom KPI widgets, team collaboration, and automated report generation.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      demo: '#',
      repo: '#',
    },
    {
      title: 'E-Commerce Platform',
      metric: '$2M+ GMV',
      img: '/assets/images/projects/project-2.jpg',
      summary:
        'Full-featured storefront with headless CMS, real-time inventory, Stripe checkout, and a custom admin panel. Mobile-first PWA.',
      tags: ['Next.js', 'Stripe', 'Sanity CMS', 'Vercel'],
      demo: '#',
      repo: '#',
    },
    {
      title: 'FitPulse Mobile App',
      metric: '4.9★ Rating',
      img: '/assets/images/projects/project-3.jpg',
      summary:
        'Cross-platform fitness tracker with AI workout suggestions, streak gamification, and Apple HealthKit integration.',
      tags: ['React Native', 'Expo', 'Firebase', 'ML Kit'],
      demo: '#',
      repo: '#',
    },
  ];

  const smallProjects = [
    {
      title: 'REST API Developer Portal',
      metric: '500ms avg',
      img: '/assets/images/projects/project-4.jpg',
      summary:
        'Self-serve API docs with live sandbox, OAuth 2.0, and rate-limit dashboards.',
      tags: ['Express', 'OpenAPI', 'Docker'],
      demo: '#',
      repo: '#',
    },
    {
      title: 'NeuralChat AI Assistant',
      metric: '10K users',
      img: '/assets/images/projects/project-5.jpg',
      summary:
        'GPT-4 powered chat with memory, multi-modal file uploads, and team workspaces.',
      tags: ['OpenAI', 'Python', 'FastAPI'],
      demo: '#',
      repo: '#',
    },
    {
      title: 'Portfolio CMS Builder',
      metric: 'Open Source',
      isPlaceholder: true,
      summary:
        'Open-source CMS for developers to ship their portfolio in minutes with no-code templates.',
      tags: ['Astro', 'MDX', 'Netlify'],
      demo: '#',
      repo: '#',
    },
  ];

  const renderOverlay = (p) => (
    <div className="project-overlay" aria-hidden="true">
      <a
        href={p.demo}
        target="_blank"
        rel="noopener noreferrer"
        className="overlay-btn overlay-btn-demo"
      >
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
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        Live Demo
      </a>
      <a
        href={p.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="overlay-btn overlay-btn-repo"
      >
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
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
        Repo
      </a>
    </div>
  );

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <div className="container">
        <div className="section-header reveal is-visible">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title" id="projects-heading">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="divider"></div>
          <p className="section-subtitle">
            Real-world solutions built with modern technologies and production-grade practices.
          </p>
        </div>

        {/* Large Cards (top row) */}
        <div className="projects-grid-large">
          {largeProjects.map((p, idx) => (
            <article
              key={p.title}
              className={`project-card reveal reveal-delay-${idx + 1} is-visible`}
              tabIndex={0}
              onTouchEnd={(e) => handleCardTouch(`L-${idx}`, e)}
            >
              <div className="project-thumbnail">
                <img src={p.img} alt={p.title} loading="lazy" />
                <span className="project-metric">{p.metric}</span>
                {renderOverlay(p)}
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-summary">{p.summary}</p>
                <div className="project-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Smaller Cards (bottom row) */}
        <div className="projects-grid-small">
          {smallProjects.map((p, idx) => (
            <article
              key={p.title}
              className={`project-card reveal reveal-delay-${idx + 1} is-visible`}
              tabIndex={0}
              onTouchEnd={(e) => handleCardTouch(`S-${idx}`, e)}
            >
              <div className="project-thumbnail">
                {p.isPlaceholder ? (
                  <div
                    className="cert-placeholder"
                    style={{
                      height: '160px',
                      background:
                        'linear-gradient(135deg, var(--bg-primary), var(--color-navy-light))',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--color-teal)', opacity: 0.4 }}
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                ) : (
                  <img src={p.img} alt={p.title} loading="lazy" />
                )}
                <span className="project-metric">{p.metric}</span>
                {renderOverlay(p)}
              </div>
              <div className="project-body">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-summary">{p.summary}</p>
                <div className="project-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="projects-cta reveal is-visible">
          <a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            View All Projects on GitHub
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
        </div>
      </div>
    </section>
  );
}
