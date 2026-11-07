import React, { useRef, useState } from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { Project } from '../data/projects';

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
  variant = 'reveal',
  index = 0,
}) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Style B: mouse-tracked tilt + spotlight
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (variant !== 'tilt' || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 8,
      mx: px * 100,
      my: py * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    if (variant !== 'tilt') return;
    setTilt({ rx: 0, ry: 0, mx: 50, my: 50, active: false });
  };

  const thumbnail = (
    <>
      <img
        src={hasError ? '/assets/images/projects/project-portfolio.svg' : project.thumbnail}
        alt={project.title}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-out ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        } ${
          variant === 'reveal'
            ? 'group-hover:scale-[1.06]'
            : variant === 'curtain'
            ? 'grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.04]'
            : ''
        }`}
      />
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#EBF1E6] animate-pulse flex items-center justify-center">
          <Layers className="w-6 h-6 text-[#8FA882]" />
        </div>
      )}
    </>
  );

  const techPreview = project.technologies.slice(0, 3);
  const extraTech = project.technologies.length - techPreview.length;
  const number = String(index + 1).padStart(2, '0');

  /* ---------------------------------------------------------------- */
  /* STYLE A — Lift & Reveal Panel                                     */
  /* ---------------------------------------------------------------- */
  if (variant === 'reveal') {
    return (
      <article
        onClick={() => onClick(project)}
        className="group relative aspect-[4/5] bg-[#EBF1E6] overflow-hidden rounded-2xl border border-[#D4E0CD] cursor-pointer shadow-xs hover:shadow-2xl hover:shadow-[#283618]/20 hover:-translate-y-1.5 hover:border-[#283618]/60 transition-all duration-500 ease-out select-none"
      >
        {thumbnail}

        {/* Soft gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2510]/90 via-[#1B2510]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Index chip */}
        <span className="absolute top-3 left-3 z-10 text-[10px] font-mono font-bold text-white/90 bg-black/30 backdrop-blur-md border border-white/20 px-2 py-0.5 rounded-full">
          {number}
        </span>

        {/* Sliding info panel */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 translate-y-[calc(100%-3.75rem)] sm:translate-y-[calc(100%-4.25rem)] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-white text-xs sm:text-sm font-extrabold truncate drop-shadow">
              {project.title}
            </h3>
            <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FAFBF8] text-[#283618] flex items-center justify-center shadow-md group-hover:rotate-45 transition-transform duration-500">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <p className="mt-2 text-[11px] sm:text-xs text-white/80 leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {project.description}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
            {techPreview.map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-semibold text-[#283618] bg-[#EBF1E6] px-2 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {extraTech > 0 && (
              <span className="text-[10px] font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full">
                +{extraTech}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  /* ---------------------------------------------------------------- */
  /* STYLE B — 3D Tilt & Cursor Spotlight                              */
  /* ---------------------------------------------------------------- */
  if (variant === 'tilt') {
    return (
      <div style={{ perspective: '900px' }}>
        <article
          ref={cardRef}
          onClick={() => onClick(project)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative aspect-[4/5] bg-[#EBF1E6] overflow-hidden rounded-2xl border border-[#D4E0CD] cursor-pointer select-none shadow-xs hover:shadow-2xl hover:shadow-[#283618]/25"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.active ? 1.02 : 1})`,
            transition: tilt.active
              ? 'transform 0.08s linear, box-shadow 0.4s ease'
              : 'transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease',
            transformStyle: 'preserve-3d',
          }}
        >
          {thumbnail}

          {/* Cursor spotlight */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: tilt.active ? 1 : 0,
              background: `radial-gradient(circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.28), transparent 45%)`,
            }}
          />

          {/* Sage border glow */}
          <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-[#8FA882]/70 transition-all duration-300 pointer-events-none" />

          {/* Floating glass footer */}
          <div
            className="absolute inset-x-2.5 bottom-2.5 z-10 rounded-xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg p-2.5 sm:p-3 flex items-center justify-between gap-2"
            style={{ transform: 'translateZ(40px)' }}
          >
            <div className="min-w-0">
              <h3 className="text-[#283618] text-xs sm:text-sm font-extrabold truncate">
                {project.title}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#526348] font-medium truncate">
                {techPreview.join(' · ')}
              </p>
            </div>
            <span className="shrink-0 text-[10px] sm:text-xs font-bold bg-[#283618] text-white px-3 py-1 rounded-full group-hover:bg-[#3A4D28] transition-colors">
              View →
            </span>
          </div>
        </article>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* STYLE C — Olive Curtain Wipe                                      */
  /* ---------------------------------------------------------------- */
  return (
    <article
      onClick={() => onClick(project)}
      className="group relative aspect-[4/5] bg-[#EBF1E6] overflow-hidden rounded-2xl border border-[#D4E0CD] cursor-pointer shadow-xs hover:shadow-xl hover:shadow-[#283618]/20 transition-shadow duration-500 select-none"
    >
      {thumbnail}

      {/* Resting state: subtle bottom title */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent pt-10 group-hover:opacity-0 transition-opacity duration-300">
        <h3 className="text-white text-xs sm:text-sm font-bold truncate">{project.title}</h3>
      </div>

      {/* Curtain wipe */}
      <div className="absolute inset-0 z-20 bg-gradient-to-br from-[#283618]/95 via-[#3A4D28]/95 to-[#527043]/95 [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] transition-[clip-path] duration-600 ease-[cubic-bezier(0.77,0,0.175,1)] flex flex-col justify-between p-4 sm:p-5 text-left">
        <span className="text-4xl sm:text-5xl font-black text-white/55 leading-none translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-100 drop-shadow-xs">
          {number}
        </span>

        <div className="translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-200">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4E0CD]">
            {project.category}
          </span>
          <h3 className="mt-1 text-white text-sm sm:text-lg font-black leading-snug line-clamp-2">
            {project.title}
          </h3>
          <div className="mt-2.5 h-px w-0 bg-[#8FA882] group-hover:w-full transition-all duration-700 delay-300" />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-semibold text-white/95 bg-white/10 border border-white/30 px-2 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#283618] bg-[#FAFBF8] px-3 py-1.5 rounded-full">
            View Project <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
