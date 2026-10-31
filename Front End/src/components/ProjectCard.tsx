import React, { useState } from 'react';
import { Heart, MessageCircle, ExternalLink, Layers } from 'lucide-react';
import { Project } from '../data/projects';
import { likeService } from '../services/likeService';
import { commentService } from '../services/commentService';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(() => likeService.getLikesCount(project.id));
  const [commentsCount, setCommentsCount] = useState<number>(() => commentService.getCommentsCount(project.id));

  const syncStats = React.useCallback(() => {
    setLikesCount(likeService.getLikesCount(project.id));
    setCommentsCount(commentService.getCommentsCount(project.id));
  }, [project.id]);

  React.useEffect(() => {
    syncStats();
    const handleUpdate = () => syncStats();
    const unsubLikes = likeService.subscribe(() => syncStats());
    const unsubComments = commentService.subscribe(() => syncStats());
    window.addEventListener('project_interaction_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      unsubLikes();
      unsubComments();
      window.removeEventListener('project_interaction_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [syncStats]);

  return (
    <article
      onClick={() => onClick(project)}
      className="group relative aspect-square bg-[#EFEFEF] dark:bg-[#1A1A1A] overflow-hidden rounded-[3px] border border-[#DBDBDB]/40 dark:border-[#262626] cursor-pointer shadow-xs select-none"
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
        <div className="absolute inset-0 bg-[#EFEFEF] dark:bg-[#1A1A1A] animate-pulse flex items-center justify-center">
          <Layers className="w-6 h-6 text-[#DBDBDB] dark:text-[#333333]" />
        </div>
      )}

      {/* Multiple Post Carousel Icon (Top Right - exactly like Instagram in reference image) */}
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

      {/* Always-Visible Bottom Info Bar (so visitors on mobile & desktop know it's clickable) */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2 sm:p-3 pt-6 flex items-end justify-between gap-2 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-200">
        <div className="text-left min-w-0 flex-1">
          <h3 className="text-white text-[11px] sm:text-xs font-bold truncate drop-shadow-xs">
            {project.title}
          </h3>
          <div className="flex items-center gap-2.5 text-white/90 text-[10px] font-semibold mt-0.5">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 fill-[#ED4956] text-[#ED4956]" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 fill-white/80 text-white" />
              {commentsCount}
            </span>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold bg-[#0095F6] text-white px-2 py-0.5 rounded-full shadow-xs">
          View →
        </span>
      </div>

      {/* Instagram-Style Hover Overlay */}
      <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-center z-20">
        <h3 className="text-white text-sm font-bold drop-shadow line-clamp-2 px-2 mb-2">
          {project.title}
        </h3>

        {/* Likes and Comments Overlay Counter */}
        <div className="flex items-center gap-5 text-white font-bold text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-white" />
            <span>{likesCount}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>{commentsCount}</span>
          </div>
        </div>

        {/* Tech tags preview */}
        <div className="flex flex-wrap justify-center gap-1 max-w-[90%]">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] bg-white/20 text-white font-medium px-2 py-0.5 rounded backdrop-blur-xs"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] bg-white/20 text-white font-medium px-1.5 py-0.5 rounded">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        <span className="mt-3 text-[11px] font-semibold text-white/90 underline underline-offset-2">
          Click to View Details
        </span>
      </div>
    </article>
  );
};
