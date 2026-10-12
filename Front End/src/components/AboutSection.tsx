import React from 'react';
import { GraduationCap, Code2, Rocket, Heart, BookOpen, Compass, Building2 } from 'lucide-react';
import { profileData } from '../data/profile';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-12 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
            Background &amp; Philosophy
          </span>
          <h2 className="text-2xl font-bold text-[#262626] dark:text-white mt-1">About Me</h2>
          <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mt-1">
            Bridging theoretical computer science foundations with modern full-stack web engineering.
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education & Academic Journey */}
          <div className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EFEFEF] dark:bg-[#262626] flex items-center justify-center text-[#0095F6]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#262626] dark:text-white">Computer Science</h3>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">Bachelor of Science Candidate</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              Pursuing a degree in Computer Science with a coursework focus on Algorithms &amp; Data Structures, Relational Database Management Systems, Operating Systems, Machine Learning Foundations, and Software Engineering.
            </p>
            <div className="mt-4 pt-4 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2 text-xs">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                GPA: 3.8 / 4.0
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Dean’s Honor List
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                ACM Student Member
              </span>
            </div>
          </div>

          {/* Development Focus & Interests */}
          <div className="p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#EFEFEF] dark:bg-[#262626] flex items-center justify-center text-[#10B981]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#262626] dark:text-white">Development Philosophy</h3>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8]">Crafting Scalable, Elegant Systems</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              I believe great software is where robust data modeling meets intuitive human interface design. From building clean React frontends to designing ACID-compliant database schemas and low-latency API pipelines, my goal is creating reliable digital tools.
            </p>
            <div className="mt-4 pt-4 border-t border-[#EFEFEF] dark:border-[#262626] flex flex-wrap gap-2 text-xs">
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Component Architecture
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                API Design
              </span>
              <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-2.5 py-1 rounded text-[#262626] dark:text-[#F5F5F5] font-medium">
                Data Mining
              </span>
            </div>
          </div>
        </div>

        {/* Organizations & Student Leadership */}
        <div className="mt-6 p-6 bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl text-left shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E0F2FE] dark:bg-[#0369A1]/30 border border-[#BAE6FD] dark:border-[#0284C7]/50 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8] shrink-0 mt-0.5">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-[#262626] dark:text-white">
                Organizations &amp; Student Leadership
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                Actively contributing to campus tech communities, open source workshops, and peer mentorship initiatives:
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  ACM Student Chapter Member
                </span>
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  Google Developer Student Clubs (GDSC)
                </span>
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  Junior Philippine Computer Society (JPCS)
                </span>
                <span className="bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] px-3 py-1.5 rounded-lg text-[#262626] dark:text-[#F5F5F5] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                  Academic Peer Tutor &amp; Code Mentor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Career Aspirations & Next Steps */}
        <div className="mt-6 p-6 bg-[#FAFAFA] dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl text-left">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#333333] flex items-center justify-center text-[#8B5CF6] shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#262626] dark:text-white">
                Career Goals &amp; Open Opportunities
              </h3>
              <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] mt-1 leading-relaxed">
                Currently looking for <strong>Software Engineering internships, Junior Web Developer positions, and collaborative open-source projects</strong>. Passionate about learning modern distributed systems, cloud deployments, and contributing high-impact code to engineering teams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
