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
  Info,
  Trash2,
  Loader2,
  Smile,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { Project } from '../data/projects';
import { profileData } from '../data/profile';
import { ensureVisitorName, getSessionName, getVisitorId, isOwnerUnlocked } from '../services/visitorSession';
import { likeService } from '../services/likeService';
import { commentService, ProjectComment } from '../services/commentService';
import { LikersModal } from './LikersModal';

function formatRelativeTime(timestamp?: number | string): string {
  if (!timestamp) return 'Just now';
  const num = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp);
  if (isNaN(num)) return typeof timestamp === 'string' ? timestamp : 'Recently';

  const diffMs = Date.now() - num;
  if (diffMs < 45_000) return 'Just now';
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(num).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

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
  const [comments, setComments] = useState<ProjectComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💬');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [isLikersModalOpen, setIsLikersModalOpen] = useState(false);
  const commentsEndRef = React.useRef<HTMLDivElement>(null);

  const currentVisitorId = getVisitorId();
  const isOwner = isOwnerUnlocked();

  useEffect(() => {
    if (project) {
      setIsLiked(likeService.isProjectLiked(project.id));
      setLikesCount(likeService.getLikesCount(project.id));
      setComments(commentService.getComments(project.id));
      commentService.fetchComments(project.id);
      setIsSaved(false);
      setNewComment('');
      setCommentError('');
    }
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const unsubLikes = likeService.subscribe(() => {
      setLikesCount(likeService.getLikesCount(project.id));
      setIsLiked(likeService.isProjectLiked(project.id));
    });
    const unsubComments = commentService.subscribe(() => {
      setComments(commentService.getComments(project.id));
    });
    return () => {
      unsubLikes();
      unsubComments();
    };
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

  const handleLikeToggle = async () => {
    if (!project) return;
    if (isLiked) {
      try {
        await likeService.toggleLike(project.id);
      } catch (err: any) {
        console.warn('Unlike failed:', err);
      }
    } else {
      // Must provide visitor name before first like
      const name = await ensureVisitorName();
      if (!name) {
        // Visitor cancelled the modal — do not submit the pending like!
        return;
      }
      try {
        await likeService.toggleLike(project.id, name);
      } catch (err: any) {
        alert(err?.message || 'Could not save like. Please try again.');
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newComment.trim() || isSubmitting) return;

    const visitorName = await ensureVisitorName();
    if (!visitorName) return; // Visitor cancelled the prompt modal

    setIsSubmitting(true);
    setCommentError('');
    try {
      await commentService.addComment(project.id, visitorName, newComment.trim(), selectedEmoji);
      setNewComment('');
      setTimeout(() => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setCommentError(err?.message || 'Could not post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!project) return;
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(project.id, commentId);
    } catch (err: any) {
      alert(err?.message || 'Could not delete comment.');
    }
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
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
                  {project.category}
                </span>
                {project.stats && (
                  <span className="text-[10px] font-semibold bg-[#E0F2FE] dark:bg-[#0369A1]/30 text-[#0284C7] dark:text-[#38BDF8] px-2 py-0.5 rounded-full border border-[#BAE6FD] dark:border-[#0284C7]/40">
                    {project.stats.label}: {project.stats.value}
                  </span>
                )}
              </div>
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
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wide text-[#8E8E8E] dark:text-[#737373] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-[#0095F6]" />
                  <span>Client &amp; Community Thoughts ({comments.length})</span>
                </h4>
                <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">Live Discussion</span>
              </div>

              {commentService.isLoading(project.id) && comments.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-xs text-[#8E8E8E] dark:text-[#737373] gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#0095F6]" />
                  <span>Loading comments...</span>
                </div>
              ) : comments.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-[#DBDBDB] dark:border-[#333333] bg-[#F9F9F9]/50 dark:bg-[#1A1A1A]/40 text-center my-1">
                  <p className="text-xs font-semibold text-[#262626] dark:text-[#E0E0E0]">No thoughts shared yet</p>
                  <p className="text-[11px] text-[#8E8E8E] dark:text-[#737373] mt-0.5">
                    Are you a client, recruiter, or collaborator? Leave your feedback or inquiry below!
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {comments.map((c) => {
                    const isAuthor = c.visitorId === currentVisitorId;
                    const canDelete = isAuthor || isOwner;
                    return (
                      <div
                        key={c.id}
                        className="group flex items-start gap-2.5 text-xs p-2 rounded-lg transition-colors hover:bg-[#F2F2F2]/60 dark:hover:bg-[#1F1F1F]/60"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#EFEFEF] dark:bg-[#262626] border border-[#DBDBDB]/40 dark:border-[#333333] flex items-center justify-center text-sm shrink-0 select-none shadow-2xs">
                          {c.avatar || '💬'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-[#262626] dark:text-white truncate">
                              {c.userName}
                            </span>
                            {isAuthor && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#0095F6]/10 text-[#0095F6] font-semibold">
                                You
                              </span>
                            )}
                            <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">
                              • {formatRelativeTime(c.timestamp || c.createdAt)}
                            </span>
                          </div>
                          <p className="text-[#333333] dark:text-[#E0E0E0] mt-0.5 leading-relaxed break-words whitespace-pre-wrap">
                            {c.text}
                          </p>
                        </div>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#8E8E8E] hover:text-[#ED4956] dark:text-[#737373] dark:hover:text-[#ED4956] rounded shrink-0 focus:opacity-100"
                            title={isOwner && !isAuthor ? 'Delete comment (Owner)' : 'Delete your comment'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                  <div ref={commentsEndRef} />
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
              <button
                type="button"
                onClick={() => setIsLikersModalOpen(true)}
                className="text-xs font-bold text-[#262626] dark:text-white hover:opacity-70 transition-opacity cursor-pointer text-left block"
                title="View who liked this post"
              >
                {likesCount} {likesCount === 1 ? 'like' : 'likes'}
              </button>
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
            <div className="mt-3 pt-2 border-t border-[#EFEFEF] dark:border-[#262626]">
              {commentError && (
                <p className="text-[11px] text-[#ED4956] font-medium mb-1.5">{commentError}</p>
              )}
              {/* Quick Reactions & Suggestion Chips */}
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-1">
                  {['💬', '💡', '🚀', '👏', '💼'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-xs p-1 rounded-md transition-all ${
                        selectedEmoji === emoji
                          ? 'bg-[#0095F6]/15 ring-1 ring-[#0095F6] scale-110'
                          : 'hover:bg-[#EFEFEF] dark:hover:bg-[#262626]'
                      }`}
                      title={`Select ${emoji} icon`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  {[
                    'Great project!',
                    'Interested in collaborating',
                    'Clean UI!',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNewComment(suggestion)}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] text-[#737373] dark:text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    id="comment-input"
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or inquiry..."
                    maxLength={500}
                    disabled={isSubmitting}
                    className="w-full text-xs text-[#262626] dark:text-[#F5F5F5] placeholder-[#8E8E8E] dark:placeholder-[#737373] bg-[#EFEFEF]/50 dark:bg-[#262626]/40 px-3 py-2 rounded-lg border border-transparent focus:border-[#0095F6] focus:bg-transparent transition-all focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Post</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Likers List Modal (Clicking "X likes") */}
      <LikersModal
        isOpen={isLikersModalOpen}
        onClose={() => setIsLikersModalOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
        likesCount={likesCount}
      />
    </div>
  );
};
