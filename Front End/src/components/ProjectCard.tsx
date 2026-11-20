import React, { useRef, useState, useEffect } from 'react';
import { Layers, ArrowUpRight, Eye } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '../data/projects';
import { gsap } from '../lib/gsap';

export type ProjectCardVariant = 'reveal' | 'tilt' | 'curtain';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  variant?: ProjectCardVariant;
  index?: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  index = 0,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const tiltApiRef = useRef<{
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

      gsap.set(card, { transformPerspective: 1200, transformStyle: 'preserve-3d' });
      tiltApiRef.current = {
        rx: gsap.quickTo(card, 'rotationX', { duration: 0.35, ease: 'power3.out' }),
        ry: gsap.quickTo(card, 'rotationY', { duration: 0.35, ease: 'power3.out' }),
        y: gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power3.out' }),
      };

      return () => {
        tiltApiRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  const handleMouseEnter = () => {
    if (tiltApiRef.current) {
      tiltApiRef.current.y(-6);
    }
    if (spotRef.current && tiltApiRef.current) {
      gsap.to(spotRef.current, { opacity: 1, duration: 0.25, overwrite: 'auto' });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const api = tiltApiRef.current;
    const card = cardRef.current;
    if (!api || !card) return;

    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    api.rx((0.5 - py) * 7);
    api.ry((px - 0.5) * 7);

    if (spotRef.current) {
      spotRef.current.style.background = `radial-gradient(500px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%, rgba(255,255,255,0.09), transparent 55%)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (card && tiltApiRef.current) {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        y: 0,
        duration: 0.7,
        ease: 'expo.out',
        overwrite: 'auto',
      });
    }
    if (spotRef.current) {
      gsap.to(spotRef.current, { opacity: 0, duration: 0.35, overwrite: 'auto' });
    }
  };

  const number = String(index + 1).padStart(2, '0');

  return (
    <div className="h-full">
      <article
        ref={cardRef}
        onClick={() => onClick(project)}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full rounded-3xl bg-[#151515] border border-white/12 hover:border-white/45 overflow-hidden flex flex-col justify-between cursor-pointer select-none shadow-[0_14px_35px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.08)] transition-[border-color,box-shadow] duration-300"
      >
        {/* Dynamic Cursor Lighting Overlay */}
        <div
          ref={spotRef}
          className="pointer-events-none absolute inset-0 z-20 opacity-0"
        />

        <div>
          {/* 1. Consistent 16:10 Project Screenshot Container with Clipped Reveal, View Cursor & Scroll Parallax */}
          <div
            data-cursor="view"
            data-project-image-clip
            className="relative aspect-[16/10] w-full bg-[#0A0A0A] overflow-hidden border-b border-white/10"
          >
            <img
              src={hasError ? '/assets/images/projects/project-portfolio.svg' : project.thumbnail}
              alt={project.title}
              loading="lazy"
              data-parallax="0.035"
              onLoad={() => setImgLoaded(true)}
              onError={() => setHasError(true)}
              className={`w-full h-[108%] -mt-[4%] object-cover object-top transition-all duration-700 ease-out group-hover:scale-[1.06] ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {!imgLoaded && (
              <div className="absolute inset-0 bg-[#151515] animate-pulse flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#777777]" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-black/30 opacity-85 group-hover:opacity-55 transition-opacity duration-500" />

            <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
              <span className="font-mono-code text-[11px] font-bold text-white bg-[#0A0A0A]/80 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full">
                {number}
              </span>
              <span className="text-[11px] font-medium text-[#F5F5F5] bg-[#0A0A0A]/80 backdrop-blur-md border border-white/15 px-3 py-1 rounded-full">
                {project.category}
              </span>
            </div>

            {project.stats && (
              <span className="absolute top-3.5 right-3.5 z-10 font-mono-code text-[10px] uppercase tracking-wider text-[#0A0A0A] font-bold bg-white/95 px-2.5 py-1 rounded-full shadow">
                {project.stats.value}
              </span>
            )}
          </div>

          {/* 2. Card Body with Progressive Storytelling Details */}
          <div data-project-details-group className="p-6 sm:p-7">
            <div
              data-project-detail
              className="flex items-center justify-between text-[11px] font-mono-code text-[#777777] mb-2"
            >
              <span>{project.postedDate}</span>
              {project.stats && <span>{project.stats.label}</span>}
            </div>

            <h3
              data-project-detail
              className="font-display text-xl sm:text-2xl font-extrabold text-white group-hover:text-[#F5F5F5] tracking-tight leading-snug transition-transform duration-300 group-hover:translate-x-0.5"
            >
              {project.title}
            </h3>

            <p
              data-project-detail
              className="mt-3 text-xs sm:text-sm text-[#C8C8C8] leading-relaxed line-clamp-3"
            >
              {project.description}
            </p>

            <div data-project-detail className="mt-5 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-mono-code text-[#C8C8C8] bg-[#0A0A0A] border border-white/10 group-hover:border-white/20 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Card Footer Actions */}
        <div
          className="px-6 sm:px-7 pb-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2.5 relative z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 flex-1">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.2"
                className="group/btn flex-1 py-2.5 px-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.16)] active:scale-95"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => onClick(project)}
                data-magnetic="0.2"
                className="group/btn flex-1 py-2.5 px-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>View Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => onClick(project)}
              data-magnetic="0.2"
              className="py-2.5 px-3.5 rounded-full bg-[#242424] hover:bg-[#323232] text-white border border-white/15 hover:border-white/40 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              title="Inspect Project Architecture & Details"
            >
              <Eye className="w-3.5 h-3.5 text-[#C8C8C8]" />
              <span className="hidden sm:inline">Details</span>
            </button>
          </div>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="0.24"
              className="w-10 h-10 rounded-full bg-[#0A0A0A] hover:bg-white text-[#C8C8C8] hover:text-[#0A0A0A] border border-white/15 hover:border-white flex items-center justify-center shrink-0"
              title="View GitHub Repository"
              aria-label={`${project.title} GitHub Repository`}
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Bottom Silver Border Illumination on Hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </article>
    </div>
  );
};
