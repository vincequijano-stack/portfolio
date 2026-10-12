import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, User, Code2, Grid, Award, Trophy, Building2, ArrowRight } from 'lucide-react';
import { profileData } from '../data/profile';

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
  const stories = [
    {
      id: 'about',
      title: 'About Vince Quijano',
      subtitle: 'Computer Science Student',
      color: 'from-blue-600 to-indigo-700',
      icon: User,
      bullets: [
        'BS in Computer Science candidate',
        'Passion for full-stack architecture & data systems',
        'Experience building scalable web platforms and ML dashboards',
        'Active member of ACM student chapters',
      ],
      ctaText: 'Read Full Biography',
      targetSection: 'about',
    },
    {
      id: 'skills',
      title: 'Technical Stack Overview',
      subtitle: 'Languages & Tools',
      color: 'from-emerald-600 to-teal-700',
      icon: Code2,
      bullets: [
        'Programming: Python, Java, TypeScript, C++, SQL',
        'Frontend: React, Next.js, Tailwind CSS, Vite',
        'Backend: Node.js, Express.js, FastAPI',
        'Databases: PostgreSQL, MySQL, Redis, MongoDB',
      ],
      ctaText: 'Explore All Skills',
      targetSection: 'skills',
    },
    {
      id: 'projects',
      title: 'Featured Works Gallery',
      subtitle: '9 Academic & Production Apps',
      color: 'from-purple-600 to-pink-600',
      icon: Grid,
      bullets: [
        'Association Rule Mining Dashboard (Apriori & D3)',
        'Product Recommendation Engine with Collaborative Filtering',
        'EduTrack Student Management System with 3NF Schema',
        'Aura Fitness Health & Telemetry Mobile UI',
      ],
      ctaText: 'Jump to Gallery',
      targetSection: 'projects',
    },
    {
      id: 'organization',
      title: 'Organizations & Leadership',
      subtitle: 'Communities & Societies',
      color: 'from-cyan-600 to-blue-700',
      icon: Building2,
      bullets: [
        'Association for Computing Machinery (ACM) - Student Member',
        'Google Developer Student Clubs (GDSC) - Web Development Team',
        'Junior Philippine Computer Society (JPCS) - Tech Committee',
        'Campus Peer Tutoring & Code Mentorship Program',
      ],
      ctaText: 'View Organization Involvement',
      targetSection: 'about',
    },
    {
      id: 'certificates',
      title: 'Verified Industry Credentials',
      subtitle: 'Certifications & Accreditations',
      color: 'from-amber-500 to-orange-600',
      icon: Award,
      bullets: [
        'Certiport: AI Fluency Certification',
        'Anthropic: Claude 101 AI Foundations',
        'Coursera: Software Engineering Principles in Python',
        'University Department: Academic Distinction in Databases',
      ],
      ctaText: 'View Certifications',
      targetSection: 'certificates',
    },
    {
      id: 'achievements',
      title: 'Academic Highlights',
      subtitle: 'Milestones & Recognition',
      color: 'from-rose-500 to-red-600',
      icon: Trophy,
      bullets: [
        '3.8 GPA in Computer Science',
        'Consistent Dean’s Honor List recognition',
        '500+ GitHub contributions in 2026',
        'Open source contributor & campus peer tutor',
      ],
      ctaText: 'View Credentials',
      targetSection: 'certificates',
    },
  ];

  const initialIndex = Math.max(
    0,
    stories.findIndex((s) => s.id === storyId)
  );

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [storyId, initialIndex]);

  // Story progress auto-advance timer
  useEffect(() => {
    if (!storyId) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [storyId, currentIndex, onClose, stories.length]);

  if (!storyId) return null;

  const currentStory = stories[currentIndex];
  const Icon = currentStory.icon;

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
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
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-modal-in select-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-80 p-2 z-70"
        aria-label="Close stories"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Story Card */}
      <div
        className="relative w-full max-w-sm h-[580px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 text-white"
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
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress Bars */}
        <div className="flex items-center gap-1.5 w-full mb-4">
          {stories.map((s, idx) => (
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
            onClick={() => {
              onClose();
              onNavigateSection(currentStory.targetSection);
            }}
            className="w-full py-3 px-4 rounded-xl bg-white text-[#262626] text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-transform active:scale-95 shadow-lg"
          >
            <span>{currentStory.ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Left / Right Click Navigators */}
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white disabled:opacity-0"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
