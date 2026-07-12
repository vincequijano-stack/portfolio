/* ============================================================
   CONTACT.JS
   Form validation + submit to backend POST /api/contact
   EDIT: Update BACKEND_URL if deploying to production
   ============================================================ */

'use strict';

// EDIT: Change this to your deployed backend URL in production
const BACKEND_URL = 'http://localhost:3001/api/contact';

function initContactForm() {
  const form       = document.getElementById('contact-form');
  const statusEl   = document.getElementById('form-status');
  const submitBtn  = document.getElementById('form-submit');

  if (!form) return;

  // ── Field validation ──────────────────────────────────────────
  function validateField(input) {
    const value = input.value.trim();
    let error = '';

    if (input.required && !value) {
      error = 'This field is required.';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Please enter a valid email address.';
    } else if (input.name === 'message' && value.length > 0 && value.length < 10) {
      error = 'Message must be at least 10 characters.';
    }

    // Show/hide inline error
    let errorEl = input.parentElement.querySelector('.field-error');
    if (error) {
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        errorEl.style.cssText = 'display:block;font-size:0.75rem;color:#EF4444;margin-top:4px;';
        input.parentElement.appendChild(errorEl);
      }
      errorEl.textContent = error;
      input.style.borderColor = '#EF4444';
      return false;
    } else {
      errorEl?.remove();
      input.style.borderColor = '';
      return true;
    }
  }

  // Validate on blur
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => validateField(field));
  });

  // ── Form submit ───────────────────────────────────────────────
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const fields = form.querySelectorAll('input, select, textarea');
    let valid = true;
    fields.forEach(field => { if (!validateField(field)) valid = false; });
    if (!valid) return;

    // Collect data
    const formData = {
      name:    form.name?.value?.trim(),
      email:   form.email?.value?.trim(),
      intent:  form.intent?.value,
      message: form.message?.value?.trim(),
    };

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
           style="animation:spin-slow 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Sending…`;
    statusEl.className = 'form-status';
    statusEl.style.display = 'none';

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      statusEl.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
      statusEl.className = 'form-status success';
      statusEl.style.display = 'block';
      form.reset();

    } catch (err) {
      // Fallback: show mailto link if backend unavailable
      statusEl.innerHTML = `
        ⚠ Backend unavailable — 
        <a href="mailto:vincelawrencequijano@gmail.com?subject=Portfolio Contact&body=Name: ${encodeURIComponent(formData.name)}%0AMessage: ${encodeURIComponent(formData.message)}"
           style="color:inherit;font-weight:700;text-decoration:underline">
           send via email instead
         </a>`;
      statusEl.className = 'form-status error';
      statusEl.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        Send Message
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>`;
    }
  });
}

initContactForm();
