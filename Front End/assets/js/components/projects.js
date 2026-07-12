/* ============================================================
   PROJECTS.JS
   Project card interactions — keyboard-accessible overlay
   ============================================================ */

'use strict';

function initProjects() {
  // Project cards already have CSS hover overlays.
  // This JS adds keyboard accessibility and touch support.

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const overlay = card.querySelector('.project-overlay');
    if (!overlay) return;

    // Make card focusable
    card.setAttribute('tabindex', '0');

    // Show overlay on focus (keyboard nav)
    card.addEventListener('focus', () => overlay.style.opacity = '1');
    card.addEventListener('blur',  () => overlay.style.opacity = '');

    // Touch: toggle overlay on tap
    let tapped = false;
    card.addEventListener('touchend', (e) => {
      // Only intercept if tapping the card body (not the buttons)
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      tapped = !tapped;
      overlay.style.opacity = tapped ? '1' : '';
      card.querySelector('.project-thumbnail img').style.transform = tapped ? 'scale(1.06)' : '';
    });
  });
}

initProjects();
