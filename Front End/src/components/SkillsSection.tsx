import React, { useState, useMemo, useRef, useEffect } from 'react';
import { skillsData } from '../data/skills';
import { gsap } from '../lib/gsap';
import {
  Terminal,
  Layout,
  Server,
  Database,
  Wrench,
  Palette,
  Layers,
} from 'lucide-react';

interface CategorizedSkill {
  name: string;
  level: string;
  tagline: string;
  abbr: string;
  sourceCategory: string;
}

type TargetSkillCategory =
  | 'Programming Languages'
  | 'Frontend Development'
  | 'Backend Development'
  | 'Database Management'
  | 'Development Tools'
  | 'UI/UX & Graphics Design';

interface SkillCategoryGroup {
  id: TargetSkillCategory;
  title: TargetSkillCategory;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  skills: CategorizedSkill[];
}

const SKILL_META: Record<
  string,
  {
    abbr: string;
    tagline: string;
    targetGroup: TargetSkillCategory;
  }
> = {
  JavaScript: {
    abbr: 'JS',
    tagline: 'ES6+ Interactive & Asynchronous Logic',
    targetGroup: 'Programming Languages',
  },
  Java: {
    abbr: 'JV',
    tagline: 'Object-Oriented Software Engineering',
    targetGroup: 'Programming Languages',
  },
  Python: {
    abbr: 'PY',
    tagline: 'Data Mining, Apriori/FP-Growth & Scripting',
    targetGroup: 'Programming Languages',
  },
  React: {
    abbr: 'RE',
    tagline: 'Component-Driven Frontend Architecture',
    targetGroup: 'Frontend Development',
  },
  NextJS: {
    abbr: 'NX',
    tagline: 'Full-Stack React Framework & SSR',
    targetGroup: 'Frontend Development',
  },
  HTML: {
    abbr: 'HT',
    tagline: 'Semantic Web Structure & Accessibility',
    targetGroup: 'Frontend Development',
  },
  CSS: {
    abbr: 'CS',
    tagline: 'Responsive Layouts, Grid & Motion Systems',
    targetGroup: 'Frontend Development',
  },
  NodeJS: {
    abbr: 'ND',
    tagline: 'Scalable Server-Side JavaScript Runtime',
    targetGroup: 'Backend Development',
  },
  SQLite: {
    abbr: 'SQ',
    tagline: 'Embedded Relational Database Management',
    targetGroup: 'Database Management',
  },
  Git: {
    abbr: 'GT',
    tagline: 'Distributed Version Control & Workflows',
    targetGroup: 'Development Tools',
  },
  VSCode: {
    abbr: 'VS',
    tagline: 'Code Editor, Debugging & Extensions',
    targetGroup: 'Development Tools',
  },
  Vercel: {
    abbr: 'VC',
    tagline: 'Serverless Cloud Deployment & CI/CD',
    targetGroup: 'Development Tools',
  },
  'Google Cloud': {
    abbr: 'GC',
    tagline: 'Cloud Infrastructure & Platform Services',
    targetGroup: 'Development Tools',
  },
  AWS: {
    abbr: 'AW',
    tagline: 'Amazon Web Services Cloud Computing',
    targetGroup: 'Development Tools',
  },
  Figma: {
    abbr: 'FG',
    tagline: 'UI/UX Prototyping, Wireframing & Design Systems',
    targetGroup: 'UI/UX & Graphics Design',
  },
  Canva: {
    abbr: 'CV',
    tagline: 'Visual Graphics, Branding & Layout Design',
    targetGroup: 'UI/UX & Graphics Design',
  },
};

const renderMonochromeSkillIcon = (name: string) => {
  switch (name) {
    case 'JavaScript':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M20.4 22.3c.5.7 1.1 1.3 2.2 1.3.9 0 1.5-.4 1.5-1.1 0-.8-.6-1-1.7-1.5l-.6-.3c-1.7-.7-2.8-1.6-2.8-3.5 0-1.8 1.3-3.1 3.4-3.1 1.5 0 2.6.5 3.4 1.9l-1.9 1.2c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.4l.6.3c2 .8 3.1 1.7 3.1 3.7 0 2.1-1.7 3.3-3.9 3.3-2.2 0-3.6-1-4.2-2.4l2-1.2zm-8.3.2c.4.7.7 1.2 1.6 1.2.8 0 1.3-.3 1.3-1.6v-7.8h2.3v7.9c0 2.4-1.4 3.5-3.5 3.5-1.9 0-3-.9-3.5-2.1l1.8-1.1z"
            fill="currentColor"
          />
        </svg>
      );
    case 'Java':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M11.8 23.3c-1 .6 1.1 1.8 3.8 1.9 2.3.1 4.8-.2 6-.8 0 0 .7.5 1.7.9-6 2.6-13.6-.1-11.5-2zm-1.1-3.1c-1.1.8 1 1.7 4.2 1.9 2.7.2 4.8-.1 6.3-.7 0 0 .4.4 1 .7-5.6 1.9-14 .1-11.5-1.9z" />
          <path d="M17.9 14.5c1.5 1.7-.4 3.3-.4 3.3s3.8-2 2.1-4.4c-1.6-2.3-2.9-3.4 3.9-7.3 0 0-10.7 2.7-5.6 8.4z" />
          <path d="M24.2 26c0 .1-1 .8-2.7 1.1-3.5.7-9.6.8-11.6.1-.8-.3 1.1-1 1.8-1.1.7-.1 1-.1 1-.1-1.3-.9-8.1 1.7-3.5 2.5 12.6 2.1 22.9-.9 19.6-2.5h-4.6zm-12.5-8.9c-5.4 1.3-2 4 4.1 4.4 2.1.1 5 .1 6.5-.4 0 0-.8.6-2.1.8-3.6.7-9.2.6-11.2-.3-2.9-1.2 1-3.8 2.7-4.5z" />
        </svg>
      );
    case 'Python':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M15.9 3c-6.2 0-5.8 2.7-5.8 2.7v2.8h5.9v.9H7.8S3.8 9 3.8 15.2s3.5 6 3.5 6h2.1v-2.9s-.1-3.5 3.4-3.5h5.9s3.3.1 3.3-3.2V6.2S22.5 3 15.9 3zm-3.3 1.9c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z" />
          <path
            d="M16.1 29c6.2 0 5.8-2.7 5.8-2.7v-2.8H16v-.9h8.2s4 .4 4-5.8-3.5-6-3.5-6h-2.1v2.9s.1 3.5-3.4 3.5h-5.9S10 17.1 10 20.4v5.4S9.5 29 16.1 29zm3.3-1.9c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z"
            opacity="0.7"
          />
        </svg>
      );
    case 'React':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <circle cx="16" cy="16" r="2.4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" fill="none">
            <ellipse rx="12" ry="4.5" cx="16" cy="16" />
            <ellipse rx="12" ry="4.5" cx="16" cy="16" transform="rotate(60 16 16)" />
            <ellipse rx="12" ry="4.5" cx="16" cy="16" transform="rotate(120 16 16)" />
          </g>
        </svg>
      );
    case 'NextJS':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M11 22V10h2.1l9.9 13.2a13 13 0 0 1-1.8 1.3L13 13.7V22h-2zm9.3-12h2v8.2l-2-2.7V10z"
            fill="currentColor"
          />
        </svg>
      );
    case 'NodeJS':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <path
            d="M16 3l11.5 6.6v13.2L16 29 4.5 22.8V9.6L16 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M17.2 21.8c-1.8 0-2.9-.8-3.4-2.1l1.8-.9c.3.7.8 1.2 1.7 1.2 1 0 1.6-.5 1.6-1.2 0-.6-.5-.9-1.7-1.3l-.6-.2c-1.5-.5-2.5-1.2-2.5-2.8 0-1.6 1.3-2.8 3.2-2.8 1.5 0 2.6.6 3.2 1.8l-1.7 1c-.3-.6-.8-1-1.5-1-.7 0-1.2.4-1.2 1 0 .6.4.8 1.5 1.2l.6.2c1.8.6 2.8 1.3 2.8 3 0 1.8-1.5 2.9-3.8 2.9z"
            fill="currentColor"
          />
        </svg>
      );
    case 'HTML':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <path
            d="M6 4l1.8 21L16 28l8.2-3L26 4H6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M10 10h12l-.8 9-5.2 1.5-5.2-1.5-.3-3.5h2.5l.1 1.5 2.9.8 2.9-.8.3-3.5H10.5L10 10z"
            fill="currentColor"
          />
        </svg>
      );
    case 'CSS':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <path
            d="M6 4l1.8 21L16 28l8.2-3L26 4H6z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            d="M10 10h12l-.4 4h-8l.2 2.5h7.5l-.5 5-4.8 1.5-4.8-1.5-.3-3h2.5l.1 1.2 2.5.8 2.5-.8.2-2.2h-7.7L10 10z"
            fill="currentColor"
          />
        </svg>
      );
    case 'SQLite':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
          <ellipse cx="16" cy="8" rx="10" ry="3.8" />
          <path d="M6 8v8c0 2.1 4.5 3.8 10 3.8s10-1.7 10-3.8V8" />
          <path d="M6 16v8c0 2.1 4.5 3.8 10 3.8s10-1.7 10-3.8v-8" />
        </svg>
      );
    case 'Vercel':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <path d="M16 5L28 26H4L16 5z" fill="currentColor" />
        </svg>
      );
    case 'Git':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M28.3 14.7L17.3 3.7a1.9 1.9 0 0 0-2.6 0l-2.2 2.2 2.8 2.8a2.2 2.2 0 0 1 2.8 2.8l2.7 2.7a2.2 2.2 0 1 1-1.3 1.3L16.9 13v6.8a2.2 2.2 0 1 1-1.8 0v-6.9a2.2 2.2 0 0 1-1.2-2.9l-2.7-2.7-7 7a1.9 1.9 0 0 0 0 2.6l11 11a1.9 1.9 0 0 0 2.6 0l10.5-10.5a1.9 1.9 0 0 0 0-2.7z" />
        </svg>
      );
    case 'VSCode':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M23.5 3.3L12.1 14.2 5.5 9.1 3 10.4v11.2l2.5 1.3 6.6-5.1 11.4 10.9 5.5-2.7V6l-5.5-2.7zM6 18.2v-4.4l3.5 2.2L6 18.2zm17 4.3L15.6 16l7.4-6.5v13z" />
        </svg>
      );
    case 'Google Cloud':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.85">
          <path d="M9.5 24.5h13a5.5 5.5 0 0 0 .8-10.9A8.5 8.5 0 0 0 7.2 12a5.8 5.8 0 0 0 2.3 12.5z" />
        </svg>
      );
    case 'AWS':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor">
          <path d="M25.6 22.8c-3.2 2.3-7.8 3.5-11.8 3.5-5.6 0-10.6-2.1-14.4-5.5-.3-.3 0-.6.3-.4 4.1 2.4 9.2 3.8 14.4 3.8 3.5 0 7.4-.7 11-2.2.5-.2 1 .3.5.8z" />
          <text x="5" y="17" fontSize="9.5" fontWeight="800" fontFamily="Montserrat, sans-serif">
            AWS
          </text>
        </svg>
      );
    case 'Figma':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 27a4 4 0 0 0 4-4v-4h-4a4 4 0 0 0 0 8z" />
          <path d="M8 15a4 4 0 0 1 4-4h4v8h-4a4 4 0 0 1-4-4z" />
          <path d="M8 7a4 4 0 0 1 4-4h4v8h-4a4 4 0 0 1-4-4z" />
          <path d="M16 3h4a4 4 0 0 1 0 8h-4V3z" />
          <circle cx="20" cy="15" r="4" />
        </svg>
      );
    case 'Canva':
      return (
        <svg viewBox="0 0 32 32" className="w-6 h-6">
          <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M20.5 19.6c-.9 1.3-2.4 2.2-4.2 2.2-3 0-5.1-2.3-5.1-5.6 0-3.5 2.4-6 5.5-6 2.1 0 3.6 1 4 2.5.1.5-.2.9-.7.9-.4 0-.7-.2-.9-.6-.4-.8-1.2-1.3-2.3-1.3-2 0-3.3 1.7-3.3 4.3 0 2.4 1.2 4 3.1 4 1.2 0 2.2-.6 2.8-1.5.3-.4.7-.5 1.1-.2.3.3.3.8 0 1.3z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return <Layers className="w-5 h-5" />;
  }
};

interface SkillCardProps {
  skill: CategorizedSkill;
  delayMs: number;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, delayMs }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<{
    rx: (v: number) => void;
    ry: (v: number) => void;
    y: (v: number) => void;
  } | null>(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      const card = cardRef.current;
      if (!card) return;
      gsap.set(card, { transformPerspective: 900, transformStyle: 'preserve-3d' });
      tiltRef.current = {
        rx: gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power3.out' }),
        ry: gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power3.out' }),
        y: gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power3.out' }),
      };
      return () => {
        tiltRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  const handleMouseEnter = () => {
    if (tiltRef.current) tiltRef.current.y(-4);
    if (spotRef.current && tiltRef.current) {
      gsap.to(spotRef.current, { opacity: 1, duration: 0.25, overwrite: 'auto' });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const api = tiltRef.current;
    const card = cardRef.current;
    if (!api || !card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    api.rx((0.5 - py) * 6);
    api.ry((px - 0.5) * 6);
    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(280px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.08), transparent 60%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card && tiltRef.current) {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        duration: 0.65,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
    if (spotRef.current) {
      gsap.to(spotRef.current, { opacity: 0, duration: 0.3, overwrite: 'auto' });
    }
  };

  return (
    <div
      data-reveal
      style={{ '--reveal-delay': `${delayMs}ms` } as React.CSSProperties}
      className="h-full"
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-white/45 p-4.5 flex flex-col justify-between gap-3.5 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.45)] hover:shadow-[0_18px_36px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.08)] transition-[border-color,box-shadow] duration-300"
      >
        <div ref={spotRef} className="pointer-events-none absolute inset-0 opacity-0" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div
              data-skill-icon
              className="w-12 h-12 rounded-xl bg-[#151515] border border-white/12 group-hover:border-white group-hover:bg-white text-[#C8C8C8] group-hover:text-[#0A0A0A] flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:scale-105"
            >
              {renderMonochromeSkillIcon(skill.name)}
            </div>
            <div className="min-w-0">
              <h4 className="font-display text-sm sm:text-base font-bold text-white truncate">
                {skill.name}
              </h4>
              <p className="text-xs text-[#777777] group-hover:text-[#C8C8C8] truncate transition-colors">
                {skill.tagline}
              </p>
            </div>
          </div>

          <span className="shrink-0 font-mono-code text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#151515] border border-white/10 text-[#C8C8C8] group-hover:border-white/30 group-hover:text-white transition-colors">
            {skill.level}
          </span>
        </div>

        {/* Full-Width Animated Silver Accent Line (No Invented Percentages) */}
        <div className="skill-line-track relative z-10" aria-hidden="true">
          <span data-skill-line className="skill-line-accent" />
        </div>
      </div>
    </div>
  );
};

export const SkillsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Organize actual skills from skillsData into the 6 clean categories
  const categorizedGroups: SkillCategoryGroup[] = useMemo(() => {
    const uniqueSkills = new Map<string, { name: string; level: string; sourceCategory: string }>();
    skillsData.forEach((group) => {
      group.skills.forEach((s) => {
        if (!uniqueSkills.has(s.name)) {
          uniqueSkills.set(s.name, {
            name: s.name,
            level: s.level,
            sourceCategory: group.category,
          });
        }
      });
    });

    const buckets: Record<TargetSkillCategory, CategorizedSkill[]> = {
      'Programming Languages': [],
      'Frontend Development': [],
      'Backend Development': [],
      'Database Management': [],
      'Development Tools': [],
      'UI/UX & Graphics Design': [],
    };

    uniqueSkills.forEach((item) => {
      const meta = SKILL_META[item.name] || {
        abbr: item.name.slice(0, 2).toUpperCase(),
        tagline: item.sourceCategory,
        targetGroup: 'UI/UX & Graphics Design' as TargetSkillCategory,
      };
      buckets[meta.targetGroup].push({
        name: item.name,
        level: item.level,
        tagline: meta.tagline,
        abbr: meta.abbr,
        sourceCategory: item.sourceCategory,
      });
    });

    return [
      {
        id: 'Programming Languages',
        title: 'Programming Languages',
        subtitle: 'Core languages used for software engineering, algorithms, and data mining.',
        icon: Terminal,
        skills: buckets['Programming Languages'],
      },
      {
        id: 'Frontend Development',
        title: 'Frontend Development',
        subtitle: 'Component architecture, semantic HTML, responsive CSS, and modern UI state.',
        icon: Layout,
        skills: buckets['Frontend Development'],
      },
      {
        id: 'Backend Development',
        title: 'Backend Development',
        subtitle: 'Server-side JavaScript runtime, Python/Java application logic, and REST APIs.',
        icon: Server,
        skills: buckets['Backend Development'],
      },
      {
        id: 'Database Management',
        title: 'Database Management',
        subtitle: 'Structured relational data persistence and query management.',
        icon: Database,
        skills: buckets['Database Management'],
      },
      {
        id: 'Development Tools',
        title: 'Development Tools',
        subtitle: 'Version control, cloud platforms, deployment pipelines, and development environments.',
        icon: Wrench,
        skills: buckets['Development Tools'],
      },
      {
        id: 'UI/UX & Graphics Design',
        title: 'UI/UX & Graphics Design',
        subtitle: 'UI/UX design systems, interactive prototyping, and visual asset creation.',
        icon: Palette,
        skills: buckets['UI/UX & Graphics Design'],
      },
    ];
  }, []);

  const displayedGroups = useMemo(() => {
    if (activeFilter === 'All') return categorizedGroups;
    return categorizedGroups.filter((g) => g.id === activeFilter);
  }, [activeFilter, categorizedGroups]);

  return (
    <section
      id="skills"
      className="relative py-24 sm:py-32 border-t border-white/10 text-left overflow-hidden"
    >
      {/* Subtle Background Watermark */}
      <span
        data-watermark
        aria-hidden="true"
        className="section-watermark font-display font-black uppercase tracking-tighter text-[15vw] sm:text-[11vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
      >
        ARSENAL
      </span>

      <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
        {/* Continuous Chapter Connector Bridge */}
        <div className="chapter-bridge" aria-hidden="true">
          <span data-chapter-bridge className="chapter-bridge-fill" />
        </div>

        {/* Editorial Section Header */}
        <div
          data-reveal="clip"
          className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                02 // TECHNICAL ARSENAL
              </span>
              <span data-header-rule className="h-px w-16 bg-white/25" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              TECHNICAL <span className="text-[#C8C8C8]">SKILLS</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {['All', ...categorizedGroups.map((g) => g.id)].map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  data-magnetic="0.14"
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0A0A0A] font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'bg-[#151515] text-[#C8C8C8] border border-white/12 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized Skills Grid */}
        <div className="space-y-8">
          {displayedGroups.map((group, groupIdx) => {
            const GroupIcon = group.icon;
            const gridColsClass =
              group.skills.length === 1
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

            return (
              <div
                key={group.id}
                data-reveal
                style={{ '--reveal-delay': `${groupIdx * 70}ms` } as React.CSSProperties}
                className="rounded-3xl bg-[#151515]/85 border border-white/12 p-6 sm:p-8"
              >
                {/* Category Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center text-white shrink-0">
                      <GroupIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                          {group.title}
                        </h3>
                        <span className="font-mono-code text-[11px] px-2.5 py-0.5 rounded-full bg-[#242424] text-[#C8C8C8] border border-white/10">
                          {group.skills.length}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#777777] mt-0.5">
                        {group.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="font-mono-code text-xs text-[#777777] uppercase tracking-widest">
                    0{groupIdx + 1} / 0{displayedGroups.length}
                  </span>
                </div>

                {/* Skill Cards Grid */}
                <div className={`grid ${gridColsClass} gap-4`}>
                  {group.skills.map((skill, skillIdx) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      delayMs={skillIdx * 60}
                    />
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
