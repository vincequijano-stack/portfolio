import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Target,
  Compass,
  FileDown,
  MapPin,
  ArrowUpRight,
  Cpu,
  Play,
  Pencil,
  Check,
  X,
} from 'lucide-react';
import { profileData } from '../data/profile';
import { isOwnerUnlocked } from '../services/visitorSession';
import { apiFetch } from '../config/api';
import { gsap } from '../lib/gsap';

interface AboutSectionProps {
  onNavigate?: (sectionId: string) => void;
  onOpenStoryModal?: (storyId: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onNavigate,
  onOpenStoryModal,
}) => {
  const DEFAULT_NOTE = 'LF OJT';
  const NOTE_CLOUD_TOPIC = 'vince_quijano_portfolio_note_live';
  const isOwner = isOwnerUnlocked();
  const sectionRef = useRef<HTMLElement>(null);

  const [note, setNote] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('vince_profile_note') ||
        localStorage.getItem('vince_public_note_cache') ||
        DEFAULT_NOTE
      );
    } catch {
      return DEFAULT_NOTE;
    }
  });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let channel: BroadcastChannel | null = null;
    let latestTime = 0;

    const applyIncomingNote = (incomingNote: string, ts = 0) => {
      const cleaned = (incomingNote || '').trim();
      if (!cleaned) return;
      if (ts > 0 && ts < latestTime) return;
      if (ts > latestTime) latestTime = ts;
      setNote(cleaned);
      try {
        localStorage.setItem('vince_public_note_cache', cleaned);
      } catch {}
    };

    const syncNote = () => {
      apiFetch<{ note?: string; timestamp?: number }>('/api/note')
        .then((data) => {
          if (data && data.note) {
            applyIncomingNote(data.note, Number(data.timestamp) || 0);
          }
        })
        .catch(() => {});

      fetch(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}/json?poll=1&since=all`)
        .then((res) => (res.ok ? res.text() : ''))
        .then((text) => {
          if (!text) return;
          text.trim().split('\n').forEach((line) => {
            try {
              const item = JSON.parse(line);
              if (item.event === 'message' && item.message) {
                const parsed = JSON.parse(item.message);
                if (parsed && typeof parsed.note === 'string' && parsed.note.trim()) {
                  const ts = Number(parsed.timestamp) || Number(item.time) * 1000 || 0;
                  applyIncomingNote(parsed.note, ts);
                }
              }
            } catch {}
          });
        })
        .catch(() => {});
    };

    syncNote();

    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('portfolio_note_channel');
        channel.onmessage = (e) => {
          if (e.data && typeof e.data.note === 'string') {
            applyIncomingNote(e.data.note, Number(e.data.timestamp) || Date.now());
          }
        };
      }
    } catch {}

    try {
      eventSource = new EventSource(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const item = JSON.parse(event.data);
          if (item && item.event === 'message' && item.message) {
            const parsed = JSON.parse(item.message);
            if (parsed && typeof parsed.note === 'string' && parsed.note.trim()) {
              applyIncomingNote(parsed.note, Number(parsed.timestamp) || Date.now());
            }
          }
        } catch {}
      };
    } catch {}

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') syncNote();
    }, 30_000);
    window.addEventListener('focus', syncNote);

    return () => {
      if (eventSource) eventSource.close();
      if (channel) channel.close();
      window.clearInterval(interval);
      window.removeEventListener('focus', syncNote);
    };
  }, []);

  const handleSaveNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = noteDraft.trim() || DEFAULT_NOTE;
    const now = Date.now();
    setNote(trimmed);
    setIsEditingNote(false);
    try {
      localStorage.setItem('vince_profile_note', trimmed);
      localStorage.setItem('vince_public_note_cache', trimmed);
      localStorage.setItem('portfolio_is_owner', 'true');
    } catch {}

    apiFetch('/api/note', {
      method: 'POST',
      body: JSON.stringify({ note: trimmed }),
    }).catch(() => {});

    try {
      if ('BroadcastChannel' in window) {
        const ch = new BroadcastChannel('portfolio_note_channel');
        ch.postMessage({ note: trimmed, timestamp: now });
        ch.close();
      }
    } catch {}

    try {
      fetch(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}`, {
        method: 'POST',
        body: JSON.stringify({ note: trimmed, timestamp: now }),
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('[data-about-line]', { opacity: 1, y: 0 });
        gsap.set('[data-about-line-rule]', { scaleX: 1 });
        gsap.set('[data-about-highlight]', { color: '#FFFFFF' });
        return;
      }

      gsap.fromTo(
        '[data-about-line]',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '[data-about-bio]',
            start: 'top 88%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '[data-about-line-rule]',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: '[data-about-line-rule]',
            start: 'top 92%',
            once: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>('[data-about-highlight]').forEach((el) => {
        gsap.fromTo(
          el,
          { color: '#777777' },
          {
            color: '#FFFFFF',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 0.4,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 sm:py-32 border-t border-white/10 text-left overflow-hidden"
    >
      {/* Subtle Background Watermark & Studio Glow */}
      <span
        data-watermark
        aria-hidden="true"
        className="section-watermark font-display font-black uppercase tracking-tighter text-[15vw] sm:text-[11vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
      >
        IDENTITY
      </span>
      <div
        className="pointer-events-none absolute -top-24 right-0 w-96 h-96 rounded-full bg-white/[0.03] blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* Continuous Chapter Connector Bridge */}
        <div className="chapter-bridge" aria-hidden="true">
          <span data-chapter-bridge className="chapter-bridge-fill" />
        </div>

        {/* Editorial Section Header */}
        <div data-reveal="clip" className="mb-14 sm:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                01 // IDENTITY &amp; BACKGROUND
              </span>
              <span data-header-rule className="h-px w-16 bg-white/25" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              ABOUT <span className="text-[#C8C8C8]">ME</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#777777] max-w-md leading-relaxed">
            Bridging software engineering, data mining algorithms, and thoughtful high-contrast interface design.
          </p>
        </div>

        {/* Main Editorial Grid: Left Identity Column (5 cols) + Right Structured Pillars (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Personal Introduction & Academic Profile Card */}
          <div data-reveal className="lg:col-span-5 flex flex-col">
            <article className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden">
              {/* Top Diagonal Silver Corner Accent */}
              <div
                className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rotate-45 bg-gradient-to-b from-white/10 to-transparent"
                aria-hidden="true"
              />

              <div>
                {/* Avatar, Real-Time Status Note & Identity Header */}
                <div className="flex items-center gap-4 mb-7">
                  <div
                    onClick={() => onOpenStoryModal?.('myday')}
                    data-reveal="scale"
                    data-cursor="view"
                    className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#777777] via-[#C8C8C8] to-white cursor-pointer group shrink-0"
                    title="View Event Stories"
                  >
                    <div className="w-full h-full rounded-[14px] overflow-hidden bg-[#0A0A0A]">
                      <img
                        src="/assets/images/headshot/vince-studio-avatar.jpg"
                        alt={profileData.name}
                        data-parallax="0.03"
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {onOpenStoryModal && (
                      <span className="absolute -bottom-1.5 -right-1.5 bg-white text-[#0A0A0A] text-[9px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-0.5">
                        <Play className="w-2 h-2 fill-[#0A0A0A]" />
                        <span>Story</span>
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="inline-block text-[10px] font-mono-code uppercase tracking-[0.22em] text-[#C8C8C8] bg-[#242424] border border-white/10 px-2.5 py-0.5 rounded-full">
                        {profileData.role}
                      </span>

                      {/* Preserved Real-Time Status Note (/api/note) */}
                      {isEditingNote ? (
                        <form
                          onSubmit={handleSaveNote}
                          className="bg-[#0A0A0A] border border-white/30 rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[11px]"
                        >
                          <input
                            type="text"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            maxLength={35}
                            autoFocus
                            className="bg-transparent border-none outline-none text-white text-[11px] w-24"
                          />
                          <button
                            type="submit"
                            className="text-white hover:text-[#C8C8C8] cursor-pointer"
                            title="Save Note"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNoteDraft(note);
                              setIsEditingNote(false);
                            }}
                            className="text-[#777777] hover:text-white cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </form>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (isOwner) {
                              setNoteDraft(note);
                              setIsEditingNote(true);
                            }
                          }}
                          className={`px-2.5 py-0.5 rounded-full bg-[#0A0A0A] border border-white/15 text-[10px] font-mono-code text-white flex items-center gap-1.5 ${
                            isOwner ? 'hover:border-white/40 cursor-pointer' : 'cursor-default'
                          }`}
                          title={isOwner ? 'Click to edit live status note' : `Status: ${note}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="truncate max-w-[110px]">{note}</span>
                          {isOwner && <Pencil className="w-2.5 h-2.5 text-[#777777]" />}
                        </button>
                      )}
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                      {profileData.name}
                    </h3>
                    <p className="text-xs text-[#777777] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C8C8C8] shrink-0" />
                      <span>{profileData.location}</span>
                    </p>
                  </div>
                </div>

                {/* Personal Introduction with GSAP Line Stagger & Scroll-Scrubbed Emphasis */}
                <div data-about-bio className="space-y-4 text-sm sm:text-[15px] text-[#C8C8C8] leading-relaxed">
                  <p data-about-line>
                    I am <strong data-about-highlight className="text-white font-semibold">Vince Quijano</strong>, a{' '}
                    <strong data-about-highlight className="text-white font-semibold">
                      4th-year Bachelor of Science in Computer Science student
                    </strong>{' '}
                    at <strong data-about-highlight className="text-white font-semibold">Pamantasan ng Cabuyao</strong> in Laguna, Philippines.
                  </p>
                  <p data-about-line>{profileData.bio}</p>
                  <p data-about-line className="text-[#777777] text-xs sm:text-sm">
                    From engineering undergraduate thesis systems powered by{' '}
                    <span data-about-highlight className="font-semibold text-[#C8C8C8]">
                      Association Rule Mining (Apriori &amp; FP-Growth)
                    </span>{' '}
                    to building Web3 proof-of-learning applications and modern{' '}
                    <span data-about-highlight className="font-semibold text-[#C8C8C8]">
                      full-stack web interfaces
                    </span>
                    , I approach every project with precision and purpose.
                  </p>
                </div>
              </div>

              {/* Quick Metrics & Resume CTA */}
              <div className="mt-8 pt-6 relative">
                <div data-about-line-rule className="h-px w-full bg-white/12 mb-6" aria-hidden="true" />
                <div className="grid grid-cols-3 gap-3 mb-6 text-center">
                  <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/8">
                    <span className="font-display text-xl sm:text-2xl font-black text-white block">
                      4th Yr
                    </span>
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777]">
                      BSCS Standing
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/8">
                    <span className="font-display text-xl sm:text-2xl font-black text-white block">
                      {profileData.stats.projects}
                    </span>
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777]">
                      Core Systems
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#0A0A0A] border border-white/8">
                    <span className="font-display text-xl sm:text-2xl font-black text-white block">
                      {profileData.stats.skills}
                    </span>
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#777777]">
                      Technologies
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="/assets/resume/Resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.2"
                    className="flex-1 py-3 px-5 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-[0_0_25px_rgba(255,255,255,0.18)] active:scale-95"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>View / Download CV</span>
                  </a>

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('contact')}
                      data-magnetic="0.2"
                      className="group/inq py-3 px-5 rounded-full bg-[#242424] hover:bg-[#303030] text-white border border-white/15 hover:border-white/40 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Inquire</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover/inq:translate-x-0.5 group-hover/inq:-translate-y-0.5" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* RIGHT COLUMN: 2x2 Editorial Grid (Education, Technical Interests, Professional Goals, Personal Interests) */}
          <div
            data-reveal-stagger
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* 1. Educational Background */}
            <div data-reveal>
              <article className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span className="font-mono-code text-[11px] text-[#777777] uppercase tracking-widest">
                      EDUCATION
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                    Educational Background
                  </h3>
                  <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                    Pamantasan ng Cabuyao · BS Computer Science
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    Currently in 4th Year Standing in Laguna, Philippines. Coursework and capstone research focus on algorithm design, data mining systems, software engineering, and full-stack web development.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap gap-2">
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    4th Year BSCS
                  </span>
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    Capstone Researcher
                  </span>
                </div>
              </article>
            </div>

            {/* 2. Technical Interests */}
            <div data-reveal>
              <article className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <span className="font-mono-code text-[11px] text-[#777777] uppercase tracking-widest">
                      TECHNICAL FOCUS
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                    Technical Interests
                  </h3>
                  <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                    Full-Stack Systems &amp; Data Analytics
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    Deeply interested in scalable web architectures (React, NextJS, NodeJS), algorithmic pattern discovery (Apriori &amp; FP-Growth in Python), AI/LLM tooling, and modern Web3 smart contract integration.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap gap-2">
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    Full-Stack Web
                  </span>
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    Data Mining
                  </span>
                </div>
              </article>
            </div>

            {/* 3. Professional Goals */}
            <div data-reveal>
              <article className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                      <Target className="w-5 h-5" />
                    </div>
                    <span className="font-mono-code text-[11px] text-[#777777] uppercase tracking-widest">
                      OBJECTIVES
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                    Professional Goals
                  </h3>
                  <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                    Software Engineering &amp; Industry Impact
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    Committed to contributing as a Software Developer Intern (OJT) and Full-Stack Engineer—delivering maintainable codebases, high-performance applications, and data-driven software for organizations and MSMEs.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap gap-2">
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-white text-[#0A0A0A] font-semibold">
                    Open for OJT / Roles
                  </span>
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    Clean Architecture
                  </span>
                </div>
              </article>
            </div>

            {/* 4. Personal Interests & Design Philosophy */}
            <div data-reveal>
              <article className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                      <Compass className="w-5 h-5" />
                    </div>
                    <span className="font-mono-code text-[11px] text-[#777777] uppercase tracking-widest">
                      CREATIVE &amp; COMMUNITY
                    </span>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2">
                    Personal Interests
                  </h3>
                  <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                    UI/UX Prototyping &amp; Tech Mentorship
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    Passionate about visual design systems in Figma and Canva, participating in regional builder workshops with Cryptita Plays, and volunteering in youth robotics and tech initiatives with DEVCON Laguna.
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/8 flex flex-wrap gap-2">
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    UI/UX Design
                  </span>
                  <span className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]">
                    Tech Communities
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
