import React, { useEffect, useState } from 'react';
import { InstagramIcon } from './SocialIcons';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { profileData } from '../data/profile';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 1600; // 1.6 seconds

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          onComplete();
        }, 400); // Wait for fade-out animation
      }
    }, 25);

    return () => clearInterval(timer);
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 200);
  };

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-100 flex flex-col items-center justify-between py-12 px-6 bg-white dark:bg-black transition-opacity duration-400 cursor-pointer select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="banner"
      aria-label="Welcome Intro Screen"
    >
      {/* Top spacer / Skip hint */}
      <div className="w-full flex justify-end max-w-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSkip();
          }}
          className="text-xs font-medium text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white px-3 py-1.5 rounded-full border border-[#DBDBDB]/60 dark:border-[#262626] flex items-center gap-1 transition-colors backdrop-blur-xs"
        >
          <span>Skip</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center: Glowing Instagram Camera Glyph */}
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative group">
          {/* Subtle Ambient Gradient Glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-3xl blur-xl opacity-35 dark:opacity-45 animate-pulse" />

          {/* Icon Box */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-[3px] shadow-2xl flex items-center justify-center animate-logo-pulse">
            <div className="w-full h-full bg-white dark:bg-black rounded-[25px] flex items-center justify-center">
              <InstagramIcon className="w-12 h-12 sm:w-14 sm:h-14 text-black dark:text-white stroke-[1.8]" />
            </div>
          </div>
        </div>

        {/* Brand Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-[#262626] dark:text-white flex items-center justify-center gap-1.5">
            <span>@{profileData.username}</span>
            <CheckCircle2 className="w-5 h-5 text-[#0095F6] fill-[#0095F6] text-white inline-block" />
          </h1>
          <p className="text-xs sm:text-sm text-[#8E8E8E] dark:text-[#A8A8A8] mt-1 font-medium">
            Personal Portfolio &amp; Developer Profile
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-36 h-1 bg-[#EFEFEF] dark:bg-[#262626] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#0095F6] rounded-full transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom: Meta-style footer */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#8E8E8E] dark:text-[#737373]">
          from
        </span>
        <div className="flex items-center gap-1 text-sm font-bold bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">
          VINCE QUIJANO
        </div>
      </div>
    </div>
  );
};
