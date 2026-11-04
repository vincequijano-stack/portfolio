import React, { useState, useEffect } from 'react';
import { ArrowRight, Code2, Sparkles, Terminal } from 'lucide-react';
import { profileData } from '../data/profile';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar smoothly
    const start = Date.now();
    const duration = 2200;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 30);

    // Auto-enter after the signature reveal (visitors can also click Enter anytime)
    const fadeTimer = setTimeout(() => setIsFadingOut(true), 2400);
    const doneTimer = setTimeout(() => onComplete(), 2750);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  const handleEnterNow = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-between py-10 px-4 bg-[#FAFBF8]/95 backdrop-blur-xl transition-opacity duration-350 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Entrance"
    >
      {/* Subtle Ambient Sage & Olive Radial Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-[#8FA882]/25 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#283618]/10 blur-[80px]" />
      </div>

      {/* Top Bar: Status Pill & Skip Button */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF1E6] border border-[#D4E0CD] text-[11px] font-semibold text-[#283618]">
          <span className="w-2 h-2 rounded-full bg-[#527043] animate-pulse" />
          <span>PORTFOLIO {new Date().getFullYear()}</span>
        </div>

        <button
          type="button"
          onClick={handleEnterNow}
          className="text-xs font-semibold text-[#526348] hover:text-[#283618] px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-[#EBF1E6] border border-[#D4E0CD] transition-all cursor-pointer"
        >
          Skip →
        </button>
      </div>

      {/* Center Architectural Developer Card */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center my-auto">
        {/* Monogram / Portrait Emblem with Sage & Olive Ring */}
        <div className="relative mb-6 group cursor-pointer" onClick={handleEnterNow}>
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-[#283618]/20 via-[#527043]/25 to-[#8FA882]/30 blur-xl animate-pulse" />
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-[3px] bg-gradient-to-tr from-[#283618] via-[#527043] to-[#8FA882] shadow-xl">
            <div className="w-full h-full rounded-[21px] bg-[#FAFBF8] p-1 overflow-hidden relative">
              <img
                src="/assets/images/headshot/headshot.jpg"
                alt={profileData.name}
                className="w-full h-full rounded-[17px] object-cover"
                style={{ objectPosition: '0% 20%' }}
              />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#283618] text-[#FAFBF8] flex items-center justify-center shadow-md border-2 border-[#FAFBF8]">
            <Code2 className="w-4 h-4 text-[#8FA882]" />
          </div>
        </div>

        {/* Name & Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF1E6] border border-[#D4E0CD] text-[11px] font-bold uppercase tracking-widest text-[#3A4D28] mb-3">
          <Sparkles className="w-3 h-3 text-[#527043]" />
          <span>{profileData.role}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#283618]">
          {profileData.name}
        </h1>

        <p className="text-xs sm:text-sm text-[#526348] mt-2 max-w-xs leading-relaxed font-medium">
          Full-Stack Web Architecture · Data Mining Systems · Intuitive UI/UX Design
        </p>

        {/* Loading / System Initialization Progress Card */}
        <div className="w-full mt-7 p-4 sm:p-5 bg-white/90 rounded-2xl border border-[#D4E0CD] shadow-lg shadow-[#283618]/5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#526348] mb-2">
            <span className="flex items-center gap-1.5 font-semibold text-[#283618]">
              <Terminal className="w-3.5 h-3.5 text-[#527043]" />
              <span>Initializing workspace...</span>
            </span>
            <span className="font-bold text-[#283618]">{progress}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-2 rounded-full bg-[#EBF1E6] overflow-hidden p-[1px] border border-[#D4E0CD]/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#283618] via-[#527043] to-[#8FA882] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <button
            type="button"
            onClick={handleEnterNow}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-[#283618] hover:bg-[#3A4D28] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-[#283618]/15"
          >
            <span>Enter Portfolio</span>
            <ArrowRight className="w-4 h-4 text-[#8FA882]" />
          </button>
        </div>
      </div>

      {/* Bottom Minimalist Signature */}
      <div className="relative z-10 flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#5C6B50]">
          Designed &amp; Engineered by
        </span>
        <span className="text-xs font-extrabold tracking-wider text-[#283618]">
          VINCE QUIJANO
        </span>
      </div>
    </div>
  );
};
