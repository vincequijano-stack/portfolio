import React, { useEffect, useRef, useState } from 'react';
import { User, Heart, ShieldCheck, X } from 'lucide-react';
import { profileData } from '../data/profile';
import {
  NAME_MAX_LENGTH,
  subscribeToNamePrompt,
  validateDisplayName,
} from '../services/visitorSession';

interface VisitorNameModalProps {
  isOpen: boolean;
  /** Called with the validated name on Continue, or with no argument on Cancel. */
  onClose: (name?: string) => void;
  initialName?: string;
}

export const VisitorNameModal: React.FC<VisitorNameModalProps> = ({ isOpen, onClose, initialName = '' }) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialName);
    setError('');
    const t = window.setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKey, true);
    };
  }, [isOpen, initialName, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDisplayName(name);
    if (result.ok === false) {
      setError(result.error);
      inputRef.current?.focus();
      return;
    }
    onClose(result.value);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-modal-title"
      aria-describedby="visitor-modal-desc"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-7 text-center transition-all animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => onClose()}
          className="absolute top-4 right-4 p-1 rounded-full text-[#8E8E8E] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Cancel"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Floating Heart & Avatar */}
        <div className="relative inline-block mx-auto mb-3.5">
          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4] shadow-md">
            <div className="w-full h-full rounded-full p-[1.5px] bg-white dark:bg-black overflow-hidden">
              <img
                src="/assets/images/headshot/headshot.jpg"
                alt={profileData.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: '0% 20%' }}
              />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#ED4956] text-white p-1 rounded-full border-2 border-white dark:border-[#121212] shadow-xs">
            <Heart className="w-3 h-3 fill-white" />
          </span>
        </div>

        <h2 id="visitor-modal-title" className="text-base font-bold text-[#262626] dark:text-white mb-1">
          Before You Interact
        </h2>
        <p id="visitor-modal-desc" className="text-xs text-[#8E8E8E] dark:text-[#A8A8A8] mb-4 leading-relaxed">
          Let us know your name so the portfolio owner can see who appreciated their work.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div className="text-left">
            <label
              htmlFor="visitor-name-input"
              className="block text-xs font-semibold text-[#262626] dark:text-white mb-1"
            >
              Your Name <span className="text-[#ED4956]" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E] dark:text-[#737373]">
                <User className="w-4 h-4" />
              </div>
              <input
                id="visitor-name-input"
                ref={inputRef}
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your name"
                maxLength={NAME_MAX_LENGTH + 10}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'visitor-name-error' : 'visitor-name-privacy'}
                className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] dark:bg-[#1A1A1A] border ${
                  error ? 'border-[#ED4956]' : 'border-[#DBDBDB] dark:border-[#333333]'
                } rounded-xl text-sm text-[#262626] dark:text-white placeholder-[#8E8E8E] dark:placeholder-[#737373] focus:outline-none focus:border-[#0095F6] dark:focus:border-[#0095F6] transition-colors`}
              />
            </div>
          </div>

          {error && (
            <p id="visitor-name-error" role="alert" className="text-xs text-[#ED4956] font-medium text-left">
              {error}
            </p>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onClose()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#EFEFEF] dark:bg-[#262626] hover:bg-[#DBDBDB] dark:hover:bg-[#333333] text-sm font-semibold text-[#262626] dark:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>

          <button
            type="button"
            onClick={() => onClose(profileData.name)}
            className="w-full text-center text-[11px] text-[#8E8E8E] hover:text-[#0095F6] dark:hover:text-[#0095F6] pt-1 transition-colors cursor-pointer"
          >
            I&apos;m {profileData.name} (Portfolio Owner)
          </button>

          <p
            id="visitor-name-privacy"
            className="flex items-start gap-1.5 text-[10.5px] text-[#8E8E8E] dark:text-[#737373] text-left leading-snug pt-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
            <span>
              This prompt is for visiting clients &amp; collaborators so the portfolio owner can see who liked or commented on a project.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

/** Mount once (in App). Renders the name modal whenever any component calls requestVisitorName(). */
export const VisitorNamePromptHost: React.FC = () => {
  const [request, setRequest] = useState<{ initialName: string; resolve: (n: string | null) => void } | null>(
    null
  );

  useEffect(() => subscribeToNamePrompt(setRequest), []);

  const handleClose = React.useCallback(
    (name?: string) => {
      request?.resolve(name || null);
    },
    [request]
  );

  return <VisitorNameModal isOpen={Boolean(request)} initialName={request?.initialName || ''} onClose={handleClose} />;
};
