import React from 'react';
import { GraduationCap, Code2, Trophy, Building2, Palette, Sparkles, MapPin } from 'lucide-react';
import { profileData } from '../data/profile';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
            Background &amp; Profile
          </span>
          <h2 className="text-2xl font-bold text-[#262626] dark:text-white mt-1">About Me</h2>
          <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mt-1">
            4th Year Computer Science Student from Pamantasan ng Cabuyao, focusing on full-stack web systems and UI/UX design.
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education & Academic Journey */}
          <div className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#E0F2FE] dark:bg-[#0369A1]/30 border border-[#BAE6FD] dark:border-[#0284C7]/40 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#262626] dark:text-white">Pamantasan ng Cabuyao</h3>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">Bachelor of Science in Computer Science</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              Currently a <strong>4th year Computer Science student</strong> at Pamantasan ng Cabuyao. Developing real-world solutions that combine robust backend architecture with responsive, intuitive frontends and thoughtful interface design.
            </p>
            <div className="mt-4 pt-4 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2 text-xs">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                4th Year Standing
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Pamantasan ng Cabuyao
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0095F6]" />
                Laguna, Philippines
              </span>
            </div>
          </div>

          {/* Development & Design Focus */}
          <div className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#ECFDF5] dark:bg-[#065F46]/30 border border-[#A7F3D0] dark:border-[#059669]/40 flex items-center justify-center text-[#10B981]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#262626] dark:text-white">Full-Stack &amp; Design Focus</h3>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">Bridging Functionality &amp; Aesthetics</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              Equipped with end-to-end web technologies including <strong>JavaScript, Java, React, NextJS, NodeJS, and Python</strong>. Additionally passionate about graphics and UI/UX designing with <strong>Figma and Canva</strong> to build cohesive, high-impact products like <strong>Cobuy</strong>.
            </p>
            <div className="mt-4 pt-4 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2 text-xs">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Full-Stack Web
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                UI/UX Prototyping
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Recommendation Systems
              </span>
            </div>
          </div>
        </div>

        {/* Organizations & Community */}
        <div className="mt-6 p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl text-left shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#F3E8FF] dark:bg-[#581C87]/30 border border-[#E9D5FF] dark:border-[#7E22CE]/40 flex items-center justify-center text-[#9333EA] dark:text-[#C084FC] shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-[#262626] dark:text-white">
                Organizations &amp; Tech Communities
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                Active member and collaborator across forward-thinking developer networks and student organizations:
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5 text-xs">
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3.5 py-2 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0095F6]" />
                  DEVCON LAGUNA
                </span>
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3.5 py-2 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EC4899]" />
                  CRYPTITA PLAYS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Spotlight: ImaGnation 2026 */}
        <div className="mt-6 p-6 bg-gradient-to-r from-[#FFFBEB] to-[#FEF3C7] dark:from-[#1C1917] dark:to-[#292524] border border-[#FDE68A] dark:border-[#44403C] rounded-xl text-left shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FEF08A] dark:bg-[#78350F]/40 border border-[#FACC15] dark:border-[#B45309]/50 flex items-center justify-center text-[#B45309] dark:text-[#FCD34D] shrink-0 mt-0.5">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#92400E] dark:text-[#FDE68A]">
                  Achievements &amp; Recognition
                </h3>
                <span className="bg-[#F59E0B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#78350F] dark:text-[#E7E5E4] mt-1 font-semibold">
                ImaGnation 2026 Participant
              </p>
              <p className="text-xs text-[#92400E]/80 dark:text-[#A8A29E] mt-0.5 leading-relaxed">
                Recognized participant in ImaGnation 2026, engaging in technology innovation, design ideation, and collaborative problem solving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
