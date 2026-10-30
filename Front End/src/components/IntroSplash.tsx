import React, { useState, useRef, useEffect } from 'react';
import { InstagramIcon } from './SocialIcons';
import { CheckCircle2, ArrowRight, User } from 'lucide-react';
import { profileData } from '../data/profile';
import {
  setSessionName,
  validateDisplayName,
  getSessionName,
  isOwnerUnlocked,
} from '../services/visitorSession';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const isOwner = isOwnerUnlocked();
  const [visitorName, setVisitorNameInput] = useState(() => getSessionName() || '');
  const [error, setError] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If owner replays intro, auto-dismiss without asking for a name
    if (isOwner) {
      const fadeTimer = setTimeout(() => setIsFadingOut(true), 1300);
      const doneTimer = setTimeout(() => onComplete(), 1650);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(doneTimer);
      };
    }

    // Focus the name input immediately for visitors
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, [isOwner, onComplete]);

  const handleFinish = (finalName: string) => {
    setSessionName(finalName);
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateDisplayName(visitorName);
    if (result.ok === false) {
      setError(result.error);
      inputRef.current?.focus();
      return;
    }
    handleFinish(result.value);
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-between py-10 px-4 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-opacity duration-350 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Entrance"
    >
      {/* Top spacer */}
      <div className="w-full flex justify-end max-w-sm sm:max-w-md min-h-[28px]">
        {isOwner && (
          <button
            type="button"
            onClick={() => onComplete()}
            className="text-xs font-medium text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white px-3.5 py-1.5 rounded-full border border-[#DBDBDB]/60 dark:border-[#262626] transition-colors cursor-pointer"
          >
            <span>Skip Intro</span>
          </button>
        )}
      </div>

      {/* Center Welcome Card */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
        {/* Glowing Instagram Camera Glyph */}
        <div className="relative group mb-5">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-3xl blur-xl opacity-35 dark:opacity-45 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[24px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-2xl flex items-center justify-center animate-logo-pulse">
            <div className="w-full h-full bg-white dark:bg-black rounded-[21px] flex items-center justify-center">
              <InstagramIcon className="w-10 h-10 sm:w-12 sm:h-12 text-black dark:text-white stroke-[1.8]" />
            </div>
          </div>
        </div>

        {/* Brand Text */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#262626] dark:text-white flex items-center justify-center gap-1.5">
          <span>@{profileData.username}</span>
          <CheckCircle2 className="w-5 h-5 text-[#0095F6] fill-[#0095F6] text-white inline-block" />
        </h1>
        <p className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#A8A8A8] mt-1 font-medium">
          Personal Portfolio &amp; Developer Profile
        </p>

        {/* Name Prompt Box — ONLY shown to visitors who are NOT the owner */}
        {!isOwner && (
          <div className="w-full mt-6 p-5 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl border border-[#DBDBDB] dark:border-[#262626] shadow-xl text-left">
            <div className="text-center mb-4">
              <h2 className="text-base font-bold text-[#262626] dark:text-white">
                Welcome to my portfolio!
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="intro-visitor-name" className="sr-only">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8E8E8E] dark:text-[#737373]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="intro-visitor-name"
                    ref={inputRef}
                    type="text"
                    value={visitorName}
                    onChange={(e) => {
                      setVisitorNameInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your name (e.g. Alex, Sarah, Recruiter)..."
                    maxLength={40}
                    className={`w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#1A1A1A] text-[#262626] dark:text-white placeholder-[#8E8E8E] dark:placeholder-[#737373] border transition-all focus:outline-none ${
                      error
                        ? 'border-[#ED4956] ring-1 ring-[#ED4956]'
                        : 'border-[#DBDBDB] dark:border-[#333333] focus:border-[#0095F6] focus:ring-1 focus:ring-[#0095F6]'
                    }`}
                  />
                </div>
                {error && (
                  <p className="text-[11px] text-[#ED4956] font-medium mt-1.5 pl-1">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md"
              >
                <span>Enter Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom: Meta-style footer */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E8E8E] dark:text-[#737373]">
          from
        </span>
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
          VINCE QUIJANO
        </div>
      </div>
    </div>
  );
};
