import React, { useState, useEffect, useRef } from 'react';
import { certificatesData, Certificate } from '../data/certificates';
import { gsap } from '../lib/gsap';
import {
  Award,
  ExternalLink,
  Maximize2,
  X,
  CheckCircle,
  Trophy,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const [activePdfCert, setActivePdfCert] = useState<Certificate | null>(null);
  const modalPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePdfCert(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!activePdfCert || !modalPanelRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        modalPanelRef.current,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'expo.out' }
      );
    });
    return () => ctx.revert();
  }, [activePdfCert]);

  const achievementsList = [
    {
      id: 'imagnation-2026',
      title: 'ImaGnation 2026 Participant',
      organization: 'Academic & Tech Innovation Showcase',
      year: '2026',
      description:
        'Recognized participant in the ImaGnation 2026 technology and innovation event, representing Computer Science student builders.',
    },
    {
      id: 'cryptita-builder-14',
      title: 'Builder #14 — Proof of Learning & Building',
      organization: 'Cryptita Plays · BFC Biñan & Sui Mainnet',
      year: '2026',
      description:
        'Completed the hands-on Smart Contract to Website Builder Workshop with immutable on-chain verification deployed on Sui Mainnet.',
    },
    {
      id: 'cobuy-capstone',
      title: 'BSCS Thesis Capstone — CoBuy Analytics Platform',
      organization: 'Pamantasan ng Cabuyao · Department of Computer Science',
      year: '2026',
      description:
        'Engineered an Association Rule Mining retail analytics system utilizing Apriori and FP-Growth algorithms for small retail businesses.',
    },
  ];

  return (
    <section
      id="certificates"
      className="relative py-24 sm:py-32 border-t border-white/10 text-left overflow-hidden"
    >
      {/* Subtle Background Watermark */}
      <span
        data-watermark
        aria-hidden="true"
        className="section-watermark font-display font-black uppercase tracking-tighter text-[13vw] sm:text-[10vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
      >
        CREDENTIALS
      </span>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* Continuous Chapter Connector Bridge */}
        <div className="chapter-bridge" aria-hidden="true">
          <span data-chapter-bridge className="chapter-bridge-fill" />
        </div>

        {/* Section Header */}
        <div
          data-reveal="clip"
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                04 // CREDENTIALS &amp; MILESTONES
              </span>
              <span data-header-rule className="h-px w-16 bg-white/25" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              CERTIFICATES &amp; <span className="text-[#C8C8C8]">ACHIEVEMENTS</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#777777] max-w-md leading-relaxed">
            Verified technical certifications, industry assessments, and academic milestones.
          </p>
        </div>

        {/* 1. Verified Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-16">
          {certificatesData.map((cert, idx) => (
            <div
              key={cert.id}
              data-reveal
              style={{ '--reveal-delay': `${idx * 110}ms` } as React.CSSProperties}
              className="h-full"
            >
              <article className="motion-card group relative h-full rounded-3xl bg-[#151515] border border-white/12 hover:border-white/40 overflow-hidden flex flex-col justify-between shadow-[0_14px_35px_rgba(0,0,0,0.65)]">
                <div>
                  {/* Certificate Preview Container */}
                  <div
                    data-cursor="view"
                    data-project-image-clip
                    className="relative h-52 w-full bg-[#0A0A0A] overflow-hidden border-b border-white/10 flex items-center justify-center"
                  >
                    {cert.pdfUrl ? (
                      <>
                        <iframe
                          src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                          title={cert.title}
                          className="w-full h-full pointer-events-none opacity-85 grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        />
                        <div
                          onClick={() => setActivePdfCert(cert)}
                          className="absolute inset-0 bg-gradient-to-t from-[#151515] via-black/35 to-black/20 group-hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActivePdfCert(cert);
                            }}
                            data-magnetic="0.2"
                            className="px-4 py-2 rounded-full bg-white text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Preview Certificate</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                        <ShieldCheck className="w-12 h-12 text-[#C8C8C8] mb-2" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Verified Credential
                        </span>
                      </div>
                    )}

                    {/* Top Left Tag Badge */}
                    <div className="absolute top-3.5 left-3.5 bg-[#0A0A0A]/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono-code uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 pointer-events-none">
                      <Award className="w-3 h-3 text-[#C8C8C8]" />
                      <span>{cert.tag}</span>
                    </div>
                  </div>

                  {/* Certificate Details Body */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between text-xs font-mono-code text-[#777777] mb-2">
                      <span className="text-[#C8C8C8] font-semibold">{cert.issuer}</span>
                      <span>{cert.date}</span>
                    </div>

                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-2.5 leading-snug">
                      {cert.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#C8C8C8] leading-relaxed mb-5">
                      {cert.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {cert.skillsCovered.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-mono-code bg-[#0A0A0A] border border-white/10 text-[#C8C8C8] px-2.5 py-1 rounded-lg"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  {cert.credentialId ? (
                    <span className="text-[11px] text-[#777777] font-mono-code">
                      ID: {cert.credentialId}
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#C8C8C8] font-mono-code flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}

                  {cert.pdfUrl && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setActivePdfCert(cert)}
                        className="text-xs font-bold text-white hover:text-[#C8C8C8] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Expand</span>
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-[#777777] hover:text-white flex items-center gap-1 transition-colors"
                        title="Open PDF in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Hover Border Illumination Line */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </article>
            </div>
          ))}
        </div>

        {/* 2. Achievements & Recognitions Sub-Section */}
        <div data-reveal className="rounded-3xl bg-[#151515]/80 border border-white/12 p-6 sm:p-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-7 border-b border-white/10">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                  Achievements &amp; Recognitions
                </h3>
                <p className="text-xs sm:text-sm text-[#777777]">
                  Academic milestones, competition participation, and verified builder proof.
                </p>
              </div>
            </div>
            <span className="font-mono-code text-xs uppercase tracking-widest text-[#C8C8C8] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VERIFIED MILESTONES</span>
            </span>
          </div>

          <div data-reveal-stagger className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {achievementsList.map((ach, idx) => (
              <div
                key={ach.id}
                data-reveal
                style={{ '--reveal-delay': `${idx * 100}ms` } as React.CSSProperties}
                className="motion-card rounded-2xl bg-[#0A0A0A] border border-white/10 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-[#777777] mb-2.5">
                    <span className="text-[#C8C8C8] uppercase tracking-wider">ACHIEVEMENT</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#151515] border border-white/10 text-white">
                      {ach.year}
                    </span>
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-white mb-1.5">
                    {ach.title}
                  </h4>
                  <p className="text-xs font-mono-code text-[#C8C8C8] mb-3">
                    {ach.organization}
                  </p>
                  <p className="text-xs sm:text-sm text-[#777777] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Full-Screen Certificate Lightbox Modal */}
      {activePdfCert && activePdfCert.pdfUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
          onClick={() => setActivePdfCert(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePdfCert.title}
        >
          <div
            ref={modalPanelRef}
            className="bg-[#151515] border border-white/20 rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
              <div>
                <h3 className="font-display text-sm sm:text-base font-bold text-white">
                  {activePdfCert.title}
                </h3>
                <p className="text-xs font-mono-code text-[#C8C8C8] mt-0.5">
                  Issued by {activePdfCert.issuer} · {activePdfCert.date}
                  {activePdfCert.credentialId ? ` · ID: ${activePdfCert.credentialId}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href={activePdfCert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold rounded-full bg-white text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open PDF</span>
                </a>
                <button
                  onClick={() => setActivePdfCert(null)}
                  className="p-2 rounded-full bg-[#151515] border border-white/15 text-[#C8C8C8] hover:text-white cursor-pointer"
                  aria-label="Close certificate preview"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#0A0A0A]">
              <iframe
                src={activePdfCert.pdfUrl}
                title={activePdfCert.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
