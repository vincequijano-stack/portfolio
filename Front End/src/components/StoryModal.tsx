import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Code2,
  Grid,
  Award,
  Trophy,
  Building2,
  ArrowRight,
  MapPin,
  ExternalLink,
  Users,
} from 'lucide-react';
import { profileData } from '../data/profile';
import { eventStories } from '../data/events';

interface StoryModalProps {
  storyId: string | null;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  storyId,
  onClose,
  onNavigateSection,
}) => {
  // 1. Classic Highlight Story Cards (About, Skills, Projects, Organization, Certificates, Achievements)
  const infoStories = [
    {
      id: 'about',
      title: 'About Me',
      subtitle: 'Education & Background',
      icon: User,
      bullets: [
        '4th yr computer science',
        'From Pamantasan ng Cabuyao',
        'Focused on Full-Stack Development & UI/UX',
      ],
      ctaText: 'Read Full Biography',
      targetSection: 'about',
      gradient: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      subtitle: 'Stack & Tools',
      icon: Code2,
      bullets: [
        'Core: Javascript, Java, React, NextJS, NodeJS',
        'FrontEnd: HTML, CSS, Figma',
        'BackEnd: Java, Python, SQLlite',
        'Tools: Google cloud, VSCode, Vercel, Git, AWS',
        'Graphics Designing: Figma, Canva',
      ],
      ctaText: 'Explore All Skills',
      targetSection: 'skills',
      gradient: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'organization',
      title: 'Organizations',
      subtitle: 'Tech Communities',
      icon: Building2,
      bullets: [
        'DEVCON LAGUNA',
        'CRYPTITA PLAYS',
      ],
      ctaText: 'View Organization Involvement',
      targetSection: 'about',
      gradient: 'from-cyan-600 to-blue-700',
    },
    {
      id: 'certificates',
      title: 'Verified Certificates',
      subtitle: 'Credentials & Accreditations',
      icon: Award,
      bullets: [
        'Certiport: AI Fluency Certification',
        'Anthropic: Claude 101 AI Foundations',
        'Coursera: Software Engineering Principles in Python',
        'University Academic Honor in Database Systems',
      ],
      ctaText: 'View Certifications',
      targetSection: 'certificates',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Recognition & Milestones',
      icon: Trophy,
      bullets: [
        'ImaGnation 2026 Participant',
      ],
      ctaText: 'View About & Honors',
      targetSection: 'about',
      gradient: 'from-rose-500 to-red-600',
    },
  ];

  // Determine whether this is MyDay (real event photos) or a Highlight story
  const isMyDay = storyId === 'myday';

  const activeStories = isMyDay ? eventStories : infoStories;

  const initialIndex = isMyDay
    ? 0
    : Math.max(
        0,
        infoStories.findIndex((s) => s.id === storyId)
      );

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [storyId, initialIndex]);

  // Story progress auto-advance timer
  useEffect(() => {
    if (!storyId || isPaused) return;

    const stepMs = 50;
    const totalDuration = isMyDay ? 7000 : 5500;
    const increment = (stepMs / totalDuration) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < activeStories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [storyId, currentIndex, isPaused, onClose, isMyDay, activeStories.length]);

  // Keyboard controls
  useEffect(() => {
    if (!storyId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [storyId, currentIndex, activeStories.length]);

  if (!storyId) return null;

  const handleNext = () => {
    if (currentIndex < activeStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width * 0.35) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  // Render MyDay Real Photo Story
  if (isMyDay) {
    const currentStory = eventStories[currentIndex] || eventStories[0];

    return (
      <div
        className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-modal-in select-none"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-all z-70 cursor-pointer"
          aria-label="Close stories"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          className="relative flex items-center justify-center w-full max-w-[430px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Desktop Chevron Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white disabled:opacity-0 disabled:pointer-events-none z-70 bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Desktop Chevron Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white z-70 bg-white/15 hover:bg-white/25 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-lg"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Story Card */}
          <div
            className="relative w-full h-[720px] max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/15 bg-black"
            onClick={handleCardClick}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Ambient Blurred Background */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-45 scale-110 pointer-events-none"
              style={{ backgroundImage: `url(${currentStory.image})` }}
            />

            {/* Real Event Photo */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-2 pt-14 pb-44">
              <img
                key={currentStory.id}
                src={currentStory.image}
                alt={currentStory.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-opacity duration-300"
              />
            </div>

            {/* Top and Bottom Gradients */}
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none z-10" />

            {/* Top Progress Bars & Header */}
            <div className="relative z-20 p-3 sm:p-4 pb-0 pointer-events-none">
              <div className="flex items-center gap-1.5 w-full mb-3">
                {eventStories.map((s, idx) => (
                  <div key={s.id} className="h-1 flex-1 bg-white/35 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-75"
                      style={{
                        width:
                          idx < currentIndex
                            ? '100%'
                            : idx === currentIndex
                            ? `${progress}%`
                            : '0%',
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/images/headshot/headshot.jpg"
                    alt={profileData.name}
                    className="w-9 h-9 rounded-full border-2 border-white/80 object-cover shadow-sm"
                    style={{ objectPosition: '0% 20%' }}
                  />
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {profileData.username}
                      </span>
                      <span className="text-[10px] text-white/70">• {currentStory.date}</span>
                    </div>
                    <span className="text-[11px] text-white/90 font-medium block">
                      {currentStory.tag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-white/85 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20">
                  {currentIndex + 1} / {eventStories.length}
                </span>
              </div>
            </div>

            {/* Location Pill */}
            <div className="relative z-20 px-4 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/75 text-black dark:text-white backdrop-blur-md shadow-lg text-xs font-semibold border border-white/30">
                <MapPin className="w-3.5 h-3.5 text-[#ED4956]" />
                <span>{currentStory.location}</span>
              </div>
            </div>

            {/* Bottom Caption & CTA */}
            <div
              className="relative z-20 p-4 sm:p-5 pt-0 pointer-events-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-md">
                  {currentStory.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-white/90 mt-0.5 drop-shadow-xs">
                  {currentStory.subtitle}
                </p>
                <p className="text-xs text-white/80 mt-1.5 leading-relaxed line-clamp-2">
                  {currentStory.description}
                </p>
              </div>

              {currentStory.ctaLink ? (
                <a
                  href={currentStory.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-[#262626] hover:bg-white/90 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <span>{currentStory.ctaText || 'Visit Workshop Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('about');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white text-[#262626] hover:bg-white/90 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#0095F6]" />
                  <span>{currentStory.ctaText || 'View Organization'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Classic Highlight Story Card (About, Skills, Projects, Organization, Certificates, Achievements)
  const currentStory = infoStories[currentIndex] || infoStories[0];
  const Icon = currentStory.icon;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-modal-in select-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-80 p-2 z-70 cursor-pointer"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story Center Wrapper with Chevrons */}
      <div
        className="relative flex items-center justify-center w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Desktop Chevron Left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentIndex === 0}
          className="hidden sm:flex absolute -left-12 top-1/2 -translate-y-1/2 p-2.5 text-white/80 hover:text-white disabled:opacity-0 z-70 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all cursor-pointer"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Desktop Chevron Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 p-2.5 text-white/80 hover:text-white z-70 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all cursor-pointer"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Highlight Story Card */}
        <div
          className="relative w-full h-[580px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${
              currentStory.id === 'about'
                ? '#1E3A8A, #3B82F6'
                : currentStory.id === 'skills'
                ? '#064E3B, #10B981'
                : currentStory.id === 'projects'
                ? '#4C1D95, #8B5CF6'
                : currentStory.id === 'organization'
                ? '#0E7490, #06B6D4'
                : currentStory.id === 'certificates'
                ? '#78350F, #D97706'
                : '#831843, #EC4899'
            })`,
          }}
          onClick={handleCardClick}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Progress Bars */}
          <div className="flex items-center gap-1.5 w-full mb-4">
            {infoStories.map((s, idx) => (
              <div key={s.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Story Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/images/headshot/headshot.jpg"
                alt={profileData.name}
                className="w-9 h-9 rounded-full border border-white/60 object-cover"
                style={{ objectPosition: '0% 20%' }}
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">@{profileData.username}</span>
                <span className="text-[10px] text-white/80">{currentStory.subtitle}</span>
              </div>
            </div>

            <span className="text-[10px] font-semibold text-white/80 px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md">
              {currentIndex + 1} / {infoStories.length}
            </span>
          </div>

          {/* Story Body Content */}
          <div className="my-auto py-6 text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 text-white">
              <Icon className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black tracking-tight text-white mb-4">
              {currentStory.title}
            </h3>

            <ul className="space-y-3">
              {currentStory.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/95">
                  <span className="text-white font-bold">✦</span>
                  <span className="leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Story Footer / Action Button */}
          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                onNavigateSection(currentStory.targetSection);
              }}
              className="w-full py-3 px-4 rounded-xl bg-white text-[#262626] text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-transform active:scale-95 shadow-lg cursor-pointer"
            >
              <span>{currentStory.ctaText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
