import React from 'react';
import { ProjectCard, ProjectCardVariant } from './ProjectCard';
import { Project } from '../data/projects';
import { SearchX } from 'lucide-react';

interface ProjectGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  variant?: ProjectCardVariant;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projects,
  onProjectClick,
  variant = 'tilt',
  onClearSearch,
}) => {
  if (projects.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#151515] border border-white/15 flex items-center justify-center mb-3 text-[#C8C8C8]">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white">No projects found</h3>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-4 px-5 py-2 rounded-full text-xs font-bold bg-white text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
          >
            Show All Projects
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pt-2">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            data-reveal
            style={{ '--reveal-delay': `${idx * 120}ms` } as React.CSSProperties}
            className="h-full"
          >
            <ProjectCard
              project={project}
              onClick={onProjectClick}
              variant={variant}
              index={idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
