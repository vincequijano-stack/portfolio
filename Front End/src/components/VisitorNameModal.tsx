import React, { useState } from 'react';
import { User, Heart, ArrowRight, ShieldCheck, X, Mail } from 'lucide-react';
import { profileData } from '../data/profile';
import { setVisitorName, setOwnerEmail } from '../services/notificationService';

interface VisitorNameModalProps {
  isOpen: boolean;
  onClose: (name?: string) => void;
  initialName?: string;
}

export const VisitorNameModal: React.FC<VisitorNameModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const [isVerifyingOwner, setIsVerifyingOwner] = useState(false);
  const [ownerEmailInput, setOwnerEmailInput] = useState('');
  const [ownerError, setOwnerError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your name or @handle');
      return;
    }

    if (cleanName.toLowerCase().includes('vincelawrencequijano')) {
      setOwnerEmail(cleanName);
      onClose('Vince Quijano');
      return;
    }

    setVisitorName(cleanName);
    onClose(cleanName);
  };

  const handleVerifyOwnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = ownerEmailInput.toLowerCase().trim();
    if (clean.includes('vincelawrencequijano')) {
      setOwnerEmail(clean);
      onClose('Vince Quijano');
    } else {
      setOwnerError('Only owner email "vincelawrencequijano" has developer access.');
    }
  };

  const handleAnonymous = () => {
    const randomGuestId = Math.floor(1000 + Math.random() * 9000);
    const guestName = `Guest_${randomGuestId}`;
    setVisitorName(guestName);
    onClose(guestName);
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-modal-title"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-7 text-center transition-all animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 p-1 rounded-full text-[#8E8E8E] hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close"
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

        {!isVerifyingOwner ? (
          <>
            {/* Title & Info */}
            <h2 id="visitor-modal-title" className="text-base font-bold text-[#262626] dark:text-white mb-1">
              Who's liking this project?
            </h2>
            <p className="text-xs text-[#8E8E8E] dark:text-[#A8A8A8] mb-4 leading-relaxed">
              Please enter your name or Instagram handle for record purposes so Vince knows who supported his project!
            </p>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E] dark:text-[#737373]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Kenneth or @kenneth_dev"
                  maxLength={30}
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] dark:bg-[#1A1A1A] border ${
                    error ? 'border-[#ED4956]' : 'border-[#DBDBDB] dark:border-[#333333]'
                  } rounded-xl text-sm text-[#262626] dark:text-white placeholder-[#8E8E8E] dark:placeholder-[#737373] focus:outline-none focus:border-[#0095F6] dark:focus:border-[#0095F6] transition-colors`}
                />
              </div>

              {error && <p className="text-xs text-[#ED4956] font-medium text-left">{error}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#ED4956] hover:bg-[#D93845] active:scale-[0.98] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Like Project</span>
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleAnonymous}
                  className="text-xs font-medium text-[#8E8E8E] dark:text-[#737373] hover:text-[#262626] dark:hover:text-white transition-colors cursor-pointer"
                >
                  Like Anonymously
                </button>

                <button
                  type="button"
                  onClick={() => setIsVerifyingOwner(true)}
                  className="text-xs font-semibold text-[#0095F6] hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>I'm Vince (Owner)</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            {/* Developer/Owner verification step */}
            <h2 id="visitor-modal-title" className="text-base font-bold text-[#262626] dark:text-white mb-1">
              Verify Developer Email
            </h2>
            <p className="text-xs text-[#8E8E8E] dark:text-[#A8A8A8] mb-4 leading-relaxed">
              Confirm your developer email to unlock owner mode and never be asked again.
            </p>

            <form onSubmit={handleVerifyOwnerSubmit} className="space-y-3">
              <div className="relative text-left">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E] dark:text-[#737373]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={ownerEmailInput}
                  onChange={(e) => {
                    setOwnerEmailInput(e.target.value);
                    if (ownerError) setOwnerError('');
                  }}
                  placeholder="vincelawrencequijano@gmail.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FAFAFA] dark:bg-[#1A1A1A] border ${
                    ownerError ? 'border-[#ED4956]' : 'border-[#DBDBDB] dark:border-[#333333]'
                  } rounded-xl text-sm text-[#262626] dark:text-white placeholder-[#8E8E8E] dark:placeholder-[#737373] focus:outline-none focus:border-[#0095F6] dark:focus:border-[#0095F6] transition-colors`}
                />
              </div>

              {ownerError && <p className="text-xs text-[#ED4956] font-medium text-left">{ownerError}</p>}

              <button
                type="submit"
                className="w-full bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Owner</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVerifyingOwner(false)}
                className="w-full text-xs font-medium text-[#8E8E8E] dark:text-[#737373] hover:text-[#262626] dark:hover:text-white pt-1 transition-colors"
              >
                Back to Like Prompt
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
