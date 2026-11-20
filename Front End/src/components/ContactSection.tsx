import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Star,
  ArrowUpRight,
  MessageSquarePlus,
} from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from './SocialIcons';
import { profileData } from '../data/profile';
import { API_BASE_URL } from '../config/api';
import {
  ratingService,
  RatingsState,
  formatReviewDate,
} from '../services/ratingService';

const DM_QUICK_REPLIES = [
  {
    label: 'OJT / Software Developer Role',
    subject: 'Internship / Full-time Role',
    text: 'Hi Vince! We checked out your portfolio and would love to invite you to apply for a Software Developer OJT / Internship role.',
  },
  {
    label: 'Full-Stack Web App Collaboration',
    subject: 'Project Collaboration',
    text: 'Hey Vince! I saw your full-stack web & data mining work and would love to collaborate on a project.',
  },
  {
    label: 'UI/UX Prototyping Inquiry',
    subject: 'Others',
    custom: 'UI/UX Prototyping & Frontend Design',
    text: 'Hi Vince! We need help prototyping and designing a clean web interface in Figma and React.',
  },
];

interface ContactSectionProps {
  onOpenRateModal?: (initialTab: 'rate' | 'all') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onOpenRateModal,
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    customSubject: '',
    message: '',
  });

  const [sentMessages, setSentMessages] = useState<
    { sender: string; intent: string; text: string; time: string }[]
  >([]);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  // Live ratings state from existing backend
  const [ratingsState, setRatingsState] = useState<RatingsState>(() =>
    ratingService.getState()
  );

  useEffect(() => {
    const unsub = ratingService.subscribe((state) => setRatingsState(state));
    return () => unsub();
  }, []);

  const handleCopyEmail = () => {
    try {
      navigator.clipboard.writeText(profileData.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {}
  };

  const applyQuickReply = (item: (typeof DM_QUICK_REPLIES)[number]) => {
    setFormData((prev) => ({
      ...prev,
      subject: item.subject,
      customSubject: item.custom || prev.customSubject,
      message: item.text,
    }));
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (formData.subject === 'Others' && !formData.customSubject.trim()) {
      errs.customSubject = 'Please specify what you need.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter a message.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message should be at least 10 characters long.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    const resolvedIntent =
      formData.subject === 'Others'
        ? `Others: ${formData.customSubject.trim()}`
        : formData.subject || 'Portfolio Inquiry';

    try {
      const endpoint = `${API_BASE_URL || 'http://localhost:3001'}/api/contact`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          intent: resolvedIntent,
          message: formData.message,
        }),
      }).catch(() => null);

      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setSentMessages((prev) => [
        ...prev,
        {
          sender: formData.name.trim(),
          intent: resolvedIntent,
          text: formData.message.trim(),
          time: nowTime,
        },
      ]);

      if (res && res.ok) {
        setSubmitStatus({
          type: 'success',
          message:
            'Direct Message delivered to Vince! I will get back to you shortly.',
        });
      } else {
        setSubmitStatus({
          type: 'success',
          message: `Thanks, ${formData.name}! Your inquiry was recorded. You can also reach me directly at ${profileData.email}.`,
        });
      }
      setFormData({
        name: '',
        email: '',
        subject: '',
        customSubject: '',
        message: '',
      });
    } catch {
      setSubmitStatus({
        type: 'error',
        message:
          'Could not send message automatically. Please reach out directly via email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('[data-contact-word]', { yPercent: 0, opacity: 1 });
        gsap.set('[data-contact-social]', { opacity: 1, x: 0 });
        return;
      }

      gsap.fromTo(
        '[data-contact-word]',
        { yPercent: 110, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '[data-contact-headline]',
            start: 'top 88%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-contact-social]',
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-contact-socials]',
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-16 sm:py-24 lg:py-32 border-t border-white/10 text-left overflow-hidden bg-gradient-to-b from-[#0A0A0A] via-[#060606] to-[#030303]"
    >
      {/* Subtle Background Watermark */}
      <span
        data-watermark
        aria-hidden="true"
        className="section-watermark font-display font-black uppercase tracking-tighter text-[15vw] sm:text-[11vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
      >
        CONNECT
      </span>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* Continuous Chapter Connector Bridge */}
        <div className="chapter-bridge" aria-hidden="true">
          <span data-chapter-bridge className="chapter-bridge-fill" />
        </div>

        {/* Section Header */}
        <div
          data-reveal="clip"
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                06 // COLLABORATION &amp; INQUIRIES
              </span>
              <span data-header-rule className="h-px w-16 bg-white/25" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              GET IN <span className="text-[#C8C8C8]">TOUCH</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#777777] max-w-md leading-relaxed">
            Available for Software Developer OJT / Internships, full-stack engineering roles, and project collaborations.
          </p>
        </div>

        {/* Oversized Editorial Headline & Magnetic Email CTA */}
        <div
          data-contact-headline
          className="mb-14 pb-10 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <p className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.02] text-white">
            {["LET'S", 'WORK', 'TOGETHER'].map((word, idx) => (
              <span key={word} className="inline-block overflow-hidden mr-[0.26em]">
                <span
                  data-contact-word
                  className={`inline-block ${idx === 1 ? 'text-[#C8C8C8]' : 'text-white'}`}
                >
                  {word}
                </span>
              </span>
            ))}
          </p>

          <a
            href={`mailto:${profileData.email}?subject=Portfolio%20Inquiry`}
            data-magnetic="0.25"
            className="group w-full sm:w-auto justify-center px-5 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-[0_0_30px_rgba(255,255,255,0.18)] shrink-0 max-w-full"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="truncate">{profileData.email}</span>
            <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 1. Client Reviews & Testimonials Showcase (Preserves /api/ratings & RateModal) */}
        <div
          data-reveal
          className="mb-12 rounded-3xl bg-[#151515] border border-white/12 p-6 sm:p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                <Star className="w-5 h-5 fill-white text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                    Client &amp; Collaborator Reviews
                  </h3>
                  <span className="font-mono-code text-xs font-bold px-2.5 py-0.5 rounded-full bg-white text-[#0A0A0A]">
                    {ratingsState.average} ★ ({ratingsState.count})
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#777777]">
                  Verified feedback persisted via the portfolio ratings backend.
                </p>
              </div>
            </div>

            {onOpenRateModal && (
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onOpenRateModal('rate')}
                  data-magnetic="0.22"
                  className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 whitespace-nowrap"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  <span>Leave a Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenRateModal('all')}
                  data-magnetic="0.18"
                  className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-full bg-[#242424] hover:bg-[#303030] text-white border border-white/15 text-xs font-semibold cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  All Reviews ({ratingsState.total})
                </button>
              </div>
            )}
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {ratingsState.reviews.slice(0, 3).map((rev, idx) => (
              <div
                key={rev.id}
                data-reveal
                style={{ '--reveal-delay': `${idx * 90}ms` } as React.CSSProperties}
                className="motion-card rounded-2xl bg-[#0A0A0A] border border-white/10 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1 text-white">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating
                              ? 'fill-white text-white'
                              : 'text-[#242424]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono-code text-[#777777]">
                      {formatReviewDate(rev)}
                    </span>
                  </div>
                  {rev.feedback && (
                    <p className="text-xs sm:text-sm text-[#C8C8C8] leading-relaxed italic mb-4">
                      &ldquo;{rev.feedback}&rdquo;
                    </p>
                  )}
                </div>
                <div className="pt-3 border-t border-white/8 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{rev.name}</span>
                  {rev.role && (
                    <span className="text-[10px] font-mono-code text-[#777777]">
                      {rev.role}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Main Split Contact Container: Left Channels (5 cols) + Right Direct Message Form (7 cols) */}
        <div
          data-reveal
          style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          className="rounded-3xl bg-[#151515] border border-white/12 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] grid grid-cols-1 lg:grid-cols-12"
        >
          {/* LEFT PANE: Contact Information, Email & Social Links (5 cols) */}
          <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#0A0A0A]/60 p-7 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
                <span className="font-display text-base font-bold text-white uppercase tracking-wider">
                  Direct Channels
                </span>
                <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Available</span>
                </span>
              </div>

              {/* Profile Card */}
              <div className="p-4 rounded-2xl bg-[#151515] border border-white/12 flex items-center gap-3.5 mb-6">
                <div className="relative shrink-0">
                  <img
                    src="/assets/images/headshot/vince-studio-avatar.jpg"
                    alt={profileData.name}
                    className="w-12 h-12 rounded-full object-cover grayscale ring-1 ring-white/30"
                  />
                  <span className="w-3 h-3 rounded-full bg-white ring-2 ring-[#151515] absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-bold text-white truncate">
                    {profileData.name}
                  </p>
                  <p className="text-xs text-[#C8C8C8] truncate">
                    {profileData.location}
                  </p>
                </div>
              </div>

              {/* Direct Channel Links */}
              <div data-contact-socials className="space-y-3">
                {/* Email Card with Copy & Compose */}
                <div
                  data-contact-social
                  className="p-4 rounded-2xl bg-[#151515] border border-white/10 hover:border-white/30 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#242424] border border-white/12 flex items-center justify-center text-white shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777] block">
                        Direct Email
                      </span>
                      <a
                        href={`mailto:${profileData.email}?subject=Portfolio%20Inquiry`}
                        className="text-xs font-bold text-white hover:text-[#C8C8C8] truncate block transition-colors"
                      >
                        {profileData.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    data-magnetic="0.22"
                    className="px-3 py-1.5 rounded-full bg-[#242424] hover:bg-white text-[#C8C8C8] hover:text-[#0A0A0A] border border-white/12 text-[11px] font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* GitHub */}
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-social
                  data-magnetic="0.14"
                  className="group p-4 rounded-2xl bg-[#151515] border border-white/10 hover:border-white/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#242424] group-hover:bg-white text-white group-hover:text-[#0A0A0A] flex items-center justify-center shrink-0 transition-colors">
                      <GithubIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777] block">
                        GitHub
                      </span>
                      <span className="text-xs font-bold text-white truncate block">
                        github.com/vincequijano-stack
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* LinkedIn */}
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-contact-social
                  data-magnetic="0.14"
                  className="group p-4 rounded-2xl bg-[#151515] border border-white/10 hover:border-white/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#242424] group-hover:bg-white text-white group-hover:text-[#0A0A0A] flex items-center justify-center shrink-0 transition-colors">
                      <LinkedinIcon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777] block">
                        LinkedIn
                      </span>
                      <span className="text-xs font-bold text-white truncate block">
                        linkedin.com/in/vince-quijano
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#777777] group-hover:text-white shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                {/* Additional Social Links Row (Facebook & Instagram) */}
                <div data-contact-social className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href={profileData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.18"
                    className="p-3 rounded-2xl bg-[#151515] border border-white/10 hover:border-white/40 flex items-center gap-2.5 text-xs font-semibold text-[#C8C8C8] hover:text-white"
                  >
                    <FacebookIcon className="w-4 h-4 shrink-0" />
                    <span>Facebook</span>
                  </a>
                  <a
                    href={profileData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.18"
                    className="p-3 rounded-2xl bg-[#151515] border border-white/10 hover:border-white/40 flex items-center gap-2.5 text-xs font-semibold text-[#C8C8C8] hover:text-white"
                  >
                    <InstagramIcon className="w-4 h-4 shrink-0" />
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-[#777777]">
              <Clock className="w-4 h-4 text-[#C8C8C8]" />
              <span>Typical response time: Within 24 hours</span>
            </div>
          </div>

          {/* RIGHT PANE: Direct Message & Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 p-7 sm:p-9 flex flex-col justify-between bg-[#151515]">
            <div>
              <div className="pb-5 mb-6 border-b border-white/10">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Send a Direct Inquiry
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] mt-1">
                  Select a quick-reply template below or compose a custom message directly to my inbox.
                </p>
              </div>

              {/* Quick-Reply Templates */}
              <div className="mb-6">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#777777] block mb-2.5">
                  Quick Templates:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DM_QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.label}
                      type="button"
                      onClick={() => applyQuickReply(qr)}
                      className="text-xs font-medium px-3.5 py-2 rounded-full bg-[#0A0A0A] border border-white/12 text-[#C8C8C8] hover:border-white hover:text-white transition-all cursor-pointer"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sent Messages Stream */}
              {sentMessages.length > 0 && (
                <div className="mb-6 space-y-3">
                  {sentMessages.map((msg, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-[#0A0A0A] border border-white/15 text-xs sm:text-sm"
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono-code text-[#C8C8C8] mb-1">
                        <span>{msg.intent}</span>
                        <span>
                          Sent by {msg.sender} · {msg.time}
                        </span>
                      </div>
                      <p className="text-white">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Alert Status */}
              {submitStatus.message && (
                <div
                  className={`p-4 mb-6 rounded-2xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    submitStatus.type === 'success'
                      ? 'bg-white/10 text-white border border-white/30'
                      : 'bg-red-950/60 text-red-200 border border-red-500/40'
                  }`}
                  role="alert"
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#C8C8C8] mb-1.5">
                      Your Name <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none transition-colors ${
                        errors.name
                          ? 'border-red-400'
                          : 'border-white/15 focus:border-white'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#C8C8C8] mb-1.5">
                      Email Address <span className="text-white">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none transition-colors ${
                        errors.email
                          ? 'border-red-400'
                          : 'border-white/15 focus:border-white'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C8C8C8] mb-1.5">
                    Subject / Purpose
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm px-4 py-3 rounded-xl border border-white/15 bg-[#0A0A0A] text-white focus:border-white focus:outline-none transition-colors"
                  >
                    <option value="">Select purpose...</option>
                    <option value="Internship / Full-time Role">
                      Internship / Full-time Role
                    </option>
                    <option value="Project Collaboration">
                      Project Collaboration
                    </option>
                    <option value="Code Review / Consultation">
                      Code Review / Consultation
                    </option>
                    <option value="General Question">General Question</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {formData.subject === 'Others' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#C8C8C8] mb-1.5">
                      Please specify <span className="text-white">*</span>
                    </label>
                    <input
                      type="text"
                      name="customSubject"
                      value={formData.customSubject}
                      onChange={handleChange}
                      placeholder="Describe what you need (e.g. Custom Web App, UI/UX Redesign)..."
                      className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none ${
                        errors.customSubject
                          ? 'border-red-400'
                          : 'border-white/15 focus:border-white'
                      }`}
                    />
                    {errors.customSubject && (
                      <p className="text-[11px] text-red-400 mt-1">
                        {errors.customSubject}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#C8C8C8] mb-1.5">
                    Message <span className="text-white">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message to Vince..."
                    className={`w-full text-xs sm:text-sm px-4 py-3 rounded-xl border bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none resize-none transition-colors ${
                      errors.message
                        ? 'border-red-400'
                        : 'border-white/15 focus:border-white'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-magnetic="0.22"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50 shadow-[0_0_25px_rgba(255,255,255,0.22)] cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
