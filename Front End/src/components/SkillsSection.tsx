import React, { useState } from 'react';
import { skillsData } from '../data/skills';
import {
  Terminal,
  Layout,
  Server,
  Wrench,
  Palette,
  Sparkles,
  Layers,
} from 'lucide-react';

const SKILL_BRANDS: Record<string, { abbr: string; tagline: string }> = {
  JavaScript: { abbr: 'JS', tagline: 'ES6+ Interactive Web Logic' },
  Java: { abbr: 'JV', tagline: 'Object-Oriented Engineering' },
  React: { abbr: 'RE', tagline: 'Component-Driven Interfaces' },
  NextJS: { abbr: 'NX', tagline: 'Full-Stack React Framework' },
  NodeJS: { abbr: 'ND', tagline: 'Scalable Server Runtime' },
  HTML: { abbr: 'HT', tagline: 'Semantic Web Architecture' },
  CSS: { abbr: 'CS', tagline: 'Responsive Styling & Animations' },
  Figma: { abbr: 'FG', tagline: 'Interactive UI/UX Prototyping' },
  Python: { abbr: 'PY', tagline: 'Data Mining & Backend Scripting' },
  SQLite: { abbr: 'SQ', tagline: 'Relational Database Storage' },
  'Google Cloud': { abbr: 'GC', tagline: 'Cloud Infrastructure & APIs' },
  VSCode: { abbr: 'VS', tagline: 'Modern Development Environment' },
  Vercel: { abbr: 'VC', tagline: 'Edge Deployment & CI/CD' },
  Git: { abbr: 'GT', tagline: 'Version Control & Collaboration' },
  AWS: { abbr: 'AW', tagline: 'Cloud Services & Hosting' },
  Canva: { abbr: 'CV', tagline: 'Visual Branding & Assets' },
};

export const SkillsSection: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<string>('Core Stack');

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Core Stack':
        return Terminal;
      case 'Frontend Development':
        return Layout;
      case 'Backend Development':
        return Server;
      case 'Tools & Cloud':
        return Wrench;
      case 'Graphics Designing':
        return Palette;
      default:
        return Layers;
    }
  };

  return (
    <section id="skills" className="py-16 border-t border-[#D4E0CD] text-left">
      <div className="w-full">
        {/* Header */}
        <div className="mb-9">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3A4D28]">
            <Sparkles className="w-3.5 h-3.5" />
            Core Competencies
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#283618] mt-1 tracking-tight">
            Technical Skills &amp; Architecture
          </h2>
          <p className="text-sm sm:text-base text-[#526348] mt-1">
            Interactive full-stack architecture dock and categorized technology toolkit.
          </p>
        </div>

        {/* Interactive Architecture Pipeline Switcher */}
        <div className="bg-white border border-[#D4E0CD] rounded-3xl p-6 sm:p-8 shadow-sm">
          {/* Pipeline Nodes */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {skillsData.map((group, idx) => {
              const Icon = getCategoryIcon(group.category);
              const isActive = activeLayer === group.category;
              return (
                <button
                  key={group.category}
                  type="button"
                  onClick={() => setActiveLayer(group.category)}
                  className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    isActive
                      ? 'bg-gradient-to-br from-[#283618] to-[#527043] text-white border-[#283618] shadow-md shadow-[#283618]/20 -translate-y-0.5'
                      : 'bg-[#F3F6F0] text-[#283618] border-[#D4E0CD] hover:border-[#3A4D28]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-[#3A4D28]'}`} />
                    <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-white/85' : 'text-[#6B7F5E]'}`}>
                      0{idx + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight">{group.category}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Layer Visual App Icon Dock */}
          {skillsData
            .filter((g) => g.category === activeLayer)
            .map((group) => (
              <div
                key={group.category}
                className="p-6 rounded-2xl bg-[#F3F6F0] border border-[#D4E0CD]"
              >
                <p className="text-sm sm:text-base text-[#435339] mb-5">
                  {group.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {group.skills.map((skill) => {
                    const brand = SKILL_BRANDS[skill.name] || {
                      abbr: skill.name.slice(0, 2).toUpperCase(),
                      tagline: 'Modern Web Technology',
                    };
                    return (
                      <div
                        key={skill.name}
                        className="group bg-white border border-[#D4E0CD] rounded-2xl p-4 flex items-center gap-4 hover:border-[#283618] hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#283618] via-[#3A4D28] to-[#6B8A5B] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                          {brand.abbr}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-extrabold text-[#283618] truncate">
                            {skill.name}
                          </h4>
                          <p className="text-xs text-[#526348] truncate">
                            {brand.tagline}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
