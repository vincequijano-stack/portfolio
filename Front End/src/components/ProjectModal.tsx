import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '../data/projects';
import { profileData } from '../data/profile';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNavigateContact?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNavigateContact,
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Close button outside on desktop */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-80 p-2 z-60 focus:outline-none"
        aria-label="Close modal"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Container (Instagram 2-column desktop layout) */}
      <div
        className="bg-white dark:bg-[#1C1C1C] rounded-lg sm:rounded-xl overflow-hidden max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-2xl border border-[#D4E0CD] dark:border-[#262626]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Project Visual / Image (55%) */}
        <div className="md:w-[55%] bg-black flex items-center justify-center relative overflow-hidden select-none min-h-[300px] md:min-h-[550px]">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-contain max-h-[90vh]"
          />

          {/* Metric Pill if present */}
          {project.stats && (
            <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-[#8FA882]" />
              <span>{project.stats.label}:</span>
              <strong className="text-white">{project.stats.value}</strong>
            </div>
          )}
        </div>

        {/* Right Column: Project Details & Information (45%) */}
        <div className="md:w-[45%] flex flex-col justify-between bg-white dark:bg-[#1C1C1C] max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b border-[#EBF1E6] dark:border-[#262626] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="story-ring w-9 h-9">
                <div className="story-ring-inner w-full h-full">
                  <img
                    src="/assets/images/headshot/headshot.jpg"
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                    style={{ objectPosition: '0% 20%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#283618] dark:text-white">
                    {profileData.name}
                  </span>
                  <span className="text-[10px] text-[#5C6B50] dark:text-[#737373]">· {project.category}</span>
                </div>
                <p className="text-[11px] text-[#5C6B50] dark:text-[#737373]">{profileData.role}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#5C6B50] hover:text-[#283618] dark:hover:text-white md:hidden p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body: Description, Tech Stack, Features */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-left">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#527043] dark:text-[#8FA882]">
                  {project.category}
                </span>
                {project.stats && (
                  <span className="text-[10px] font-semibold bg-[#EBF1E6] dark:bg-[#283618]/40 text-[#283618] dark:text-[#D4E0CD] px-2 py-0.5 rounded-full border border-[#D4E0CD] dark:border-[#527043]/40">
                    {project.stats.label}: {project.stats.value}
                  </span>
                )}
              </div>
              <h2 id="modal-project-title" className="text-lg font-bold text-[#283618] dark:text-white mt-0.5">
                {project.title}
              </h2>
            </div>

            {/* Detailed Description */}
            <p className="text-xs sm:text-sm text-[#4A5543] dark:text-[#D1D5DB] leading-relaxed">
              {project.longDescription}
            </p>

            {/* Key Features Bullets */}
            {project.features && project.features.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-[#5C6B50] dark:text-[#8E8E8E] mb-2">
                  Key Technical Capabilities
                </h4>
                <ul className="space-y-1.5">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-[#283618] dark:text-[#D1D5DB] flex items-start gap-2">
                      <span className="text-[#527043] dark:text-[#8FA882] mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Used Chips */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#5C6B50] dark:text-[#8E8E8E] mb-2">
                Technologies &amp; Libraries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-[#EBF1E6] dark:bg-[#262626] text-[#283618] dark:text-[#F5F5F5] font-medium px-2.5 py-1 rounded-md border border-[#D4E0CD] dark:border-[#333333]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row & External Links */}
          <div className="p-4 border-t border-[#EBF1E6] dark:border-[#262626] bg-[#FAFBF8] dark:bg-[#141414]">
            <div className="text-left mb-3">
              <p className="text-[10px] text-[#5C6B50] dark:text-[#737373] uppercase tracking-wide font-medium">
                {project.postedDate}
              </p>
            </div>

            {/* External Links Buttons */}
            <div className="grid grid-cols-2 gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-[#D4E0CD] dark:border-[#333333] hover:bg-[#EBF1E6] dark:hover:bg-[#262626] text-[#283618] dark:text-[#F5F5F5] text-xs font-semibold transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Repo</span>
                </a>
              )}
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#283618] hover:bg-[#3A4D28] text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateContact?.();
                  }}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#283618] hover:bg-[#3A4D28] text-white text-xs font-semibold transition-colors"
                >
                  <span>Inquire / Request</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
