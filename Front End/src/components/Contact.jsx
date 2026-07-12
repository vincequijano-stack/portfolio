import React, { useState } from 'react';

const BACKEND_URL = 'http://localhost:3001/api/contact';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    intent: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    let error = '';
    const trimmed = value.trim();

    if (!trimmed && name !== 'intent') {
      error = 'This field is required.';
    } else if (name === 'intent' && !value) {
      error = 'Please select an option.';
    } else if (
      name === 'email' &&
      trimmed &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    ) {
      error = 'Please enter a valid email address.';
    } else if (name === 'message' && trimmed.length > 0 && trimmed.length < 10) {
      error = 'Message must be at least 10 characters.';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    const isIntentValid = validateField('intent', formData.intent);
    const isMessageValid = validateField('message', formData.message);

    if (!isNameValid || !isEmailValid || !isIntentValid || !isMessageValid) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      setStatus({
        type: 'success',
        message: "✓ Message sent! I'll get back to you within 24 hours.",
      });
      setFormData({ name: '', email: '', intent: '', message: '' });
      setErrors({});
    } catch (err) {
      setStatus({
        type: 'error',
        message:
          'Something went wrong sending your message. Please try again later or email directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact-grid">
          {/* Left: Info */}
          <div className="contact-info reveal reveal-left is-visible">
            <span className="section-label">Get In Touch</span>
            <h2 id="contact-heading">
              Let's Work<br />
              <span className="gradient-text">Together</span>
            </h2>
            <div
              className="divider"
              style={{ marginLeft: 0, marginRight: 'auto' }}
            ></div>

            <p style={{ marginTop: '24px' }}>
              Whether you have a project in mind, a role to fill, or just want to chat tech — my inbox is open. I
              typically respond within 24 hours.
            </p>

            <div className="contact-items">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>Email</strong>
                  <span>vincelawrencequijano@gmail.com</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>Location</strong>
                  <span>Remote-first · Open to travel</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="contact-item-text">
                  <strong>Response Time</strong>
                  <span>Within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="contact-social">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter/X"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://dev.to"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dev.to blog"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-form-wrapper reveal reveal-right is-visible">
            {status.message && (
              <div
                id="form-status"
                className={`form-status ${status.type}`}
                role="alert"
                aria-live="polite"
                style={{
                  display: 'block',
                  color: status.type === 'error' ? '#EF4444' : undefined,
                }}
              >
                {status.message}
              </div>
            )}

            <form id="contact-form" noValidate onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    className="form-input"
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor: errors.name ? '#EF4444' : undefined,
                    }}
                  />
                  {errors.name && (
                    <span
                      className="field-error"
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#EF4444',
                        marginTop: '4px',
                      }}
                    >
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Email <span>*</span>
                  </label>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    className="form-input"
                    placeholder="you@company.com"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{
                      borderColor: errors.email ? '#EF4444' : undefined,
                    }}
                  />
                  {errors.email && (
                    <span
                      className="field-error"
                      style={{
                        display: 'block',
                        fontSize: '0.75rem',
                        color: '#EF4444',
                        marginTop: '4px',
                      }}
                    >
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-intent">
                  I want to… <span>*</span>
                </label>
                <select
                  id="contact-intent"
                  name="intent"
                  className="form-select"
                  required
                  value={formData.intent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderColor: errors.intent ? '#EF4444' : undefined,
                  }}
                >
                  <option value="" disabled>
                    Select intent
                  </option>
                  <option value="hire-fulltime">Hire you full-time</option>
                  <option value="hire-contract">Hire you for contract work</option>
                  <option value="consulting">Book a consulting session</option>
                  <option value="speaking">Invite you to speak</option>
                  <option value="collaborate">Collaborate on a project</option>
                  <option value="other">Something else</option>
                </select>
                {errors.intent && (
                  <span
                    className="field-error"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '4px',
                    }}
                  >
                    {errors.intent}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message <span>*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-textarea"
                  placeholder="Tell me about your project, timeline, and budget…"
                  required
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{
                    borderColor: errors.message ? '#EF4444' : undefined,
                  }}
                ></textarea>
                {errors.message && (
                  <span
                    className="field-error"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      marginTop: '4px',
                    }}
                  >
                    {errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                id="form-submit"
                className="form-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: 'spin-slow 1s linear infinite' }}
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>

              <p className="privacy-note">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Your information is private and will never be shared with third parties.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
