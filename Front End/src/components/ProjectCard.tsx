import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <article
      onClick={() => onClick(project)}
      className="group relative aspect-[4/5] bg-[#EBF1E6] overflow-hidden rounded-[6px] border border-[#D4E0CD] hover:border-[#283618] cursor-pointer shadow-xs hover:shadow-xl hover:shadow-[#283618]/15 transition-all select-none"
    >
      {/* Thumbnail Image */}
      <img
        src={hasError ? '/assets/images/projects/project-portfolio.svg' : project.thumbnail}
        alt={project.title}
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Loading Skeleton */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#EBF1E6] animate-pulse flex items-center justify-center">
          <Layers className="w-6 h-6 text-[#8FA882]" />
        </div>
      )}

      {/* Multiple Post Carousel Icon (Top Right) */}
      <div className="absolute top-2.5 right-2.5 text-white drop-shadow-md z-10 pointer-events-none opacity-90">
        <svg
          className="w-4 h-4 fill-white drop-shadow"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 14H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1z" />
          <path d="M21 7v12c0 1.1-.9 2-2 2H7v-2h12V7h2z" fillOpacity="0.7" />
        </svg>
      </div>

      {/* Always-Visible Bottom Info Bar (Title + View → button only) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 sm:p-4 pt-8 flex items-center justify-between gap-2 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
        <div className="text-left min-w-0 flex-1">
          <h3 className="text-white text-xs sm:text-sm font-bold truncate drop-shadow-xs">
            {project.title}
          </h3>
        </div>
        <span className="shrink-0 text-[10px] sm:text-xs font-bold bg-[#283618] text-white px-3 py-1 rounded-full shadow-xs">
          View →
        </span>
      </div>

      {/* Hover Overlay (Title, Tech tags & View button) */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center z-20">
        <h3 className="text-white text-sm sm:text-base font-bold drop-shadow line-clamp-2 px-2 mb-3">
          {project.title}
        </h3>

        {/* Tech tags preview */}
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[90%]">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] sm:text-xs bg-white/20 text-white font-medium px-2.5 py-0.5 rounded backdrop-blur-xs"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] sm:text-xs bg-white/20 text-white font-medium px-2 py-0.5 rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <span className="mt-4 text-xs font-bold bg-[#283618] text-white px-4 py-1.5 rounded-full shadow-sm">
          View →
        </span>
      </div>
    </article>
  );
};
