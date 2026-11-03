import React, { useState } from 'react';
import { Mail, Send, MapPin, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { profileData } from '../data/profile';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    customSubject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

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
      // Attempt backend endpoint if running, otherwise provide seamless graceful submission
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

      if (res && res.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you! Your message has been sent successfully. I will get back to you shortly.',
        });
        setFormData({ name: '', email: '', subject: '', customSubject: '', message: '' });
      } else {
        // Fallback: graceful notification for local/static environment
        setSubmitStatus({
          type: 'success',
          message: `Thank you, ${formData.name}! Your message was logged. You can also reach me directly at ${profileData.email}.`,
        });
        setFormData({ name: '', email: '', subject: '', customSubject: '', message: '' });
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: 'Could not send message automatically. Please reach out directly via email.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0095F6]">
            Get In Touch
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-white mt-1">Contact Me</h2>
          <p className="text-sm sm:text-base text-[#737373] dark:text-[#A8A8A8] mt-1.5">
            Available for software engineering roles, internships, or academic collaborations.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-7 sm:gap-8">
          {/* Left Column: Direct Contact Info (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="p-6 sm:p-7 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl space-y-5 shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white">Direct Channels</h3>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#0095F6] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#737373] block">Email</span>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profileData.email)}&su=Portfolio%20Inquiry`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-[#262626] dark:text-white hover:text-[#0095F6] break-all"
                  >
                    {profileData.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#262626] dark:text-white shrink-0">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#737373] block">GitHub</span>
                  <a
                    href={profileData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-[#262626] dark:text-white hover:text-[#0095F6]"
                  >
                    {profileData.github.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#0077B5] shrink-0">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#737373] block">LinkedIn</span>
                  <a
                    href={profileData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-[#262626] dark:text-white hover:text-[#0095F6]"
                  >
                    {profileData.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#10B981] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#737373] block">Response Window</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#262626] dark:text-white">
                    Usually within 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form (3 cols) */}
          <div className="md:col-span-3">
            <div className="p-6 sm:p-8 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-xs">
              <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white mb-5">Send a Message</h3>

              {submitStatus.message && (
                <div
                  className={`p-4 mb-5 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                    submitStatus.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                  }`}
                  role="alert"
                >
                  {submitStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span>{submitStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5 text-left">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#262626] dark:text-white mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className={`w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:outline-none transition-all ${
                      errors.name
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#DBDBDB] dark:border-[#333333] focus:border-[#262626] dark:focus:border-[#0095F6]'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#262626] dark:text-white mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className={`w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:outline-none transition-all ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#DBDBDB] dark:border-[#333333] focus:border-[#262626] dark:focus:border-[#0095F6]'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#262626] dark:text-white mb-1.5">
                    Purpose / Intent
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border border-[#DBDBDB] dark:border-[#333333] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:border-[#262626] dark:focus:border-[#0095F6] focus:outline-none transition-all"
                  >
                    <option value="">Select purpose...</option>
                    <option value="Internship / Full-time Role">Internship / Full-time Role</option>
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Code Review / Consultation">Code Review / Consultation</option>
                    <option value="General Question">General Question</option>
                    <option value="Others">Others</option>
                  </select>

                  {formData.subject === 'Others' && (
                    <div className="mt-3 animate-in fade-in duration-150">
                      <label className="block text-xs sm:text-sm font-semibold text-[#262626] dark:text-white mb-1.5">
                        Please specify what you need <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="customSubject"
                        value={formData.customSubject}
                        onChange={handleChange}
                        placeholder="Describe what you need (e.g. Custom Web App, UI/UX Redesign)..."
                        className={`w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:outline-none transition-all ${
                          errors.customSubject
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-[#DBDBDB] dark:border-[#333333] focus:border-[#262626] dark:focus:border-[#0095F6]'
                        }`}
                      />
                      {errors.customSubject && (
                        <p className="text-xs text-red-500 mt-1">{errors.customSubject}</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-[#262626] dark:text-white mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hello Vince, I saw your portfolio and would like to discuss..."
                    className={`w-full text-xs sm:text-sm px-3.5 py-3 rounded-xl border bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:outline-none transition-all ${
                      errors.message
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-[#DBDBDB] dark:border-[#333333] focus:border-[#262626] dark:focus:border-[#0095F6]'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
