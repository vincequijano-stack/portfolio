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
  Maximize2,
  CheckCircle,
} from 'lucide-react';
import { profileData } from '../data/profile';
import { eventStories } from '../data/events';
import { certificatesData, Certificate } from '../data/certificates';

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
  const infoStories = [
    {
      id: 'about',
      title: 'About Me',
      subtitle: 'Education & Background',
      icon: User,
      bullets: [
        '4th yr Computer Science student',
        'Pamantasan ng Cabuyao · Laguna, PH',
        'Focused on Full-Stack Development & UI/UX',
      ],
      ctaText: 'Read Full Biography',
      targetSection: 'about',
    },
    {
      id: 'skills',
      title: 'Technical Skills',
      subtitle: 'Stack & Tools',
      icon: Code2,
      bullets: [
        'Core: JavaScript, Java, React, NextJS, NodeJS',
        'Frontend: HTML, CSS, Figma',
        'Backend: Java, Python, SQLite',
        'Tools: Google Cloud, VSCode, Vercel, Git, AWS',
        'Design: Figma, Canva',
      ],
      ctaText: 'Explore All Skills',
      targetSection: 'skills',
    },
    {
      id: 'projects',
      title: 'Featured Projects',
      subtitle: 'Thesis & Systems',
      icon: Grid,
      bullets: [
        'CoBuy: Thesis Buying Pattern Mining System',
        'Association Rule Mining (Apriori & FP-Growth)',
        'Cryptita Plays Builder Workshop 2026',
        'Personal Developer Portfolio Website',
      ],
      ctaText: 'View All Projects',
      targetSection: 'projects',
    },
    {
      id: 'organization',
      title: 'Organizations',
      subtitle: 'Tech Communities',
      icon: Building2,
      bullets: ['DEVCON LAGUNA', 'CRYPTITA PLAYS'],
      ctaText: 'View Organizations & Events',
      targetSection: 'experience',
    },
    {
      id: 'achievements',
      title: 'Achievements',
      subtitle: 'Recognition & Milestones',
      icon: Trophy,
      bullets: [
        'ImaGnation 2026 Participant',
        'Cryptita Plays Builder #14 (Sui Mainnet)',
      ],
      ctaText: 'View Certificates & Honors',
      targetSection: 'certificates',
    },
  ];

  const isMyDay = storyId === 'myday';
  const isCertificates = storyId === 'certificates';

  const activeStories = isMyDay
    ? eventStories
    : isCertificates
    ? certificatesData
    : infoStories;

  const initialIndex =
    isMyDay || isCertificates
      ? 0
      : Math.max(
          0,
          infoStories.findIndex((s) => s.id === storyId)
        );

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [expandedCert, setExpandedCert] = useState<Certificate | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
    setExpandedCert(null);
  }, [storyId, initialIndex]);

  useEffect(() => {
    if (!storyId || isPaused || expandedCert) return;

    const stepMs = 50;
    const totalDuration = isMyDay || isCertificates ? 7500 : 5500;
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
  }, [
    storyId,
    currentIndex,
    isPaused,
    expandedCert,
    onClose,
    isMyDay,
    isCertificates,
    activeStories.length,
  ]);

  useEffect(() => {
    if (!storyId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (expandedCert) {
          setExpandedCert(null);
        } else {
          onClose();
        }
      } else if (!expandedCert && e.key === 'ArrowLeft') {
        handlePrev();
      } else if (!expandedCert && e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [storyId, currentIndex, activeStories.length, expandedCert]);

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

  if (isMyDay) {
    const currentStory = eventStories[currentIndex] || eventStories[0];

    return (
      <div
        className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-modal-in select-none"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white p-2.5 rounded-full bg-[#151515] border border-white/20 transition-all z-70 cursor-pointer"
          aria-label="Close stories"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          className="relative flex items-center justify-center w-full max-w-[430px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white disabled:opacity-0 disabled:pointer-events-none z-70 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full backdrop-blur-md transition-all cursor-pointer"
            aria-label="Previous story"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white z-70 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full backdrop-blur-md transition-all cursor-pointer"
            aria-label="Next story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative w-full h-[720px] max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20 bg-[#0A0A0A]"
            onClick={handleCardClick}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-35 scale-110 pointer-events-none grayscale"
              style={{ backgroundImage: `url(${currentStory.image})` }}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden p-2 pt-14 pb-44">
              <img
                key={currentStory.id}
                src={currentStory.image}
                alt={currentStory.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-opacity duration-300"
              />
            </div>

            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
            <div className="absolute bottom-0 inset-x-0 h-56 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-none z-10" />

            <div className="relative z-20 p-4 pb-0 pointer-events-none">
              <div className="flex items-center gap-1.5 w-full mb-3">
                {eventStories.map((s, idx) => (
                  <div
                    key={s.id}
                    className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
                  >
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
                    src="/assets/images/headshot/vince-studio-avatar.jpg"
                    alt={profileData.name}
                    className="w-9 h-9 rounded-full border border-white/80 object-cover grayscale"
                  />
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {profileData.name}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#C8C8C8]">
                        • {currentStory.date}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#C8C8C8] font-medium block">
                      {currentStory.tag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code text-white px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20">
                  {currentIndex + 1} / {eventStories.length}
                </span>
              </div>
            </div>

            <div className="relative z-20 px-4 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#151515]/90 text-white backdrop-blur-md shadow-lg text-xs font-medium border border-white/20">
                <MapPin className="w-3.5 h-3.5 text-[#C8C8C8]" />
                <span>{currentStory.location}</span>
              </div>
            </div>

            <div
              className="relative z-20 p-5 pt-0 pointer-events-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-white tracking-tight">
                  {currentStory.title}
                </h3>
                <p className="text-xs font-mono-code text-[#C8C8C8] mt-0.5">
                  {currentStory.subtitle}
                </p>
                <p className="text-xs text-[#C8C8C8]/85 mt-1.5 leading-relaxed line-clamp-2">
                  {currentStory.description}
                </p>
              </div>

              {currentStory.ctaLink ? (
                <a
                  href={currentStory.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-white text-[#0A0A0A] hover:bg-[#F5F5F5] text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <span>{currentStory.ctaText || 'Visit Workshop Website'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateSection('experience');
                  }}
                  className="w-full py-3 px-4 rounded-full bg-white text-[#0A0A0A] hover:bg-[#F5F5F5] text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{currentStory.ctaText || 'View Organizations'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCertificates) {
    const currentCert = certificatesData[currentIndex] || certificatesData[0];

    return (
      <div
        className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-modal-in select-none"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white p-2.5 rounded-full bg-[#151515] border border-white/20 transition-all z-70 cursor-pointer"
          aria-label="Close certificate stories"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          className="relative flex items-center justify-center w-full max-w-[440px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            disabled={currentIndex === 0}
            className="hidden sm:flex absolute -left-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white disabled:opacity-0 disabled:pointer-events-none z-70 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full backdrop-blur-md transition-all cursor-pointer"
            aria-label="Previous certificate"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="hidden sm:flex absolute -right-14 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center text-white/90 hover:text-white z-70 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full backdrop-blur-md transition-all cursor-pointer"
            aria-label="Next certificate"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="relative w-full h-[730px] max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/20 bg-[#151515]"
            onClick={handleCardClick}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            <div className="relative z-20 p-4 pb-2 pointer-events-none">
              <div className="flex items-center gap-1.5 w-full mb-3">
                {certificatesData.map((cert, idx) => (
                  <div
                    key={cert.id}
                    className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
                  >
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
                    src="/assets/images/headshot/vince-studio-avatar.jpg"
                    alt={profileData.name}
                    className="w-9 h-9 rounded-full border border-white object-cover grayscale"
                  />
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {profileData.name}
                      </span>
                      <span className="text-[10px] font-mono-code text-[#C8C8C8]">
                        • {currentCert.date}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#C8C8C8] font-semibold block">
                      {currentCert.issuer} · {currentCert.tag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono-code text-white px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20">
                  {currentIndex + 1} / {certificatesData.length}
                </span>
              </div>
            </div>

            <div
              className="relative z-20 mx-4 my-1 flex-1 min-h-[240px] max-h-[330px] rounded-2xl overflow-hidden border border-white/15 bg-[#0A0A0A] shadow-xl group pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {currentCert.pdfUrl && (
                <>
                  <iframe
                    key={currentCert.id}
                    src={`${currentCert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title={currentCert.title}
                    className="w-full h-full pointer-events-none opacity-95 bg-white"
                  />
                  <div
                    onClick={() => setExpandedCert(currentCert)}
                    className="absolute inset-0 bg-black/30 hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCert(currentCert);
                      }}
                      className="px-4 py-2 rounded-full bg-white text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>View Certificate PDF</span>
                    </button>
                  </div>
                </>
              )}

              <div className="absolute top-2.5 left-2.5 bg-[#0A0A0A]/80 backdrop-blur-md text-white text-[10px] font-mono-code px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1 pointer-events-none">
                <Award className="w-3 h-3 text-[#C8C8C8]" />
                <span>{currentCert.tag}</span>
              </div>
            </div>

            <div
              className="relative z-20 p-5 pt-2 pointer-events-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[11px] text-[#C8C8C8] mb-1">
                <span className="font-semibold text-white flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  Issued by {currentCert.issuer}
                </span>
                {currentCert.credentialId && (
                  <span className="font-mono-code text-[10px] text-[#777777]">
                    ID: {currentCert.credentialId}
                  </span>
                )}
              </div>

              <h3 className="font-display text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                {currentCert.title}
              </h3>

              <p className="text-xs text-[#C8C8C8] mt-1.5 leading-relaxed line-clamp-2">
                {currentCert.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                {currentCert.skillsCovered.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-mono-code bg-[#0A0A0A] border border-white/15 text-[#C8C8C8] px-2.5 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {currentCert.pdfUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedCert(currentCert)}
                      className="flex-1 py-2.5 px-4 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Preview</span>
                    </button>
                    <a
                      href={currentCert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-full bg-[#242424] hover:bg-[#323232] text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/15 transition-colors cursor-pointer"
                    >
                      <span>Open PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStory = infoStories[currentIndex] || infoStories[0];
  const Icon = currentStory.icon;

  return (
    <div
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-modal-in select-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-80 p-2.5 rounded-full bg-[#151515] border border-white/20 z-70 cursor-pointer"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative flex items-center justify-center w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-full h-[560px] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white bg-[#151515] border border-white/20"
          onClick={handleCardClick}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="flex items-center gap-1.5 w-full mb-4">
            {infoStories.map((s, idx) => (
              <div
                key={s.id}
                className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
              >
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

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/images/headshot/vince-studio-avatar.jpg"
                alt={profileData.name}
                className="w-9 h-9 rounded-full border border-white/60 object-cover grayscale"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-white block">
                  {profileData.name}
                </span>
                <span className="text-[10px] font-mono-code text-[#C8C8C8]">
                  {currentStory.subtitle}
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono-code text-white px-2.5 py-0.5 rounded-full bg-[#0A0A0A] border border-white/15">
              {currentIndex + 1} / {infoStories.length}
            </span>
          </div>

          <div className="my-auto py-6 text-left">
            <div className="w-14 h-14 rounded-2xl bg-[#242424] border border-white/15 flex items-center justify-center mb-4 text-white">
              <Icon className="w-7 h-7" />
            </div>

            <h3 className="font-display text-2xl font-black tracking-tight text-white mb-4">
              {currentStory.title}
            </h3>

            <ul className="space-y-3">
              {currentStory.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#C8C8C8]"
                >
                  <span className="text-white font-bold">✦</span>
                  <span className="leading-snug">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
                onNavigateSection(currentStory.targetSection);
              }}
              className="w-full py-3.5 px-4 rounded-full bg-white text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#F5F5F5] transition-transform active:scale-95 shadow-lg cursor-pointer"
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
