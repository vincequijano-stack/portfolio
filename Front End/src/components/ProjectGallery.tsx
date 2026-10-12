import React from 'react';
import { ProjectCard } from './ProjectCard';
import { Project } from '../data/projects';
import { SearchX } from 'lucide-react';

interface ProjectGalleryProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  projects,
  onProjectClick,
  searchQuery,
  onClearSearch,
}) => {
  if (projects.length === 0) {
    return (
      <div className="py-16 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#EFEFEF] dark:bg-[#1A1A1A] flex items-center justify-center mb-3 text-[#8E8E8E]">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-[#262626] dark:text-white">No projects found</h3>
        <p className="text-xs text-[#8E8E8E] max-w-sm mt-1 mb-4">
          Try switching to another category.
        </p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#0095F6] hover:bg-[#1877F2] text-white transition-colors"
          >
            Show All Projects
          </button>
        )}
      </div>
    );
  }

  return (
    <section id="projects" className="pb-12">
      {/* 3-Column Square Instagram Grid matching reference image */}
      <div className="grid grid-cols-3 gap-1 md:gap-1.5">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </section>
  );
};
