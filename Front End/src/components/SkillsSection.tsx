import React, { useState } from 'react';
import { skillsData, SkillGroup } from '../data/skills';
import { Terminal, Layout, Server, Database, Wrench, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeGroupIndex, setActiveGroupIndex] = useState<number | null>(null);

  const getGroupIcon = (name: string) => {
    switch (name) {
      case 'Programming Languages':
        return Terminal;
      case 'Frontend Development':
        return Layout;
      case 'Backend Development':
        return Server;
      case 'Databases':
        return Database;
      case 'Development Tools':
        return Wrench;
      default:
        return Terminal;
    }
  };

  const displayedGroups =
    activeGroupIndex !== null ? [skillsData[activeGroupIndex]] : skillsData;

  return (
    <section id="skills" className="py-12 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
              Core Competencies
            </span>
            <h2 className="text-2xl font-bold text-[#262626] dark:text-white mt-1">Technical Skills</h2>
            <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mt-1">
              Categorized technologies, programming languages, and engineering tools.
            </p>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveGroupIndex(null)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                activeGroupIndex === null
                  ? 'bg-[#262626] dark:bg-white text-white dark:text-black'
                  : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#A8A8A8] hover:text-[#262626] dark:hover:text-white'
              }`}
            >
              All (24)
            </button>
            {skillsData.map((group, idx) => (
              <button
                key={group.category}
                onClick={() => setActiveGroupIndex(idx)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  activeGroupIndex === idx
                    ? 'bg-[#262626] dark:bg-white text-white dark:text-black'
                    : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#A8A8A8] hover:text-[#262626] dark:hover:text-white'
                }`}
              >
                {group.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedGroups.map((group) => {
            const Icon = getGroupIcon(group.category);
            return (
              <div
                key={group.category}
                className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl p-5 shadow-xs hover:border-[#8E8E8E] dark:hover:border-[#525252] transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] flex items-center justify-center text-[#262626] dark:text-white">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#262626] dark:text-white">{group.category}</h3>
                  </div>
                </div>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mb-4">{group.description}</p>

                {/* Skills Chips */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
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
