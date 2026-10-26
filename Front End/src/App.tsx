import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileHighlights } from './components/ProfileHighlights';
import { CategoryTabs } from './components/CategoryTabs';
import { ProjectGallery } from './components/ProjectGallery';
import { ProjectModal } from './components/ProjectModal';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { CertificatesSection } from './components/CertificatesSection';
import { ContactSection } from './components/ContactSection';
import { StoryModal } from './components/StoryModal';
import { MobileNav } from './components/MobileNav';
import { IntroSplash } from './components/IntroSplash';
import { InstagramIcon } from './components/SocialIcons';
import { Play, Heart } from 'lucide-react';
import { notificationService, LikeNotification } from './services/notificationService';
import { ActivityModal } from './components/ActivityModal';
import { LikeNotificationToast } from './components/LikeNotificationToast';
import { VisitorNamePromptHost } from './components/VisitorNameModal';

import { projectsData, Project, CategoryType, categoryList } from './data/projects';
import { profileData } from './data/profile';

export default function App() {
  const [activeSection, setActiveSection] = useState('profile-top');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('All Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [notifications, setNotifications] = useState<LikeNotification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((list) => {
      setNotifications(list);
    });
    return () => unsubscribe();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('ig_intro_shown');
    } catch {
      return true;
    }
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
    try {
      sessionStorage.setItem('ig_intro_shown', 'true');
    } catch {}
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  // Dynamic project counts per category
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Projects': projectsData.length,
    };
    categoryList.forEach((cat) => {
      if (cat !== 'All Projects') {
        counts[cat] = projectsData.filter((p) => p.categories.includes(cat)).length;
      }
    });
    return counts;
  }, []);

  // Filtered projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All Projects') {
      return projectsData;
    }
    return projectsData.filter((p) => p.categories.includes(activeCategory));
  }, [activeCategory]);

  // Smooth scroll to target section
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Direct Gmail compose link
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profileData.email
  )}&su=${encodeURIComponent('Project Inquiry for Vince Quijano')}&body=${encodeURIComponent(
    'Hi Vince,\n\nI visited your portfolio website and would like to discuss a project / opportunity...'
  )}`;

  // IntersectionObserver to update active section on scroll
  useEffect(() => {
    const sectionIds = ['profile-top', 'projects', 'about', 'skills', 'certificates', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#F5F5F5] font-sans antialiased transition-colors duration-200 overflow-x-hidden">
      {/* Optional Intro Screen */}
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}

      {/* 1. Left Slim 72px Sidebar (Desktop - Matching Reference Image) */}
      <Sidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenActivity={() => setIsActivityOpen(true)}
        unreadCount={unreadCount}
      />

      {/* 2. Main Content Wrapper: Offset by slim sidebar on desktop, centered container */}
      <div className="md:ml-[72px] flex flex-col min-h-screen">
        {/* Mobile Top Header (Only on small screens) */}
        <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#DBDBDB] dark:border-[#262626] px-4 py-2.5 flex items-center justify-between">
          <a
            href="#profile-top"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('profile-top');
            }}
            className="flex items-center gap-2 text-black dark:text-white"
          >
            <InstagramIcon className="w-6 h-6 stroke-[2]" />
            <span className="text-lg font-bold tracking-tight">Instagram</span>
          </a>
          <button
            onClick={() => setIsActivityOpen(true)}
            className="p-1 text-black dark:text-white relative group"
            title="Notifications / Activity"
            aria-label="Notifications"
          >
            <div className="relative">
              <Heart className={`w-6 h-6 stroke-[1.75] ${unreadCount > 0 ? 'text-[#ED4956]' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ED4956] text-white text-[9px] font-bold rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>
        </header>

        {/* Inner Content Container: Exactly max-w-[935px] matching real Instagram desktop */}
        <main className="flex-1 max-w-[935px] w-full mx-auto px-3 sm:px-6 pt-4 sm:pt-9 pb-24 md:pb-12">
          {/* Profile Header (Avatar on left with "Note..." bubble, stats, bio, action buttons) */}
          <ProfileHeader
            onNavigate={handleNavigate}
            onOpenStoryModal={(storyId) => setActiveStoryId(storyId)}
          />

          {/* Story Highlights Bar (About, Skills, Projects, Organization, Certificates, + New) */}
          <ProfileHighlights
            onNavigate={handleNavigate}
            onOpenStoryModal={(storyId) => setActiveStoryId(storyId)}
          />

          {/* Instagram Post Category Tabs (⊞ POSTS, ▷ WEB DEV, 🔖 UI/UX, etc.) */}
          <CategoryTabs
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            projectCounts={projectCounts}
          />

          {/* 3-Column Square Grid Project Gallery (tight 3px-4px gaps matching reference image) */}
          <ProjectGallery
            projects={filteredProjects}
            onProjectClick={(proj) => setSelectedProject(proj)}
            onClearSearch={() => setActiveCategory('All Projects')}
          />

          {/* Structured Portfolio Details */}
          <AboutSection />
          <SkillsSection />
          <CertificatesSection />
          <ContactSection />
        </main>

        {/* Minimalist Instagram Footer */}
        <footer className="w-full border-t border-[#DBDBDB] dark:border-[#262626] py-8 text-center text-xs text-[#8E8E8E] dark:text-[#737373] bg-white dark:bg-black transition-colors duration-200">
          <div className="max-w-[935px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-xs font-semibold">
              <a href="#about" onClick={(e) => { e.preventDefault(); handleNavigate('about'); }} className="hover:text-[#262626] dark:hover:text-white">About</a>
              <a href="#skills" onClick={(e) => { e.preventDefault(); handleNavigate('skills'); }} className="hover:text-[#262626] dark:hover:text-white">Skills</a>
              <a href="#projects" onClick={(e) => { e.preventDefault(); handleNavigate('projects'); }} className="hover:text-[#262626] dark:hover:text-white">Projects</a>
              <a href="#certificates" onClick={(e) => { e.preventDefault(); handleNavigate('certificates'); }} className="hover:text-[#262626] dark:hover:text-white">Certificates</a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavigate('contact'); }} className="hover:text-[#262626] dark:hover:text-white">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleReplayIntro}
                className="hover:text-[#262626] dark:hover:text-white flex items-center gap-1 transition-colors"
                title="Replay Instagram Intro Animation"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Replay Intro</span>
              </button>
              <p>© {new Date().getFullYear()} {profileData.name} · Instagram Portfolio</p>
            </div>
          </div>
        </footer>
      </div>

      {/* 4. Mobile Bottom Navigation */}
      <MobileNav
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenActivity={() => setIsActivityOpen(true)}
        unreadCount={unreadCount}
      />

      {/* 5. Modals */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigateContact={() => handleNavigate('contact')}
        />
      )}

      {activeStoryId && (
        <StoryModal
          storyId={activeStoryId}
          onClose={() => setActiveStoryId(null)}
          onNavigateSection={handleNavigate}
        />
      )}

      {/* 6. Real-Time Activity / Notifications Popover & Toasts */}
      <ActivityModal
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        notifications={notifications}
        onSelectProject={(projectId) => {
          const proj = projectsData.find((p) => p.id === projectId);
          if (proj) setSelectedProject(proj);
        }}
      />
      <LikeNotificationToast onOpenActivity={() => setIsActivityOpen(true)} />
      <VisitorNamePromptHost />
    </div>
  );
}
