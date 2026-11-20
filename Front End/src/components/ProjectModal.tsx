import React, { useEffect } from 'react';
import {
  X,
  ExternalLink,
  Sparkles,
  Check,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#C8C8C8] hover:text-white p-2.5 rounded-full bg-[#151515] border border-white/15 z-60 focus:outline-none cursor-pointer"
        aria-label="Close modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Monochrome Glass Modal Container */}
      <div
        className="bg-[#151515] rounded-3xl overflow-hidden max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-[0_30px_80px_rgba(0,0,0,0.95)] border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Project Visual / Screenshot (55%) */}
        <div className="md:w-[55%] bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden select-none min-h-[280px] md:min-h-[540px] border-b md:border-b-0 md:border-r border-white/10">
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-contain max-h-[88vh]"
          />

          {project.stats && (
            <div className="absolute bottom-4 left-4 bg-[#0A0A0A]/85 backdrop-blur-md border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-mono-code flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#C8C8C8]" />
              <span className="text-[#C8C8C8]">{project.stats.label}:</span>
              <strong className="text-white">{project.stats.value}</strong>
            </div>
          )}
        </div>

        {/* Right Column: Project Details & Information (45%) */}
        <div className="md:w-[45%] flex flex-col justify-between bg-[#151515] max-h-[90vh]">
          {/* Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full p-[1.5px] bg-gradient-to-tr from-[#777777] to-white">
                <img
                  src="/assets/images/headshot/vince-studio-avatar.jpg"
                  alt={profileData.name}
                  className="w-full h-full rounded-full object-cover grayscale"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">
                    {profileData.name}
                  </span>
                  <span className="text-[10px] font-mono-code text-[#777777]">
                    · {project.category}
                  </span>
                </div>
                <p className="text-[11px] text-[#C8C8C8]">{profileData.role}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#C8C8C8] hover:text-white md:hidden p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-left">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-[11px] font-mono-code uppercase tracking-widest text-[#C8C8C8]">
                  {project.category}
                </span>
                {project.stats && (
                  <span className="text-[10px] font-mono-code bg-[#242424] text-white px-2.5 py-0.5 rounded-full border border-white/15">
                    {project.stats.label}: {project.stats.value}
                  </span>
                )}
              </div>
              <h2
                id="modal-project-title"
                className="font-display text-xl sm:text-2xl font-extrabold text-white"
              >
                {project.title}
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#C8C8C8] leading-relaxed">
              {project.longDescription}
            </p>

            {project.features && project.features.length > 0 && (
              <div className="pt-2">
                <h4 className="text-[11px] font-mono-code uppercase tracking-widest text-[#777777] mb-3">
                  Key Technical Capabilities
                </h4>
                <ul className="space-y-2">
                  {project.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className="text-xs sm:text-[13px] text-[#F5F5F5] flex items-start gap-2.5"
                    >
                      <span className="w-4 h-4 rounded-full bg-white/10 border border-white/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <h4 className="text-[11px] font-mono-code uppercase tracking-widest text-[#777777] mb-2.5">
                Technologies &amp; Architecture
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono-code bg-[#0A0A0A] text-[#C8C8C8] px-3 py-1 rounded-lg border border-white/12"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-5 border-t border-white/10 bg-[#0A0A0A]">
            <div className="text-left mb-3 flex items-center justify-between">
              <p className="text-[10px] font-mono-code text-[#777777] uppercase tracking-widest">
                RELEASED · {project.postedDate}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-white/20 hover:border-white bg-[#151515] hover:bg-[#242424] text-white text-xs font-bold transition-all"
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
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Project</span>
                </a>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateContact?.();
                  }}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold transition-all cursor-pointer"
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
