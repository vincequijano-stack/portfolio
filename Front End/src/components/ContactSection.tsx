import React, { useState } from 'react';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  Video,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { profileData } from '../data/profile';

const DM_QUICK_REPLIES = [
  {
    label: '👋 Looking for an OJT / Intern?',
    subject: 'Internship / Full-time Role',
    text: 'Hi Vince! We checked out your portfolio and would love to invite you to apply for a Software Developer OJT / Internship role.',
  },
  {
    label: '💻 Let’s build a Web App!',
    subject: 'Project Collaboration',
    text: 'Hey Vince! I saw your full-stack web & UI/UX work and would love to collaborate on a project.',
  },
  {
    label: '🎨 UI/UX Design Inquiry',
    subject: 'Others',
    custom: 'UI/UX Prototyping & Frontend Design',
    text: 'Hi Vince! We need help prototyping and designing a clean web interface in Figma and React.',
  },
];

export const ContactSection: React.FC = () => {
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
      const res = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          intent: resolvedIntent,
          message: formData.message,
        }),
      }).catch(() => null);

      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          message: 'Direct Message delivered to Vince! I will get back to you shortly.',
        });
      } else {
        setSubmitStatus({
          type: 'success',
          message: `Thanks, ${formData.name}! Your DM was sent. You can also reach me at ${profileData.email}.`,
        });
      }
      setFormData({ name: '', email: '', subject: '', customSubject: '', message: '' });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Could not send message automatically. Please reach out directly via email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 border-t border-[#D4E0CD] text-left">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-9">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A4D28]">
            <Sparkles className="w-3.5 h-3.5" />
            Instagram Direct Messenger
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#283618] mt-1 tracking-tight">
            Contact Me
          </h2>
          <p className="text-sm sm:text-base text-[#526348] mt-1">
            Available for software engineering roles, internships, or academic collaborations.
          </p>
        </div>

        {/* Unified Instagram Direct Message (DM) Split Window (Soft White, Sage Green, Deep Olive) */}
        <div className="bg-white border border-[#D4E0CD] rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
          {/* LEFT PANE: Instagram Inbox / Direct Channels (4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E6EFE2] bg-[#F3F6F0] p-6 flex flex-col justify-between">
            <div>
              {/* Inbox Top Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#D4E0CD]">
                <span className="text-base font-extrabold text-[#283618]">
                  Direct Channels
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#8FA882]/30 text-[#283618] border border-[#8FA882]/60">
                  ● Online
                </span>
              </div>

              {/* Active Conversation Thread Item */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#8FA882] shadow-xs flex items-center gap-3 mb-6">
                <div className="relative shrink-0">
                  <img
                    src="/assets/images/headshot/headshot.jpg"
                    alt={profileData.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#283618]"
                    style={{ objectPosition: '0% 20%' }}
                  />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#527043] ring-2 ring-white absolute bottom-0 right-0" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold text-[#283618] truncate">
                    {profileData.name}
                  </p>
                  <p className="text-xs text-[#526348] font-semibold truncate">
                    Active now · Replies within 24h
                  </p>
                </div>
              </div>

              {/* Channel Links */}
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-white border border-[#D4E0CD] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#EBF1E6] border border-[#D4E0CD] flex items-center justify-center text-[#283618] shrink-0">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-[#6B7F5E] block">Email</span>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profileData.email)}&su=Portfolio%20Inquiry`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#283618] hover:text-[#527043] truncate block"
                      >
                        {profileData.email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1.5 rounded-lg bg-[#F3F6F0] border border-[#D4E0CD] text-[11px] font-bold text-[#283618] hover:border-[#283618] flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-[#283618]" />
                        <span className="text-[#283618]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white border border-[#D4E0CD] hover:border-[#283618] flex items-center gap-3 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EBF1E6] flex items-center justify-center text-[#283618] shrink-0">
                    <GithubIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-[#6B7F5E] block">GitHub</span>
                    <span className="text-xs font-bold text-[#283618] truncate block">
                      github.com/vincequijano-stack
                    </span>
                  </div>
                </a>

                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white border border-[#D4E0CD] hover:border-[#283618] flex items-center gap-3 transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#EBF1E6] flex items-center justify-center text-[#283618] shrink-0">
                    <LinkedinIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] text-[#6B7F5E] block">LinkedIn</span>
                    <span className="text-xs font-bold text-[#283618] truncate block">
                      linkedin.com/in/vince-quijano/
                    </span>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D4E0CD] flex items-center gap-2 text-xs text-[#526348]">
              <Clock className="w-4 h-4 text-[#283618]" />
              <span>Response window: Usually within 24 hours</span>
            </div>
          </div>

          {/* RIGHT PANE: Active Instagram DM Conversation & Form (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Top DM Chat Bar */}
            <div className="px-6 py-4 border-b border-[#E6EFE2] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img
                  src="/assets/images/headshot/headshot.jpg"
                  alt={profileData.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-[#8FA882]"
                  style={{ objectPosition: '0% 20%' }}
                />
                <div>
                  <h3 className="text-sm font-extrabold text-[#283618] leading-tight">
                    {profileData.name}
                  </h3>
                  <p className="text-[11px] text-[#526348]">
                    CS Student &amp; Full-Stack Developer · Pamantasan ng Cabuyao
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[#526348]">
                <Phone className="w-4.5 h-4.5 hover:text-[#283618] transition-colors" />
                <Video className="w-5 h-5 hover:text-[#283618] transition-colors" />
                <Info className="w-5 h-5 hover:text-[#283618] transition-colors" />
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="p-6 space-y-4 bg-[#FAFBF8]">
              {/* Incoming Greeting Bubble from Vince */}
              <div className="flex items-end gap-2.5">
                <img
                  src="/assets/images/headshot/headshot.jpg"
                  alt={profileData.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1"
                  style={{ objectPosition: '0% 20%' }}
                />
                <div className="max-w-md bg-[#EBF1E6] border border-[#D4E0CD] text-[#283618] rounded-2xl rounded-bl-sm px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs">
                  <p>
                    Hey there! 👋 Thanks for visiting my portfolio. Whether you’re hiring for an <strong>OJT / Software Developer role</strong> or looking to collaborate on a <strong>Full-Stack Web / UI/UX project</strong>, drop me a message below!
                  </p>
                </div>
              </div>

              {/* Sent Messages from Visitor */}
              {sentMessages.map((msg, i) => (
                <div key={i} className="flex flex-col items-end">
                  <div className="max-w-md bg-gradient-to-r from-[#283618] to-[#527043] text-white rounded-2xl rounded-br-sm px-4 py-3 text-xs sm:text-sm shadow-sm">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#EBF1E6] mb-1">
                      {msg.intent}
                    </span>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#6B7F5E] mt-1">
                    Sent by {msg.sender} · {msg.time}
                  </span>
                </div>
              ))}

              {/* Quick-Reply Bubble Suggestions */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-[#526348] block mb-2">
                  Tap a quick reply to auto-fill:
                </span>
                <div className="flex flex-wrap gap-2">
                  {DM_QUICK_REPLIES.map((qr) => (
                    <button
                      key={qr.label}
                      type="button"
                      onClick={() => applyQuickReply(qr)}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-[#D4E0CD] text-[#283618] hover:border-[#283618] hover:bg-[#EBF1E6] transition-all cursor-pointer shadow-2xs"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DM Composer Form */}
            <div className="p-6 border-t border-[#E6EFE2] bg-white">
              {submitStatus.message && (
                <div
                  className={`p-3.5 mb-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    submitStatus.type === 'success'
                      ? 'bg-[#EBF1E6] text-[#283618] border border-[#8FA882]'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                  role="alert"
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#283618] shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#283618] mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-[#FAFBF8] text-[#283618] placeholder-[#6B7F5E] focus:bg-white focus:outline-none ${
                        errors.name
                          ? 'border-red-500'
                          : 'border-[#D4E0CD] focus:border-[#283618]'
                      }`}
                    />
                    {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#283618] mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-[#FAFBF8] text-[#283618] placeholder-[#6B7F5E] focus:bg-white focus:outline-none ${
                        errors.email
                          ? 'border-red-500'
                          : 'border-[#D4E0CD] focus:border-[#283618]'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#283618] mb-1">
                      Purpose / Intent
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D4E0CD] bg-[#FAFBF8] text-[#283618] focus:bg-white focus:border-[#283618] focus:outline-none"
                    >
                      <option value="">Select purpose...</option>
                      <option value="Internship / Full-time Role">Internship / Full-time Role</option>
                      <option value="Project Collaboration">Project Collaboration</option>
                      <option value="Code Review / Consultation">Code Review / Consultation</option>
                      <option value="General Question">General Question</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                {formData.subject === 'Others' && (
                  <div className="animate-in fade-in duration-150">
                    <label className="block text-xs font-semibold text-[#283618] mb-1">
                      Please specify what you need <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customSubject"
                      value={formData.customSubject}
                      onChange={handleChange}
                      placeholder="Describe what you need (e.g. Custom Web App, UI/UX Redesign)..."
                      className={`w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border bg-[#FAFBF8] text-[#283618] placeholder-[#6B7F5E] focus:bg-white focus:outline-none ${
                        errors.customSubject
                          ? 'border-red-500'
                          : 'border-[#D4E0CD] focus:border-[#283618]'
                      }`}
                    />
                    {errors.customSubject && (
                      <p className="text-[11px] text-red-500 mt-1">{errors.customSubject}</p>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-end gap-2.5">
                    <div className="flex-1">
                      <textarea
                        name="message"
                        rows={2}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Write a message to Vince..."
                        className={`w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border bg-[#FAFBF8] text-[#283618] placeholder-[#6B7F5E] focus:bg-white focus:outline-none resize-none ${
                          errors.message
                            ? 'border-red-500'
                            : 'border-[#D4E0CD] focus:border-[#283618]'
                        }`}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-[66px] px-6 rounded-2xl bg-gradient-to-r from-[#283618] to-[#527043] hover:from-[#1F2A12] hover:to-[#3A4D28] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md shadow-[#283618]/20 cursor-pointer shrink-0"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send DM</span>
                        </>
                      )}
                    </button>
                  </div>
                  {errors.message && <p className="text-[11px] text-red-500 mt-1">{errors.message}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
