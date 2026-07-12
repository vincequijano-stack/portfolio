/* ============================================================
   ROUTES/CONTACT.JS
   POST /api/contact — validate → send email via Nodemailer
   EDIT: Customize email templates below
   ============================================================ */

'use strict';

const express   = require('express');
const router    = express.Router();
const nodemailer = require('nodemailer');

// ── Nodemailer Transporter ────────────────────────────────────
// EDIT: configure SMTP via .env variables (see .env.example)
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Input Sanitization ────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── POST /api/contact ─────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, intent, message } = req.body;

  // ── Server-side validation ────────────────────────────────
  const errors = [];
  if (!sanitize(name))          errors.push('Name is required.');
  if (!isValidEmail(email))     errors.push('Valid email is required.');
  if (!sanitize(intent))        errors.push('Intent is required.');
  if (!sanitize(message) || message.length < 10) errors.push('Message must be at least 10 characters.');

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  const cleanName    = sanitize(name);
  const cleanEmail   = sanitize(email);
  const cleanIntent  = sanitize(intent);
  const cleanMessage = sanitize(message);

  // ── Build Email ───────────────────────────────────────────
  // EDIT: Customize the email HTML template below
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background:#0B2340; color:#F0F6FF; margin:0; padding:0; }
        .wrap { max-width:600px; margin:32px auto; background:#112C52; border-radius:12px; overflow:hidden; }
        .header { background:linear-gradient(135deg,#00A89C,#0B2340); padding:32px; text-align:center; }
        .header h1 { margin:0; font-size:24px; color:#fff; }
        .body { padding:32px; }
        .field { margin-bottom:20px; }
        .label { font-size:12px; font-weight:700; color:#00A89C; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:4px; }
        .value { font-size:16px; color:#F0F6FF; line-height:1.6; }
        .message { background:#0B2340; border-left:3px solid #FFB84D; padding:16px; border-radius:0 8px 8px 0; }
        .footer { padding:20px 32px; font-size:12px; color:#6B8EAB; border-top:1px solid rgba(255,255,255,0.08); }
      </style>
    </head>
    <body>
      <div class="wrap">
        <div class="header"><h1>📬 New Portfolio Inquiry</h1></div><!-- EDIT -->
        <div class="body">
          <div class="field">
            <div class="label">From</div>
            <div class="value">${cleanName} &lt;${cleanEmail}&gt;</div>
          </div>
          <div class="field">
            <div class="label">Intent</div>
            <div class="value">${cleanIntent}</div>
          </div>
          <div class="field">
            <div class="label">Message</div>
            <div class="value message">${cleanMessage.replace(/\n/g, '<br>')}</div>
          </div>
        </div>
        <div class="footer">Sent from your portfolio contact form · ${new Date().toUTCString()}</div>
      </div>
    </body>
    </html>
  `;

  const textBody = `New portfolio inquiry\n\nFrom: ${cleanName} <${cleanEmail}>\nIntent: ${cleanIntent}\n\nMessage:\n${cleanMessage}`;

  // ── Send ──────────────────────────────────────────────────
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from:    process.env.MAIL_FROM,
      to:      process.env.MAIL_TO,
      replyTo: `${cleanName} <${cleanEmail}>`,
      subject: `[Portfolio] ${cleanIntent} from ${cleanName}`,// EDIT
      text:    textBody,
      html:    htmlBody,
    });

    console.log(`[contact] Email sent from ${cleanEmail}`);
    return res.status(200).json({ success: true, message: 'Email sent successfully.' });

  } catch (err) {
    console.error('[contact] Failed to send email:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to send email. Please try again later.' });
  }
});

module.exports = router;
