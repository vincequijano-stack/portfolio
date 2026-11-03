import React from 'react';
import {
  GraduationCap,
  Code2,
  Building2,
  Sparkles,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 border-t border-[#D4E0CD] text-left">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A4D28]">
            <Sparkles className="w-3.5 h-3.5" />
            Creator Story &amp; Background
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#283618] mt-1 tracking-tight">
            About Me
          </h2>
          <p className="text-sm sm:text-base text-[#526348] mt-1">
            4th Year Computer Science Student from Pamantasan ng Cabuyao, focusing on full-stack web systems and UI/UX design.
          </p>
        </div>

        {/* 3-Column Scaled-Up Visual Cards (Soft White, Sage Green, Deep Olive) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* CARD 1: Education Card */}
          <article className="bg-white border border-[#D4E0CD] hover:border-[#3A4D28] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#283618]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none">
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
          </article>

          {/* CARD 2: Full-Stack & UI/UX Focus Card */}
          <article className="bg-white border border-[#D4E0CD] hover:border-[#3A4D28] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#283618]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none">
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
          </article>

          {/* CARD 3: Organizations & Tech Communities Card */}
          <article className="bg-white border border-[#D4E0CD] hover:border-[#3A4D28] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-[#283618]/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between select-none">
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
          </article>
        </div>
      </div>
    </section>
  );
};
