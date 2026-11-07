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
  variant = 'reveal',
  onClearSearch,
}) => {
  if (projects.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#EBF1E6] flex items-center justify-center mb-3 text-[#8FA882]">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-[#283618]">No projects found</h3>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#283618] hover:bg-[#3A4D28] text-white transition-colors"
          >
            Show All Projects
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pt-2">
      {/* 3-Column Grid with staggered scroll reveal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            data-reveal
            style={{ '--reveal-delay': `${idx * 120}ms` } as React.CSSProperties}
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
