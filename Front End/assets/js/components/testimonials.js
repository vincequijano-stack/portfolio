/* ============================================================
   TESTIMONIALS.JS
   Horizontal slider with prev/next arrows and dot pagination
   ============================================================ */

'use strict';

function initTestimonialsSlider() {
  const track  = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.getElementById('slider-dots');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!track || !slides.length) return;

  let current = 0;
  let autoplay = null;

  // ── Build dots ───────────────────────────────────────────────
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer?.appendChild(dot);
  });

  function getDots() {
    return dotsContainer?.querySelectorAll('.slider-dot') || [];
  }

  // ── Navigate ─────────────────────────────────────────────────
  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    getDots().forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  // ── Arrow buttons ─────────────────────────────────────────────
  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  // ── Autoplay ──────────────────────────────────────────────────
  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  startAutoplay();

  // ── Pause on hover ────────────────────────────────────────────
  const wrapper = document.querySelector('.testimonials-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  // ── Touch / swipe support ─────────────────────────────────────
  let touchStartX = 0;
  let touchEndX   = 0;

  track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAutoplay();
    }
  });
}

initTestimonialsSlider();
