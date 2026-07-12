/* ============================================================
   HERO.JS
   Audience toggle pill — swaps headline + subtagline
   EDIT: Update audience content in the audienceContent object below
   ============================================================ */

'use strict';

// ── EDIT: Customize text for each audience ────────────────────
const audienceContent = {
  recruiter: {
    headline: 'Full-Stack Developer\nBuilding <span class="gradient-text">Scalable</span> Products',
    subtagline: 'Open to full-time roles — 3+ years shipping production-grade web apps.',
  },
  client: {
    headline: 'Your Vision,\nEngineered <span class="gradient-text">Brilliantly</span>',
    subtagline: 'I turn your ideas into polished, high-performance digital products.',
  },
  collaborator: {
    headline: 'Let\'s Build\n<span class="gradient-text">Something</span> Amazing',
    subtagline: 'Open source contributor & hackathon veteran — let\'s combine superpowers.',
  },
};

// ── DOM Refs ──────────────────────────────────────────────────
const audienceBtns   = document.querySelectorAll('.audience-btn');
const heroHeadline   = document.getElementById('hero-headline');
const heroSubtagline = document.getElementById('hero-subtagline');

function setAudience(audience) {
  const content = audienceContent[audience];
  if (!content || !heroHeadline || !heroSubtagline) return;

  // Fade out
  heroHeadline.style.opacity   = '0';
  heroSubtagline.style.opacity = '0';

  setTimeout(() => {
    // Swap content
    heroHeadline.innerHTML   = content.headline.replace(/\n/g, '<br>');
    heroSubtagline.textContent = content.subtagline;

    // Fade in
    heroHeadline.style.opacity   = '1';
    heroSubtagline.style.opacity = '1';
  }, 200);

  // Update active button
  audienceBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.audience === audience);
  });

  // Persist choice
  sessionStorage.setItem('portfolio-audience', audience);
}

// ── Init ──────────────────────────────────────────────────────
function initAudienceToggle() {
  if (!audienceBtns.length) return;

  audienceBtns.forEach(btn => {
    btn.addEventListener('click', () => setAudience(btn.dataset.audience));
  });

  // Restore last choice or default to 'recruiter'
  const saved = sessionStorage.getItem('portfolio-audience') || 'recruiter';
  setAudience(saved);
}

initAudienceToggle();
