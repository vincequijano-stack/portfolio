import React from 'react';
import {
  GraduationCap,
  Code2,
  Building2,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 border-t border-[#D4E0CD] text-left">
      <div className="w-full">
        {/* Section Header: Style 3 — 3D Layered Shadow & Floating Kinetic Letters */}
        <div data-reveal className="mb-12 flex items-center group select-none">
          <div className="relative inline-flex items-center">
            {/* Ambient Sage Glow Behind Letters */}
            <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-[#8FA882]/30 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Staggered 3D Extruded Letters */}
            <h2
              aria-label="ABOUT ME"
              className="relative z-10 flex items-center text-3xl sm:text-5xl font-black uppercase tracking-[0.16em]"
            >
              {'ABOUT ME'.split('').map((char, idx) => (
                <span
                  key={idx}
                  className={`inline-block text-[#283618] animate-float-letter transition-transform duration-300 group-hover:scale-105 ${
                    char === ' ' ? 'w-3 sm:w-5' : ''
                  }`}
                  style={{
                    animationDelay: `${idx * 0.12}s`,
                    textShadow:
                      '2px 2px 0px #8FA882, 4px 4px 0px #D4E0CD, 6px 6px 12px rgba(40, 54, 24, 0.15)',
                  }}
                >
                  {char}
                </span>
              ))}
            </h2>
          </div>
        </div>

        {/* 3-Column Scaled-Up Visual Cards (Soft White, Sage Green, Deep Olive) */}
        <div data-reveal-stagger className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* CARD 1: Education Card */}
          <div data-reveal><article className="motion-card h-full bg-white border border-[#D4E0CD] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between select-none">
            <div>
              {/* Visual Graphic Banner */}
              <div className="relative h-44 bg-gradient-to-br from-[#283618] via-[#3A4D28] to-[#6B8A5B] p-7 flex flex-col justify-end text-white overflow-hidden">
                <GraduationCap className="w-32 h-32 absolute -right-4 -bottom-5 text-white/15 rotate-12" />
                <div className="z-10">
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                    Pamantasan ng Cabuyao
                  </h3>
                  <p className="text-sm text-[#EBF1E6] mt-1 font-medium">
                    4th Year Standing · Laguna, PH
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7">
                <p className="text-sm sm:text-base text-[#435339] leading-relaxed">
                  Currently a <strong className="text-[#283618]">4th year Computer Science student</strong> at Pamantasan ng Cabuyao. Developing real-world solutions that combine robust backend architecture with responsive, intuitive frontends and thoughtful interface design.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#EBF1E6] border border-[#D4E0CD] text-[#283618]">
                    #4thYearCS
                  </span>
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#EBF1E6] border border-[#D4E0CD] text-[#283618]">
                    #PamantasanNgCabuyao
                  </span>
                </div>
              </div>
            </div>
          </article></div>

          {/* CARD 2: Full-Stack & UI/UX Focus Card */}
          <div data-reveal><article className="motion-card h-full bg-white border border-[#D4E0CD] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between select-none">
            <div>
              {/* Visual Graphic Banner */}
              <div className="relative h-44 bg-gradient-to-br from-[#3A4D28] via-[#527043] to-[#8FA882] p-7 flex flex-col justify-end text-white overflow-hidden">
                <Code2 className="w-32 h-32 absolute -right-4 -bottom-5 text-white/15 rotate-12" />
                <div className="z-10">
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                    Full-Stack &amp; Design Focus
                  </h3>
                  <p className="text-sm text-[#EBF1E6] mt-1 font-medium">
                    Bridging Functionality &amp; Aesthetics
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7">
                <p className="text-sm sm:text-base text-[#435339] leading-relaxed">
                  Equipped with end-to-end web technologies including <strong className="text-[#283618]">JavaScript, Java, React, NextJS, NodeJS, and Python</strong> to build scalable full-stack web applications. Passionate about <strong className="text-[#283618]">UI/UX prototyping</strong> with <strong className="text-[#283618]">Figma and Canva</strong>.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#283618] text-white">
                    Full-Stack Web
                  </span>
                  <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#EBF1E6] border border-[#D4E0CD] text-[#283618]">
                    UI/UX Prototyping
                  </span>
                </div>
              </div>
            </div>
          </article></div>

          {/* CARD 3: Organizations & Tech Communities Card */}
          <div data-reveal><article className="motion-card h-full bg-white border border-[#D4E0CD] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between select-none">
            <div>
              {/* Visual Graphic Banner */}
              <div className="relative h-44 bg-gradient-to-br from-[#1F2A12] via-[#3A4D28] to-[#748E65] p-7 flex flex-col justify-end text-white overflow-hidden">
                <Building2 className="w-32 h-32 absolute -right-4 -bottom-5 text-white/15 rotate-12" />
                <div className="z-10">
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                    Tech Communities
                  </h3>
                  <p className="text-sm text-[#EBF1E6] mt-1 font-medium">
                    DEVCON Laguna &amp; Cryptita Plays
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-7">
                <p className="text-sm sm:text-base text-[#435339] leading-relaxed">
                  Active member and collaborator across forward-thinking developer networks, regional tech events, and student organizations:
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <span className="text-xs font-extrabold px-4 py-2 rounded-xl bg-[#EBF1E6] border border-[#D4E0CD] text-[#283618] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#283618]" />
                    DEVCON LAGUNA
                  </span>
                  <span className="text-xs font-extrabold px-4 py-2 rounded-xl bg-[#8FA882]/25 border border-[#8FA882]/60 text-[#283618] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#527043]" />
                    CRYPTITA PLAYS
                  </span>
                </div>
              </div>
            </div>
          </article></div>
        </div>
      </div>
    </section>
  );
};
