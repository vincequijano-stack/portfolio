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

const renderSkillLogo = (name: string) => {
  switch (name) {
    case 'JavaScript':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <rect width="32" height="32" rx="6" fill="#F7DF1E" />
          <path
            d="M20.8 22.8c.5.8 1.2 1.4 2.4 1.4 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.8-1.6l-.6-.3c-1.8-.8-3-1.7-3-3.8 0-1.9 1.4-3.3 3.7-3.3 1.6 0 2.8.6 3.6 2l-2 1.3c-.4-.8-.9-1.1-1.6-1.1-.7 0-1.2.5-1.2 1.1 0 .7.5 1 1.6 1.5l.6.3c2.1.9 3.3 1.8 3.3 4 0 2.3-1.8 3.5-4.2 3.5-2.3 0-3.8-1.1-4.5-2.6l2.1-1.2zm-8.9.2c.4.7.8 1.3 1.7 1.3.9 0 1.4-.3 1.4-1.7v-8.4h2.5v8.5c0 2.6-1.5 3.8-3.8 3.8-2 0-3.2-1-3.8-2.3l2-1.2z"
            fill="#000"
          />
        </svg>
      );
    case 'Java':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M11.8 23.3c-1 .6 1.1 1.8 3.8 1.9 2.3.1 4.8-.2 6-.8 0 0 .7.5 1.7.9-6 2.6-13.6-.1-11.5-2zm-1.1-3.1c-1.1.8 1 1.7 4.2 1.9 2.7.2 4.8-.1 6.3-.7 0 0 .4.4 1 .7-5.6 1.9-14 .1-11.5-1.9z"
            fill="#5382A1"
          />
          <path
            d="M17.9 14.5c1.5 1.7-.4 3.3-.4 3.3s3.8-2 2.1-4.4c-1.6-2.3-2.9-3.4 3.9-7.3 0 0-10.7 2.7-5.6 8.4z"
            fill="#E76F00"
          />
          <path
            d="M24.2 26c0 .1-1 .8-2.7 1.1-3.5.7-9.6.8-11.6.1-.8-.3 1.1-1 1.8-1.1.7-.1 1-.1 1-.1-1.3-.9-8.1 1.7-3.5 2.5 12.6 2.1 22.9-.9 19.6-2.5h-4.6zm-12.5-8.9c-5.4 1.3-2 4 4.1 4.4 2.1.1 5 .1 6.5-.4 0 0-.8.6-2.1.8-3.6.7-9.2.6-11.2-.3-2.9-1.2 1-3.8 2.7-4.5z"
            fill="#5382A1"
          />
          <path
            d="M19.8 18.2c4.4-2.3 2.4-4.5.9-4.2-.4.1-.5.2-.5.2s.1-.3.4-.4c2.8-1 5 2.9-.9 4.5 0 0 .1-.1.1-.1zm-4.1-13.7s3.2 3.2-3 8.1c-5 3.9-1.1 6.2 0 8.8-2.9-2.6-5.1-5-3.6-7.1 2.1-3.2 8-4.7 6.6-9.8z"
            fill="#E76F00"
          />
        </svg>
      );
    case 'React':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <circle cx="16" cy="16" r="2.6" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1.6" fill="none">
            <ellipse rx="12" ry="4.6" cx="16" cy="16" />
            <ellipse rx="12" ry="4.6" cx="16" cy="16" transform="rotate(60 16 16)" />
            <ellipse rx="12" ry="4.6" cx="16" cy="16" transform="rotate(120 16 16)" />
          </g>
        </svg>
      );
    case 'NextJS':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <circle cx="16" cy="16" r="14" fill="#000000" />
          <path
            d="M11 22V10h2.1l9.9 13.2a14 14 0 0 1-1.8 1.3L13 13.7V22h-2zm9.3-12h2v8.2l-2-2.7V10z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'NodeJS':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M16 3l11.5 6.6v13.2L16 29 4.5 22.8V9.6L16 3z"
            fill="#339933"
          />
          <path
            d="M17.2 21.8c-1.8 0-2.9-.8-3.4-2.1l1.8-.9c.3.7.8 1.2 1.7 1.2 1 0 1.6-.5 1.6-1.2 0-.6-.5-.9-1.7-1.3l-.6-.2c-1.5-.5-2.5-1.2-2.5-2.8 0-1.6 1.3-2.8 3.2-2.8 1.5 0 2.6.6 3.2 1.8l-1.7 1c-.3-.6-.8-1-1.5-1-.7 0-1.2.4-1.2 1 0 .6.4.8 1.5 1.2l.6.2c1.8.6 2.8 1.3 2.8 3 0 1.8-1.5 2.9-3.8 2.9zm-5.4-10v6.9c0 2.1-1.1 3.1-3 3.1-1.4 0-2.3-.7-2.8-1.7l1.7-1c.2.5.5.9 1.1.9.6 0 1-.3 1-1.2v-7h2z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'HTML':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path d="M5 3l2 22.8L16 29l9-3.2L27 3H5z" fill="#E34F26" />
          <path d="M16 5v21.8l7.3-2.6L24.8 5H16z" fill="#EF652A" />
          <path
            d="M16 13.5h-4l-.3-3h4.3V7.6H8.6l.8 8.8H16v-2.9zm0 7.6l-3.2-.9-.2-2.4H9.7l.4 4.6 5.9 1.6v-2.9zm0-7.6v2.9h3.6l-.3 3.7-3.3.9v2.9l5.9-1.6.8-8.8H16zm0-5.9v2.9h7.1l.3-2.9H16z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'CSS':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path d="M5 3l2 22.8L16 29l9-3.2L27 3H5z" fill="#1572B6" />
          <path d="M16 5v21.8l7.3-2.6L24.8 5H16z" fill="#33A9DC" />
          <path
            d="M16 13.4h3.9l.3-2.9H16V7.6h7.4l-.8 8.7H16v-2.9zm0 7.7l-3.2-.9-.2-2.4H9.7l.4 4.6 5.9 1.6v-2.9zm3.6-4.8l-.3 3.9-3.3.9v2.9l5.9-1.6.5-6.1h-2.8zm-3.6-2.9v2.9H9.3l-.3-2.9H16zm0-5.8v2.9H8.8l-.2-2.9H16z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'Figma':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path d="M11.5 28a4.5 4.5 0 0 0 4.5-4.5V19h-4.5a4.5 4.5 0 0 0 0 9z" fill="#0ACF83" />
          <path d="M7 14.5A4.5 4.5 0 0 1 11.5 10H16v9h-4.5A4.5 4.5 0 0 1 7 14.5z" fill="#A259FF" />
          <path d="M7 5.5A4.5 4.5 0 0 1 11.5 1H16v9h-4.5A4.5 4.5 0 0 1 7 5.5z" fill="#F24E1E" />
          <path d="M16 1h4.5a4.5 4.5 0 0 1 0 9H16V1z" fill="#FF7262" />
          <path d="M25 14.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0z" fill="#1ABCFE" />
        </svg>
      );
    case 'Python':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M15.9 3c-6.2 0-5.8 2.7-5.8 2.7v2.8h5.9v.9H7.8S3.8 9 3.8 15.2s3.5 6 3.5 6h2.1v-2.9s-.1-3.5 3.4-3.5h5.9s3.3.1 3.3-3.2V6.2S22.5 3 15.9 3zm-3.3 1.9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z"
            fill="#3776AB"
          />
          <path
            d="M16.1 29c6.2 0 5.8-2.7 5.8-2.7v-2.8H16v-.9h8.2s4 .4 4-5.8-3.5-6-3.5-6h-2.1v2.9s.1 3.5-3.4 3.5h-5.9S10 17.1 10 20.4v5.4S9.5 29 16.1 29zm3.3-1.9c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z"
            fill="#FFD43B"
          />
        </svg>
      );
    case 'SQLite':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <ellipse cx="16" cy="8" rx="10" ry="4" fill="#003B57" />
          <path
            d="M6 8v6c0 2.2 4.5 4 10 4s10-1.8 10-4V8c0 2.2-4.5 4-10 4S6 10.2 6 8z"
            fill="#0F80CC"
          />
          <path
            d="M6 15.5v6c0 2.2 4.5 4 10 4s10-1.8 10-4v-6c0 2.2-4.5 4-10 4s-10-1.8-10-4z"
            fill="#44A8E0"
          />
        </svg>
      );
    case 'Google Cloud':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M20.3 11.5l2.7-2.7.2-1.1A11 11 0 0 0 5.4 13l.9-.1 3.8-.6s.2-.3.3-.3a7.2 7.2 0 0 1 9.9-.5z"
            fill="#EA4335"
          />
          <path
            d="M26.5 13a11 11 0 0 0-3.3-5.3l-2.9 2.9a7.2 7.2 0 0 1 2.6 5.6v.7a3.6 3.6 0 0 1 0 7.2H16l-.7.8v2.9l.7.5h6.9a7.4 7.4 0 0 0 3.6-15.3z"
            fill="#4285F4"
          />
          <path
            d="M9.1 28.3H16v-3.8H9.1a3.6 3.6 0 0 1-1.5-.3l-1 .3-2.7 2.7-.2.9a7.4 7.4 0 0 0 5.4 1.2z"
            fill="#34A853"
          />
          <path
            d="M9.1 13.5a7.4 7.4 0 0 0-5.4 12.6l3.9-3.9a3.6 3.6 0 1 1 4.8-4.8l3.9-3.9a7.4 7.4 0 0 0-7.2 0z"
            fill="#FBBC05"
          />
        </svg>
      );
    case 'VSCode':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M23.5 3.3L12.1 14.2 5.5 9.1 3 10.4v11.2l2.5 1.3 6.6-5.1 11.4 10.9 5.5-2.7V6l-5.5-2.7zM6 18.2v-4.4l3.5 2.2L6 18.2zm17 4.3L15.6 16l7.4-6.5v13z"
            fill="#007ACC"
          />
        </svg>
      );
    case 'Vercel':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path d="M16 5L29 27H3L16 5z" fill="#000000" />
        </svg>
      );
    case 'Git':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M28.7 14.6L17.4 3.3a2 2 0 0 0-2.8 0l-2.3 2.3 3 3a2.4 2.4 0 0 1 3 3l2.9 2.9a2.4 2.4 0 1 1-1.4 1.4L17 13.1v7.2a2.4 2.4 0 1 1-2 0v-7.4a2.4 2.4 0 0 1-1.3-3.1l-2.9-2.9-7.5 7.5a2 2 0 0 0 0 2.8l11.3 11.3a2 2 0 0 0 2.8 0l11.3-11.3a2 2 0 0 0 0-2.6z"
            fill="#F05032"
          />
        </svg>
      );
    case 'AWS':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <path
            d="M9.6 15.6c0 .6.1 1.1.3 1.5l-1.5.5c-.2-.4-.3-.8-.4-1.3-.7.9-1.7 1.4-2.9 1.4-1.4 0-2.4-.9-2.4-2.3 0-1.6 1.3-2.5 3.4-2.5h1.5v-.5c0-1-.6-1.5-1.7-1.5-.8 0-1.6.2-2.3.6l-.4-1.3c.8-.5 1.8-.8 3-.8 2.1 0 3.3 1 3.3 3v3.2zm-2.9.6c.9 0 1.4-.6 1.4-1.4v-.7H6.8c-1.2 0-1.8.4-1.8 1.2 0 .6.4.9 1.1.9zm6.1 1.3l-2.1-7.8h1.9l1.2 5.4 1.3-5.4h1.7l1.3 5.4 1.2-5.4h1.8l-2.1 7.8h-1.8l-1.3-5.1-1.3 5.1h-1.8zm12.3.2c-1.1 0-2.2-.3-2.9-.8l.5-1.4c.7.4 1.5.7 2.4.7.9 0 1.4-.3 1.4-.9 0-.5-.4-.8-1.6-1.1-1.8-.5-2.6-1.1-2.6-2.4 0-1.4 1.2-2.4 3-2.4 1 0 1.9.2 2.6.6l-.5 1.3c-.6-.3-1.3-.5-2-.5-.8 0-1.3.3-1.3.8 0 .5.4.7 1.5 1 1.8.5 2.7 1.1 2.7 2.5 0 1.5-1.2 2.6-3.2 2.6z"
            fill="#232F3E"
          />
          <path
            d="M25.6 22.8c-3.2 2.3-7.8 3.5-11.8 3.5-5.6 0-10.6-2.1-14.4-5.5-.3-.3 0-.6.3-.4 4.1 2.4 9.2 3.8 14.4 3.8 3.5 0 7.4-.7 11-2.2.5-.2 1 .3.5.8zm1.3-1.5c-.4-.5-2.7-.2-3.7-.1-.3 0-.4-.2-.1-.4 1.8-1.3 4.8-.9 5.1-.5.3.4-.1 3.4-1.8 4.8-.3.2-.5.1-.4-.2.4-.9 1.3-3.1.9-3.6z"
            fill="#FF9900"
          />
        </svg>
      );
    case 'Canva':
      return (
        <svg viewBox="0 0 32 32" className="w-7 h-7">
          <defs>
            <linearGradient id="canvaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00C4CC" />
              <stop offset="50%" stopColor="#5A45FF" />
              <stop offset="100%" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <circle cx="16" cy="16" r="14" fill="url(#canvaGrad)" />
          <path
            d="M20.5 19.6c-.9 1.3-2.4 2.2-4.2 2.2-3 0-5.1-2.3-5.1-5.6 0-3.5 2.4-6 5.5-6 2.1 0 3.6 1 4 2.5.1.5-.2.9-.7.9-.4 0-.7-.2-.9-.6-.4-.8-1.2-1.3-2.3-1.3-2 0-3.3 1.7-3.3 4.3 0 2.4 1.2 4 3.1 4 1.2 0 2.2-.6 2.8-1.5.3-.4.7-.5 1.1-.2.3.3.3.8 0 1.3z"
            fill="#FFFFFF"
          />
        </svg>
      );
    default:
      return null;
  }
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
                    const logoSvg = renderSkillLogo(skill.name);
                    return (
                      <div
                        key={skill.name}
                        className="group bg-white border border-[#D4E0CD] rounded-2xl p-4 flex items-center gap-4 hover:border-[#283618] hover:shadow-md hover:-translate-y-0.5 transition-all"
                      >
                        <div className="w-13 h-13 rounded-2xl bg-[#FAFBF8] border border-[#D4E0CD] text-[#283618] font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 group-hover:border-[#8FA882] transition-all">
                          {logoSvg || brand.abbr}
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
