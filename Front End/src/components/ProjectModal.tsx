import React, { useEffect, useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Send,
  Sparkles,
  Info
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '../data/projects';
import { profileData } from '../data/profile';
import { notificationService } from '../services/notificationService';

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
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState<
    { user: string; text: string; time: string; avatar: string }[]
  >([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (project) {
      try {
        const savedLiked = localStorage.getItem(`project_liked_${project.id}`);
        const savedComments = localStorage.getItem(`project_comments_${project.id}`);
        const userLiked = savedLiked === 'true';
        setIsLiked(userLiked);
        setLikesCount(userLiked ? 1 : 0);
        setComments(savedComments ? JSON.parse(savedComments) : []);
      } catch {
        setIsLiked(false);
        setLikesCount(0);
        setComments([]);
      }
      setIsSaved(false);
      setNewComment('');
    }
  }, [project]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleLikeToggle = () => {
    if (!project) return;
    if (isLiked) {
      setLikesCount(0);
      setIsLiked(false);
      try {
        localStorage.removeItem(`project_liked_${project.id}`);
      } catch {}
    } else {
      setLikesCount(1);
      setIsLiked(true);
      try {
        localStorage.setItem(`project_liked_${project.id}`, 'true');
      } catch {}
      // Automatically trigger real-time like notification
      notificationService.recordLike({
        id: project.id,
        title: project.title,
        thumbnail: project.thumbnail,
      });
    }
    window.dispatchEvent(new CustomEvent('project_interaction_updated', { detail: { projectId: project.id } }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newComment.trim()) return;
    const updated = [
      ...comments,
      {
        user: 'guest_visitor',
        text: newComment.trim(),
        time: 'Just now',
        avatar: '👋',
      },
    ];
    setComments(updated);
    try {
      localStorage.setItem(`project_comments_${project.id}`, JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new CustomEvent('project_interaction_updated', { detail: { projectId: project.id } }));
    setNewComment('');
  };

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
        className="bg-white dark:bg-[#1C1C1C] rounded-lg sm:rounded-xl overflow-hidden max-w-5xl w-full max-h-[92vh] flex flex-col md:flex-row shadow-2xl border border-[#DBDBDB] dark:border-[#262626]"
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
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{project.stats.label}:</span>
              <strong className="text-white">{project.stats.value}</strong>
            </div>
          )}
        </div>

        {/* Right Column: Project Details & Information (45%) */}
        <div className="md:w-[45%] flex flex-col justify-between bg-white dark:bg-[#1C1C1C] max-h-[90vh]">
          {/* Header */}
          <div className="p-4 border-b border-[#EFEFEF] dark:border-[#262626] flex items-center justify-between">
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
                  <span className="text-xs font-bold text-[#262626] dark:text-white">
                    {profileData.username}
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0095F6] fill-[#0095F6] text-white" />
                  <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">· {project.category}</span>
                </div>
                <p className="text-[11px] text-[#8E8E8E] dark:text-[#737373]">{profileData.role}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white md:hidden p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body: Description, Tech Stack, Features & Comments */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 text-left">
            {/* Title & Category */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
                {project.category}
              </span>
              <h2 id="modal-project-title" className="text-lg font-bold text-[#262626] dark:text-white mt-0.5">
                {project.title}
              </h2>
            </div>

            {/* Detailed Description */}
            <p className="text-xs sm:text-sm text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed">
              {project.longDescription}
            </p>

            {/* Key Features Bullets */}
            {project.features && project.features.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wide text-[#737373] dark:text-[#8E8E8E] mb-2">
                  Key Technical Capabilities
                </h4>
                <ul className="space-y-1.5">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-[#333333] dark:text-[#D1D5DB] flex items-start gap-2">
                      <span className="text-[#0095F6] mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies Used Chips */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wide text-[#737373] dark:text-[#8E8E8E] mb-2">
                Technologies &amp; Libraries
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs bg-[#EFEFEF] dark:bg-[#262626] text-[#262626] dark:text-[#F5F5F5] font-medium px-2.5 py-1 rounded-md border border-[#DBDBDB]/40 dark:border-[#333333]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments List */}
            <div className="pt-3 border-t border-[#EFEFEF] dark:border-[#262626]">
              <h4 className="text-[11px] font-bold uppercase tracking-wide text-[#8E8E8E] dark:text-[#737373] mb-2">
                Community Feedback ({comments.length})
              </h4>
              {comments.length === 0 ? (
                <p className="text-xs text-[#8E8E8E] dark:text-[#737373] italic py-2">
                  No comments or inquiries yet. Leave a question or feedback below!
                </p>
              ) : (
                <div className="space-y-2">
                  {comments.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="text-sm select-none">{c.avatar}</span>
                      <div className="flex-1">
                        <span className="font-bold text-[#262626] dark:text-white mr-1.5">{c.user}</span>
                        <span className="text-[#4A4A4A] dark:text-[#D1D5DB]">{c.text}</span>
                        <p className="text-[10px] text-[#8E8E8E] dark:text-[#737373] mt-0.5">{c.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Row & External Links */}
          <div className="p-4 border-t border-[#EFEFEF] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414]">
            {/* Social Interaction Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLikeToggle}
                  className="hover:opacity-75 transition-transform active:scale-125 focus:outline-none"
                  aria-label="Like project"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? 'text-[#ED4956] fill-[#ED4956]' : 'text-[#262626] dark:text-[#F5F5F5]'
                    }`}
                  />
                </button>
                <button
                  onClick={() => document.getElementById('comment-input')?.focus()}
                  className="hover:opacity-75 text-[#262626] dark:text-[#F5F5F5]"
                  aria-label="Comment"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Project link copied to clipboard!');
                  }}
                  className="hover:opacity-75 text-[#262626] dark:text-[#F5F5F5]"
                  aria-label="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className="hover:opacity-75 text-[#262626] dark:text-[#F5F5F5]"
                aria-label="Save project"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-black dark:fill-white' : ''}`} />
              </button>
            </div>

            {/* Likes count & date */}
            <div className="text-left mb-3">
              <p className="text-xs font-bold text-[#262626] dark:text-white">
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </p>
              <p className="text-[10px] text-[#8E8E8E] dark:text-[#737373] uppercase tracking-wide">
                {project.postedDate}
              </p>
            </div>

            {/* External Links Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#EFEFEF] dark:border-[#262626]">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#DBDBDB] dark:border-[#333333] hover:bg-[#F2F2F2] dark:hover:bg-[#262626] text-[#262626] dark:text-[#F5F5F5] text-xs font-semibold transition-colors"
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
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold transition-colors shadow-xs"
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
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold transition-colors"
                >
                  <span>Inquire / Request</span>
                </button>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-3 pt-2 border-t border-[#EFEFEF] dark:border-[#262626]">
              <input
                id="comment-input"
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment or inquiry..."
                className="w-full text-xs text-[#262626] dark:text-[#F5F5F5] placeholder-[#8E8E8E] dark:placeholder-[#737373] bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="text-xs font-bold text-[#0095F6] hover:text-[#1877F2] disabled:opacity-40"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
