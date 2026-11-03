import React from 'react';
import { GraduationCap, Code2, Building2, Palette, Sparkles, MapPin } from 'lucide-react';
import { profileData } from '../data/profile';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-14 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="w-full">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0095F6]">
            Background &amp; Profile
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-white mt-1">About Me</h2>
          <p className="text-sm sm:text-base text-[#737373] dark:text-[#A8A8A8] mt-1.5">
            4th Year Computer Science Student from Pamantasan ng Cabuyao, focusing on full-stack web systems and UI/UX design.
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {/* Education & Academic Journey */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] dark:bg-[#0369A1]/30 border border-[#BAE6FD] dark:border-[#0284C7]/40 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8] shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white">Pamantasan ng Cabuyao</h3>
                <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A8A8A8]">Bachelor of Science in Computer Science</p>
              </div>
            </div>
            <p className="text-sm sm:text-[15px] text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              Currently a <strong>4th year Computer Science student</strong> at Pamantasan ng Cabuyao. Developing real-world solutions that combine robust backend architecture with responsive, intuitive frontends and thoughtful interface design.
            </p>
            <div className="mt-5 pt-5 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2.5 text-xs sm:text-sm">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium">
                4th Year Standing
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium">
                Pamantasan ng Cabuyao
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#0095F6]" />
                Laguna, Philippines
              </span>
            </div>
          </div>

          {/* Development & Design Focus */}
          <div className="p-6 sm:p-8 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-xs">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#ECFDF5] dark:bg-[#065F46]/30 border border-[#A7F3D0] dark:border-[#059669]/40 flex items-center justify-center text-[#10B981] shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white">Full-Stack &amp; Design Focus</h3>
                <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A8A8A8]">Bridging Functionality &amp; Aesthetics</p>
              </div>
            </div>
            <p className="text-sm sm:text-[15px] text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              Equipped with end-to-end web technologies including <strong>JavaScript, Java, React, NextJS, NodeJS, and Python</strong> to build scalable, responsive full-stack web applications. Passionate about <strong>UI/UX prototyping</strong> and visual design using <strong>Figma and Canva</strong> to craft intuitive, user-centered digital experiences.
            </p>
            <div className="mt-5 pt-5 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2.5 text-xs sm:text-sm">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium">
                Full-Stack Web
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium">
                UI/UX Prototyping
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium">
                Responsive Interface Design
              </span>
            </div>
          </div>
        </div>

        {/* Organizations & Community */}
        <div className="mt-6 sm:mt-7 p-6 sm:p-8 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl text-left shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#F3E8FF] dark:bg-[#581C87]/30 border border-[#E9D5FF] dark:border-[#7E22CE]/40 flex items-center justify-center text-[#9333EA] dark:text-[#C084FC] shrink-0 mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white">
                Organizations &amp; Tech Communities
              </h3>
              <p className="text-sm sm:text-[15px] text-[#4A4A4A] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                Active member and collaborator across forward-thinking developer networks and student organizations:
              </p>
              <div className="mt-4 flex flex-wrap gap-3 text-xs sm:text-sm">
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-4 py-2.5 rounded-xl text-[#262626] dark:text-[#F5F5F5] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6]" />
                  DEVCON LAGUNA
                </span>
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-4 py-2.5 rounded-xl text-[#262626] dark:text-[#F5F5F5] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                  CRYPTITA PLAYS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
