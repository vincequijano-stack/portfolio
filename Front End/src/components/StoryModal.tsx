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
  // 1. Classic Highlight Story Cards (About, Skills, Projects, Organization, Achievements)
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
      gradient: 'from-purple-600 to-indigo-700',
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

  // Determine story mode: MyDay (real event photos), Certificates Highlight, or Classic Info Highlight
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

  // Story progress auto-advance timer
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
  }, [storyId, currentIndex, isPaused, expandedCert, onClose, isMyDay, isCertificates, activeStories.length]);

  // Keyboard controls
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

  // 2. Render Certificates Story Highlight (Multi-slide Certificate Viewer)
  if (isCertificates) {
    const currentCert = certificatesData[currentIndex] || certificatesData[0];

    return (
      <div
        className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-modal-in select-none"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/90 hover:text-white p-2.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md transition-all z-70 cursor-pointer"
          aria-label="Close certificate stories"
        >
          <X className="w-6 h-6" />
        </button>

        <div
          className="relative flex items-center justify-center w-full max-w-[440px]"
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
            aria-label="Previous certificate"
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
            aria-label="Next certificate"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Certificate Story Card */}
          <div
            className="relative w-full h-[730px] max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between border border-white/15 bg-gradient-to-br from-[#1C1917] via-[#0F172A] to-[#1E1B4B]"
            onClick={handleCardClick}
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Top Progress Bars & Header */}
            <div className="relative z-20 p-3.5 sm:p-4 pb-2 pointer-events-none">
              <div className="flex items-center gap-1.5 w-full mb-3">
                {certificatesData.map((cert, idx) => (
                  <div key={cert.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F59E0B] transition-all duration-75"
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
                    className="w-9 h-9 rounded-full border-2 border-[#F59E0B] object-cover shadow-sm"
                    style={{ objectPosition: '0% 20%' }}
                  />
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">
                        {profileData.username}
                      </span>
                      <span className="text-[10px] text-white/75">• {currentCert.date}</span>
                    </div>
                    <span className="text-[11px] text-[#FBBF24] font-semibold block">
                      {currentCert.issuer} · {currentCert.tag}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-white/90 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                  {currentIndex + 1} / {certificatesData.length}
                </span>
              </div>
            </div>

            {/* Embedded Certificate PDF Frame */}
            <div
              className="relative z-20 mx-3.5 sm:mx-4 my-1 flex-1 min-h-[240px] max-h-[330px] rounded-xl overflow-hidden border border-white/20 bg-[#0F172A] shadow-xl group pointer-events-auto"
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
                    className="absolute inset-0 bg-black/25 hover:bg-black/45 transition-colors flex items-center justify-center cursor-pointer"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCert(currentCert);
                      }}
                      className="px-3.5 py-2 rounded-full bg-white/95 text-[#262626] text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>View Certificate PDF</span>
                    </button>
                  </div>
                </>
              )}

              <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/15 flex items-center gap-1 pointer-events-none">
                <Award className="w-3 h-3 text-[#FBBF24]" />
                <span>{currentCert.tag}</span>
              </div>
            </div>

            {/* Certificate Details & CTA Footer */}
            <div
              className="relative z-20 p-4 sm:p-5 pt-2 pointer-events-auto text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between text-[11px] text-white/75 mb-1">
                <span className="font-semibold text-[#FBBF24] flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                  Issued by {currentCert.issuer}
                </span>
                {currentCert.credentialId && (
                  <span className="font-mono text-[10px] text-white/60">
                    ID: {currentCert.credentialId}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {currentCert.title}
              </h3>

              <p className="text-xs text-white/80 mt-1.5 leading-relaxed line-clamp-2">
                {currentCert.description}
              </p>

              {/* Skills Covered Pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                {currentCert.skillsCovered.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold bg-white/10 border border-white/15 text-white/90 px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {currentCert.pdfUrl && (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpandedCert(currentCert)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-transform active:scale-95 shadow-lg cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Full Preview</span>
                    </button>
                    <a
                      href={currentCert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
                      title="Open Certificate PDF in New Tab"
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

        {/* Full Certificate PDF Lightbox Modal */}
        {expandedCert && expandedCert.pdfUrl && (
          <div
            className="fixed inset-0 z-80 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-modal-in"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCert(null);
            }}
          >
            <div
              className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#141414]">
                <div className="text-left">
                  <h3 className="text-sm font-bold text-[#262626] dark:text-white">
                    {expandedCert.title}
                  </h3>
                  <p className="text-xs text-[#8E8E8E] dark:text-[#737373]">
                    Issued by {expandedCert.issuer} · {expandedCert.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={expandedCert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0095F6] text-white hover:bg-[#1877F2] transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Tab</span>
                  </a>
                  <button
                    onClick={() => setExpandedCert(null)}
                    className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white hover:bg-[#EFEFEF] dark:hover:bg-[#262626] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#1E293B]">
                <iframe
                  src={expandedCert.pdfUrl}
                  title={expandedCert.title}
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Render Classic Highlight Story Card (About, Skills, Projects, Organization, Achievements)
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
