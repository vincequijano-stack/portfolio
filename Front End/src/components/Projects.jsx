import React, { useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   BentoCard — individual magic card with spotlight + tilt
───────────────────────────────────────────────────────────── */
function BentoCard({ project, delayClass }) {
  const cardRef = useRef(null);

  /* ── Mouse tracking: spotlight + tilt ── */
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update spotlight CSS custom properties
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D tilt — max 8deg
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -8;
    const rotY = ((x - cx) / cx) * 8;
    card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    // No transform transition while actively tilting — keeps it snappy
    card.style.transition =
      'border-color 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease';
    card.classList.add('bento-hovered');
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    // Re-enable transform transition for smooth snap-back
    card.style.transition =
      'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), border-color 0.3s ease, box-shadow 0.3s ease';
    card.style.transform = '';
    card.style.setProperty('--mouse-x', '-9999px');
    card.style.setProperty('--mouse-y', '-9999px');
    card.classList.remove('bento-hovered');
  }, []);

  const isImageCard = !project.isPlaceholder;

  return (
    <article
      ref={cardRef}
      id={`bento-card-${project.area}`}
      className={`bento-card bento-card-${project.area} reveal is-visible ${delayClass}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      aria-label={project.title}
      style={{ '--mouse-x': '-9999px', '--mouse-y': '-9999px' }}
    >
      {/* ── Spotlight overlay (::before in CSS) — rendered via custom props */}

      {/* ── Top: Thumbnail / Visual ── */}
      <div className={`bento-thumb ${project.isPlaceholder ? 'bento-thumb--text' : ''}`}>
        {isImageCard ? (
          <>
            <img src={project.img} alt={project.title} loading="lazy" />
            <div className="bento-thumb-gradient" aria-hidden="true" />
          </>
        ) : (
          /* Text-only visual: large decorative number + faint grid */
          <div className="bento-text-visual" aria-hidden="true">
            <span className="bento-text-visual-num">{project.visualNum}</span>
            <svg className="bento-text-visual-grid" viewBox="0 0 200 160" fill="none">
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`v${i}`}
                  x1={i * 25} y1="0" x2={i * 25} y2="160"
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <line
                  key={`h${i}`}
                  x1="0" y1={i * 27} x2="200" y2={i * 27}
                  stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Metric badge */}
        <span className="bento-metric">{project.metric}</span>
      </div>

      {/* ── Bottom: Content ── */}
      <div className="bento-body">
        <span className="bento-eyebrow">{project.eyebrow}</span>
        <h3 className="bento-title">{project.title}</h3>
        <p className="bento-desc">{project.description}</p>

        <div className="bento-footer">
          {/* Tech tags */}
          <div className="bento-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="bento-tag">{tag}</span>
            ))}
          </div>

          {/* Action links */}
          <div className="bento-actions">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-action-btn bento-action-demo"
              aria-label={`Live demo: ${project.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Demo
            </a>
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="bento-action-btn bento-action-repo"
              aria-label={`GitHub repo: ${project.title}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
              Repo
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────────
   Projects — bento grid layout
   Grid areas:
     Row 1: p1(small)  p2(tall↓)  p3(tall↓)
     Row 2: p4(tall↓)  p2(cont.)  p3(cont.)
     Row 3: p4(cont.)  p5(small)  p6(small)
───────────────────────────────────────────────────────────── */
export default function Projects() {
  const projects = [
    {
      area: 'p1',
      eyebrow: 'SaaS · Analytics',
      title: 'Analytics Dashboard SaaS',
      description:
        'Real-time BI platform serving 10,000+ users with custom KPI widgets, team collaboration, and automated report generation.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
      metric: '↑ 42% Revenue',
      img: '/assets/images/projects/project-1.jpg',
      demo: '#',
      repo: '#',
    },
    {
      area: 'p2',
      eyebrow: 'E-Commerce · PWA',
      title: 'E-Commerce Platform',
      description:
        'Full-featured storefront with headless CMS, real-time inventory, Stripe checkout, and a custom admin panel. Mobile-first PWA.',
      tags: ['Next.js', 'Stripe', 'Sanity CMS', 'Vercel'],
      metric: '$2M+ GMV',
      img: '/assets/images/projects/project-2.jpg',
      demo: '#',
      repo: '#',
    },
    {
      area: 'p3',
      eyebrow: 'Mobile · AI',
      title: 'FitPulse Mobile App',
      description:
        'Cross-platform fitness tracker with AI workout suggestions, streak gamification, and Apple HealthKit integration.',
      tags: ['React Native', 'Expo', 'Firebase', 'ML Kit'],
      metric: '4.9★ Rating',
      img: '/assets/images/projects/project-3.jpg',
      demo: '#',
      repo: '#',
    },
    {
      area: 'p4',
      eyebrow: 'API · DevTools',
      title: 'REST API Developer Portal',
      description:
        'Self-serve API documentation hub with live sandbox environment, OAuth 2.0 authentication, and real-time rate-limit dashboards.',
      tags: ['Express', 'OpenAPI', 'Docker'],
      metric: '500ms avg',
      img: '/assets/images/projects/project-4.jpg',
      demo: '#',
      repo: '#',
    },
    {
      area: 'p5',
      eyebrow: 'AI · Chat',
      title: 'NeuralChat AI Assistant',
      description:
        'GPT-4 powered chat with persistent memory, multi-modal file uploads, and collaborative team workspaces.',
      tags: ['OpenAI', 'Python', 'FastAPI'],
      metric: '10K users',
      isPlaceholder: true,
      visualNum: '05',
      demo: '#',
      repo: '#',
    },
    {
      area: 'p6',
      eyebrow: 'Open Source · CMS',
      title: 'Portfolio CMS Builder',
      description:
        'Open-source CMS for developers to ship their portfolio in minutes using no-code templates and MDX-powered content.',
      tags: ['Astro', 'MDX', 'Netlify'],
      metric: 'Open Source',
      isPlaceholder: true,
      visualNum: '06',
      demo: '#',
      repo: '#',
    },
  ];

  const delayClasses = [
    'reveal-delay-1',
    'reveal-delay-2',
    'reveal-delay-3',
    'reveal-delay-2',
    'reveal-delay-4',
    'reveal-delay-5',
  ];

  return (
    <section id="projects" aria-labelledby="projects-heading">
      <div className="container">
        {/* Section header */}
        <div className="section-header reveal is-visible">
          <span className="section-label">Portfolio</span>
          <h2 className="section-title" id="projects-heading">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="divider" />
          <p className="section-subtitle">
            Real-world solutions built with modern technologies and production-grade practices.
          </p>
        </div>

        {/* Magic Bento Grid */}
        <div className="projects-bento" role="list">
          {projects.map((project, index) => (
            <BentoCard
              key={project.area}
              project={project}
              delayClass={delayClasses[index]}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="projects-cta reveal is-visible">
          <a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            View All Projects on GitHub
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
