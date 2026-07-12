/* ============================================================
   MAIN.JS
   App init: dark mode toggle, scroll effects, hamburger menu,
   active nav highlighting, scroll-triggered reveal animations
   ============================================================ */

'use strict';

// ── Dark Mode Toggle ──────────────────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function initTheme() {
  const saved = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', theme === 'light' ? 'light' : '');
}

function toggleTheme() {
  const isLight = root.getAttribute('data-theme') === 'light';
  const next = isLight ? '' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
}

if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

initTheme();

// ── Sticky Header Shadow on Scroll ────────────────────────────
const header = document.getElementById('header');

function handleHeaderScroll() {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
}

window.addEventListener('scroll', handleHeaderScroll, { passive: true });

// ── Active Nav Highlighting ───────────────────────────────────
const navLinks = document.querySelectorAll('.header-nav a, .mobile-nav a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  let currentSection = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSection = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });

// ── Hamburger Menu ────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobile-nav');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

function toggleMobileNav() {
  const open = hamburger.classList.toggle('is-open');
  mobileNav.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

function closeMobileNav() {
  hamburger.classList.remove('is-open');
  mobileNav.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (hamburger) hamburger.addEventListener('click', toggleMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

// ── Scroll-Triggered Reveal Animations ───────────────────────
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Optionally unobserve for performance:
      // revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -60px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ── Highlight underline trigger ───────────────────────────────
const highlights = document.querySelectorAll('.highlight-underline');
const hlObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.5 });

highlights.forEach(el => hlObserver.observe(el));

// ── Back to Top ───────────────────────────────────────────────
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── Progress bar (reading progress) ──────────────────────────
const progressBar = document.getElementById('reading-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

// ── Smooth scroll for all internal anchor links ───────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  });
});
