import React, { useState } from 'react';
import { skillsData, SkillGroup } from '../data/skills';
import { Terminal, Layout, Server, Database, Wrench, Palette, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const getGroupIcon = (name: string) => {
    switch (name) {
      case 'Core Stack':
      case 'Programming Languages':
        return Terminal;
      case 'Frontend Development':
        return Layout;
      case 'Backend Development':
        return Server;
      case 'Databases':
        return Database;
      case 'Tools & Cloud':
      case 'Development Tools':
        return Wrench;
      case 'Graphics Designing':
        return Palette;
      default:
        return Terminal;
    }
  };

  return (
    <section id="skills" className="py-14 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0095F6]">
            Core Competencies
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#262626] dark:text-white mt-1">Technical Skills</h2>
          <p className="text-sm sm:text-base text-[#737373] dark:text-[#A8A8A8] mt-1.5">
            Categorized technologies, programming languages, and design tools.
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {skillsData.map((group) => {
            const Icon = getGroupIcon(group.category);
            return (
              <div
                key={group.category}
                className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#8E8E8E] dark:hover:border-[#525252] transition-colors"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#262626] dark:text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#262626] dark:text-white">{group.category}</h3>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A8A8A8] mb-5 leading-relaxed">{group.description}</p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={`flex items-center px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
                        skill.isPrimary
                          ? 'bg-[#FAFAFA] dark:bg-[#262626] border-[#DBDBDB] dark:border-[#333333] text-[#262626] dark:text-white font-semibold'
                          : 'bg-white dark:bg-[#141414] border-[#EFEFEF] dark:border-[#262626] text-[#4A4A4A] dark:text-[#D1D5DB]'
                      }`}
                    >
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
