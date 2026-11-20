import React, { useState, useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import {
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  Maximize2,
  X,
  Users,
  Code2,
} from 'lucide-react';
import { eventStories, EventStory } from '../data/events';

interface ExperienceSectionProps {
  onOpenStoryModal?: (storyId: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  onOpenStoryModal,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<EventStory | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const spineFillRef = useRef<HTMLDivElement>(null);
  const eventModalRef = useRef<HTMLDivElement>(null);

  const organizations = [
    {
      id: 'devcon-laguna',
      name: 'DEVCON Laguna',
      role: 'Active Member & Community Volunteer',
      period: '2026 — Present',
      location: 'Laguna, Philippines',
      description:
        'Collaborating with regional developers, industry mentors, and student leaders to promote technology literacy, Micro:bit robotics education (DEVCON Kids Roadshow), and community innovation across Laguna.',
      tags: ['Developer Community', 'DEVCON Kids Roadshow', 'STEM Outreach'],
    },
    {
      id: 'cryptita-plays',
      name: 'Cryptita Plays',
      role: 'Community Builder & Workshop Participant (Builder #14)',
      period: '2026 — Present',
      location: 'Biñan & Cabuyao, Laguna',
      description:
        'Engaged in hands-on Web3 builder workshops, smart contract deployment on Sui Mainnet, and regional tech ecosystem gatherings including Block Quest Fiesta PH.',
      tags: ['Web3 Builder #14', 'Sui Mainnet', 'Smart Contracts'],
    },
  ];

  useEffect(() => {
    const scope = sectionRef.current;
    if (!scope || !timelineRef.current || !spineFillRef.current) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set(spineFillRef.current, { scaleY: 1 });
        gsap.set('[data-exp-item]', { opacity: 1, y: 0 });
        return;
      }

      // Continuous ScrollTrigger-scrubbed vertical timeline spine
      gsap.fromTo(
        spineFillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            end: 'bottom 65%',
            scrub: 0.4,
          },
        }
      );

      // Progressive role & tag staggers per organization card
      gsap.utils.toArray<HTMLElement>('[data-exp-card]').forEach((card) => {
        const items = card.querySelectorAll<HTMLElement>('[data-exp-item]');
        if (!items.length) return;
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.065,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              once: true,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!selectedEvent || !eventModalRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        eventModalRef.current,
        { opacity: 0, y: 22, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.42, ease: 'expo.out' }
      );
    });
    return () => ctx.revert();
  }, [selectedEvent]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-24 sm:py-32 border-t border-white/10 text-left overflow-hidden"
    >
      {/* Subtle Background Watermark */}
      <span
        data-watermark
        aria-hidden="true"
        className="section-watermark font-display font-black uppercase tracking-tighter text-[14vw] sm:text-[10vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
      >
        EXPERIENCE
      </span>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* Continuous Chapter Connector Bridge */}
        <div className="chapter-bridge" aria-hidden="true">
          <span data-chapter-bridge className="chapter-bridge-fill" />
        </div>

        {/* Editorial Section Header */}
        <div
          data-reveal="clip"
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                05 // COMMUNITY &amp; INVOLVEMENT
              </span>
              <span data-header-rule className="h-px w-16 bg-white/25" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              ORGANIZATIONS &amp; <span className="text-[#C8C8C8]">EXPERIENCE</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#777777] max-w-md leading-relaxed">
            Active memberships, hands-on builder workshops, and technology community programs across Laguna.
          </p>
        </div>

        {/* 1. Organizations Timeline with Scrubbed Progressive Spine */}
        <div ref={timelineRef} data-reveal className="relative pl-6 sm:pl-9 mb-16">
          {/* Progressive Vertical Timeline Spine */}
          <div
            className="timeline-spine absolute left-1.5 sm:left-2.5 top-2 bottom-2 w-[2px] rounded-full"
            aria-hidden="true"
          >
            <div ref={spineFillRef} className="timeline-spine-fill" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {organizations.map((org, idx) => (
              <div
                key={org.id}
                data-reveal={idx === 0 ? 'left' : 'right'}
                style={{ '--reveal-delay': `${idx * 140}ms` } as React.CSSProperties}
                className="relative"
              >
                {/* Glowing Timeline Node Marker */}
                <span
                  className="hidden sm:block absolute -left-[34px] top-8 w-3 h-3 rounded-full bg-white ring-4 ring-[#0A0A0A] shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                  aria-hidden="true"
                />
                <article
                  data-exp-card
                  className="motion-card h-full rounded-3xl bg-[#151515] border border-white/12 p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden"
                >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                        {idx === 0 ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          <Code2 className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#C8C8C8] block">
                          ORGANIZATION 0{idx + 1}
                        </span>
                        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
                          {org.name}
                        </h3>
                      </div>
                    </div>

                    <span className="font-mono-code text-xs px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/12 text-[#C8C8C8] whitespace-nowrap">
                      {org.period}
                    </span>
                  </div>

                  <p data-exp-item className="text-xs sm:text-sm font-semibold text-white mb-2">
                    {org.role}
                  </p>
                  <p data-exp-item className="text-xs text-[#777777] flex items-center gap-1.5 mb-4">
                    <MapPin className="w-3.5 h-3.5 text-[#C8C8C8]" />
                    <span>{org.location}</span>
                  </p>

                  <p data-exp-item className="text-xs sm:text-sm text-[#C8C8C8] leading-relaxed">
                    {org.description}
                  </p>
                </div>

                <div data-exp-item className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2">
                  {org.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono-code px-3 py-1 rounded-full bg-[#0A0A0A] border border-white/10 text-[#C8C8C8]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          ))}
          </div>
        </div>

        {/* 2. Events & Workshops Timeline / Photo Highlights */}
        {eventStories.length > 0 && (
          <div>
            <div
              data-reveal
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Workshops &amp; Community Events
                </h3>
                <p className="text-xs sm:text-sm text-[#777777] mt-0.5">
                  Documented highlights from builder workshops, tech fiestas, and outreach programs.
                </p>
              </div>

              {onOpenStoryModal && (
                <button
                  type="button"
                  onClick={() => onOpenStoryModal('myday')}
                  className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#151515] hover:bg-[#242424] border border-white/15 hover:border-white/40 text-xs font-semibold text-white flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#C8C8C8]" />
                  <span>Open Full Story Reels</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {eventStories.map((ev, idx) => (
                <div
                  key={ev.id}
                  data-reveal
                  style={{ '--reveal-delay': `${idx * 110}ms` } as React.CSSProperties}
                  className="h-full"
                >
                  <article
                    onClick={() => setSelectedEvent(ev)}
                    className="motion-card group h-full rounded-3xl bg-[#151515] border border-white/12 hover:border-white/40 overflow-hidden flex flex-col justify-between cursor-pointer shadow-[0_14px_35px_rgba(0,0,0,0.65)]"
                  >
                    <div>
                      {/* Event Image Container */}
                      <div
                        data-cursor="view"
                        data-project-image-clip
                        className="relative aspect-[16/10] w-full bg-[#0A0A0A] overflow-hidden border-b border-white/10"
                      >
                        <img
                          src={ev.image}
                          alt={ev.title}
                          loading="lazy"
                          data-parallax="0.03"
                          className="w-full h-[108%] -mt-[4%] object-cover grayscale-[25%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/30 opacity-85" />

                        <span className="absolute top-3.5 left-3.5 font-mono-code text-[10px] uppercase tracking-wider bg-[#0A0A0A]/85 backdrop-blur-md border border-white/20 text-white px-2.5 py-1 rounded-full">
                          {ev.tag}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className="absolute bottom-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 text-[#0A0A0A] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                          aria-label={`Expand ${ev.title}`}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Event Body */}
                      <div className="p-6">
                        <div className="flex items-center gap-2 text-[11px] font-mono-code text-[#777777] mb-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C8C8C8]" />
                          <span>{ev.date}</span>
                        </div>

                        <h4 className="font-display text-lg font-bold text-white mb-1 leading-snug">
                          {ev.title}
                        </h4>
                        <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                          {ev.subtitle}
                        </p>
                        <p className="text-xs sm:text-sm text-[#777777] leading-relaxed line-clamp-3">
                          {ev.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-[#777777] flex items-center gap-1.5 truncate pr-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C8C8C8] shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </span>

                      {ev.ctaLink ? (
                        <a
                          href={ev.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-white hover:text-[#C8C8C8] font-bold flex items-center gap-1 shrink-0"
                        >
                          <span>Visit</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-[#C8C8C8] font-semibold shrink-0">View →</span>
                      )}
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Expanded Event Photo Lightbox Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedEvent.title}
        >
          <div
            ref={eventModalRef}
            className="bg-[#151515] border border-white/20 rounded-3xl max-w-3xl w-full overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-[#0A0A0A] max-h-[62vh] flex items-center justify-center overflow-hidden border-b border-white/10">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full max-h-[62vh] object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#0A0A0A]/80 border border-white/20 text-white hover:bg-white hover:text-[#0A0A0A] transition-colors cursor-pointer"
                aria-label="Close event preview"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-6 sm:p-7 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-code text-[#C8C8C8] mb-2">
                <span>{selectedEvent.tag}</span>
                <span>{selectedEvent.date}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {selectedEvent.title}
              </h3>
              <p className="text-xs sm:text-sm font-mono-code text-[#C8C8C8] mt-1">
                {selectedEvent.subtitle} · {selectedEvent.location}
              </p>
              <p className="text-xs sm:text-sm text-[#777777] mt-3 leading-relaxed">
                {selectedEvent.description}
              </p>

              {selectedEvent.ctaLink && (
                <div className="mt-5 pt-4 border-t border-white/10 flex justify-end">
                  <a
                    href={selectedEvent.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 hover:bg-[#F5F5F5] transition-colors"
                  >
                    <span>{selectedEvent.ctaText || 'Visit Live Project'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

