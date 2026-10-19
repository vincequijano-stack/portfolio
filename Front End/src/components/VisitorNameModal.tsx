import React, { useState } from 'react';
import { User, Sparkles, Check, ArrowRight } from 'lucide-react';
import { profileData } from '../data/profile';
import { setVisitorName } from '../services/notificationService';

interface VisitorNameModalProps {
  isOpen: boolean;
  onClose: (name: string) => void;
  initialName?: string;
}

export const VisitorNameModal: React.FC<VisitorNameModalProps> = ({
  isOpen,
  onClose,
  initialName = '',
}) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your name or handle');
      return;
    }
    setVisitorName(cleanName);
    onClose(cleanName);
  };

  const handleGuest = () => {
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
    >
      <div
        className="w-full max-w-sm bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-2xl p-6 sm:p-7 text-center transition-all animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Instagram Profile Avatar with Animated Story Ring */}
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4] shadow-md animate-pulse">
            <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black overflow-hidden">
              <img
                src="/assets/images/headshot/headshot.jpg"
                alt={profileData.name}
                className="w-full h-full object-cover"
                style={{ objectPosition: '0% 20%' }}
              />
            </div>
          </div>
          <span className="absolute -bottom-1 -right-1 bg-[#0095F6] text-white p-1 rounded-full border-2 border-white dark:border-[#121212] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Title & Info */}
        <h2 id="visitor-modal-title" className="text-lg font-bold text-[#262626] dark:text-white mb-1.5">
          Welcome to My Portfolio!
        </h2>
        <p className="text-xs text-[#8E8E8E] dark:text-[#A8A8A8] mb-5 leading-relaxed">
          What should we call you? Enter your name or Instagram handle so Vince can see who's visiting and liking projects.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
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

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue to Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Guest fallback button */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full text-xs font-medium text-[#8E8E8E] dark:text-[#737373] hover:text-[#262626] dark:hover:text-white py-1 transition-colors"
          >
            Browse as Guest
          </button>
        </form>
      </div>
    </div>
  );
};
