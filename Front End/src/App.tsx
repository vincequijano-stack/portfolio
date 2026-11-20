import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectGallery } from './components/ProjectGallery';
import { ProjectModal } from './components/ProjectModal';
import { CertificatesSection } from './components/CertificatesSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { RateModal } from './components/RateModal';
import { StoryModal } from './components/StoryModal';
import { IntroSplash } from './components/IntroSplash';
import { InteractiveBackground } from './components/InteractiveBackground';
import { CustomCursor } from './components/CustomCursor';
import { ScrollEffects } from './components/ScrollEffects';
import { gsap, ScrollTrigger } from './lib/gsap';
import { Play, ArrowUp } from 'lucide-react';
import {
  GithubIcon,
  LinkedinIcon,
  FacebookIcon,
  InstagramIcon,
} from './components/SocialIcons';

import {
  projectsData,
  Project,
  CategoryType,
  categoryList,
} from './data/projects';
import { profileData } from './data/profile';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [activeCategory, setActiveCategory] =
    useState<CategoryType>('All Projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateModalInitialTab, setRateModalInitialTab] = useState<'rate' | 'all'>(
    'rate'
  );

  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('portfolio_intro_shown');
    } catch {
      return true;
    }
  });
  const [heroReady, setHeroReady] = useState<boolean>(() => {
    try {
      return Boolean(sessionStorage.getItem('portfolio_intro_shown'));
    } catch {
      return false;
    }
  });

  // Gate hero visibility on documentElement while intro curtain is closed
  useEffect(() => {
    document.documentElement.dataset.heroState = heroReady ? 'ready' : 'waiting';
  }, [heroReady]);

  const handleIntroReveal = useCallback(() => {
    setHeroReady(true);
    document.documentElement.dataset.heroState = 'ready';
  }, []);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setHeroReady(true);
    document.documentElement.dataset.heroState = 'ready';
    try {
      sessionStorage.setItem('portfolio_intro_shown', 'true');
    } catch {}
  }, []);

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setHeroReady(false);
    document.documentElement.dataset.heroState = 'waiting';
    setShowIntro(true);
  };

  const handleOpenRateModal = (initialTab: 'rate' | 'all' = 'rate') => {
    setRateModalInitialTab(initialTab);
    setIsRateModalOpen(true);
  };

  // Refresh ScrollTrigger metrics when intro overlay mounts/unmounts
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [showIntro, heroReady]);

  // GSAP ScrollTrigger section reveals, continuous chapter bridges, skill accents & watermarks
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const triggers: ScrollTrigger[] = [];
    const boundEls: HTMLElement[] = [];
    const pendingReveals = new Map<HTMLElement, () => void>();
    let checkRaf = 0;

    const revealElement = (el: HTMLElement) => {
      if (el.dataset.gsapRevealed === '1' || el.dataset.gsapBound === '1') return;
      el.dataset.gsapBound = '1';
      boundEls.push(el);

      if (reduce) {
        el.dataset.gsapRevealed = '1';
        gsap.set(el, { opacity: 1, clearProps: 'transform,clipPath,filter' });
        el.classList.add('is-revealed');
        el.querySelectorAll<HTMLElement>('[data-header-rule], [data-skill-line]').forEach((ln) => {
          gsap.set(ln, { scaleX: 1 });
        });
        el.querySelectorAll<HTMLElement>('[data-skill-icon]').forEach((ic) => {
          gsap.set(ic, { scale: 1, opacity: 1 });
        });
        el.querySelectorAll<HTMLElement>('[data-project-image-clip]').forEach((clip) => {
          gsap.set(clip, { opacity: 1, clearProps: 'clipPath' });
        });
        el.querySelectorAll<HTMLElement>('[data-project-detail]').forEach((det) => {
          gsap.set(det, { opacity: 1, y: 0 });
        });
        return;
      }

      const mode = el.dataset.reveal || 'up';

      // Compute delay from inline --reveal-delay or parent [data-reveal-stagger] order
      let delay = 0;
      const inlineDelay = el.style.getPropertyValue('--reveal-delay').trim();
      if (inlineDelay) {
        delay = inlineDelay.endsWith('ms')
          ? parseFloat(inlineDelay) / 1000
          : parseFloat(inlineDelay) || 0;
      } else if (el.parentElement?.hasAttribute('data-reveal-stagger')) {
        const idx = Array.from(el.parentElement.children).indexOf(el);
        delay = Math.max(0, idx) * 0.095;
      }

      const fromVars: gsap.TweenVars = { opacity: 0 };
      const toVars: gsap.TweenVars = {
        opacity: 1,
        duration: isMobile ? 0.65 : 0.85,
        delay,
        ease: 'expo.out',
        clearProps: 'filter',
      };

      if (mode === 'clip') {
        fromVars.clipPath = 'inset(0 100% 0 0)';
        fromVars.y = 14;
        toVars.clipPath = 'inset(0 0% 0 0)';
        toVars.y = 0;
      } else if (mode === 'scale') {
        fromVars.scale = 0.93;
        fromVars.y = 18;
        fromVars.filter = 'blur(6px)';
        toVars.scale = 1;
        toVars.y = 0;
        toVars.filter = 'blur(0px)';
      } else if (mode === 'left') {
        fromVars.x = isMobile ? -18 : -32;
        toVars.x = 0;
      } else if (mode === 'right') {
        fromVars.x = isMobile ? 18 : 32;
        toVars.x = 0;
      } else {
        fromVars.y = isMobile ? 20 : 30;
        toVars.y = 0;
      }

      // Set initial hidden state cleanly
      gsap.set(el, fromVars);

      const animateIn = () => {
        if (el.dataset.gsapRevealed === '1') return;
        el.dataset.gsapRevealed = '1';
        pendingReveals.delete(el);
        el.classList.add('is-revealed');
        gsap.to(el, toVars);

        el.querySelectorAll<HTMLElement>('[data-header-rule]').forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.85, delay: 0.14, ease: 'expo.out' }
          );
        });

        el.querySelectorAll<HTMLElement>('[data-skill-icon]').forEach((icon) => {
          gsap.fromTo(
            icon,
            { scale: 0.65, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              delay: delay + 0.08,
              ease: 'back.out(1.5)',
            }
          );
        });

        el.querySelectorAll<HTMLElement>('[data-skill-line]').forEach((line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              delay: delay + 0.15,
              ease: 'expo.out',
            }
          );
        });

        el.querySelectorAll<HTMLElement>('[data-project-image-clip]').forEach((clip) => {
          gsap.fromTo(
            clip,
            { clipPath: 'inset(10% 0% 10% 0% round 12px)', opacity: 0.45 },
            {
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              opacity: 1,
              duration: 0.9,
              delay: Math.min(delay + 0.04, 0.22),
              ease: 'expo.out',
              clearProps: 'clipPath',
            }
          );
        });

        const details = el.querySelectorAll<HTMLElement>('[data-project-detail]');
        if (details.length) {
          gsap.fromTo(
            details,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.065,
              delay: delay + 0.14,
              ease: 'power3.out',
            }
          );
        }
      };

      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94) {
        animateIn();
      } else {
        pendingReveals.set(el, animateIn);
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: animateIn,
        });
        triggers.push(st);
      }
    };

    const checkInView = () => {
      checkRaf = 0;
      const threshold = window.innerHeight * 0.94;
      pendingReveals.forEach((animateIn, el) => {
        if (!el.isConnected) {
          pendingReveals.delete(el);
          return;
        }
        if (el.getBoundingClientRect().top < threshold) {
          animateIn();
        }
      });
    };

    const onViewportChange = () => {
      if (!checkRaf && pendingReveals.size > 0) {
        checkRaf = requestAnimationFrame(checkInView);
      }
    };

    const scanElements = () => {
      let added = false;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        if (el.dataset.gsapRevealed !== '1' && el.dataset.gsapBound !== '1') {
          revealElement(el);
          added = true;
        }
      });
      if (added) ScrollTrigger.refresh();
    };

    scanElements();
    const initRaf = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      checkInView();
    });

    // Observe dynamic DOM updates (e.g., Skills / Projects category tab changes)
    const mutObs = new MutationObserver(() => {
      scanElements();
      checkInView();
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', onViewportChange, { passive: true });
    window.addEventListener('resize', onViewportChange);

    return () => {
      cancelAnimationFrame(initRaf);
      if (checkRaf) cancelAnimationFrame(checkRaf);
      mutObs.disconnect();
      window.removeEventListener('scroll', onViewportChange);
      window.removeEventListener('resize', onViewportChange);
      triggers.forEach((t) => t.kill());
      pendingReveals.clear();
      boundEls.forEach((el) => {
        if (el.dataset.gsapRevealed !== '1') {
          delete el.dataset.gsapBound;
        }
      });
    };
  }, [activeCategory]);

  // Continuous Storytelling Scroll Effects: Chapter Bridges, Watermark Parallax & Footer Curtain
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('[data-chapter-bridge]', { scaleY: 1 });
        gsap.set('[data-footer-reveal]', { opacity: 1, y: 0 });
        return;
      }

      gsap.utils.toArray<HTMLElement>('[data-chapter-bridge]').forEach((bridge) => {
        gsap.fromTo(
          bridge,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: bridge.parentElement || bridge,
              start: 'top 90%',
              end: 'top 52%',
              scrub: 0.35,
            },
          }
        );
      });

      if (!isMobile) {
        gsap.utils.toArray<HTMLElement>('[data-watermark]').forEach((wm) => {
          gsap.fromTo(
            wm,
            { x: 24, y: 18 },
            {
              x: -36,
              y: -24,
              ease: 'none',
              scrollTrigger: {
                trigger: wm.parentElement || wm,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.6,
              },
            }
          );
        });
      }

      gsap.fromTo(
        '[data-footer-reveal]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: 'footer',
            start: 'top 95%',
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
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
    const targetId = sectionId === 'profile-top' ? 'home' : sectionId;
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // GSAP ScrollTrigger Active Section Tracking (ordered matching visual storytelling flow)
  useEffect(() => {
    const sectionIds = [
      'home',
      'about',
      'skills',
      'projects',
      'certificates',
      'experience',
      'contact',
    ];

    const triggers: ScrollTrigger[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 42%',
        end: 'bottom 42%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans antialiased overflow-x-hidden">
      {/* Custom Desktop Cursor */}
      <CustomCursor />

      {/* Top Scroll Progress Bar & Parallax Controller */}
      <ScrollEffects refreshKey={activeCategory} />

      {/* Subtle Monochrome Grid & Cursor Lighting */}
      <InteractiveBackground />

      {/* Cinematic Split-Curtain VQ Intro Screen */}
      {showIntro && (
        <IntroSplash
          onReveal={handleIntroReveal}
          onComplete={handleIntroComplete}
        />
      )}

      {/* 1. HERO SECTION (With Top Branding & Navigation Bar) */}
      <HeroSection
        activeSection={activeSection}
        heroReady={heroReady}
        onNavigate={handleNavigate}
        onOpenRateModal={handleOpenRateModal}
        onOpenStoryModal={(storyId) => setActiveStoryId(storyId)}
      />

      {/* MAIN CONTENT SECTIONS: Continuous Visual Storytelling Flow */}
      <main className="relative z-10">
        {/* 01. ABOUT ME SECTION */}
        <AboutSection
          onNavigate={handleNavigate}
          onOpenStoryModal={(storyId) => setActiveStoryId(storyId)}
        />

        {/* 02. TECHNICAL SKILLS SECTION */}
        <SkillsSection />

        {/* 03. FEATURED PROJECTS SECTION */}
        <section
          id="projects"
          className="relative py-24 sm:py-32 border-t border-white/10 text-left overflow-hidden"
        >
          {/* Subtle Background Watermark */}
          <span
            data-watermark
            aria-hidden="true"
            className="section-watermark font-display font-black uppercase tracking-tighter text-[15vw] sm:text-[11vw] leading-none text-white/[0.025] whitespace-nowrap absolute top-4 right-[-2%] z-0"
          >
            PROJECTS
          </span>

          <div className="relative z-10 max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14">
            {/* Continuous Chapter Connector Bridge */}
            <div className="chapter-bridge" aria-hidden="true">
              <span data-chapter-bridge className="chapter-bridge-fill" />
            </div>

            <div
              data-reveal="clip"
              className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono-code text-xs uppercase tracking-[0.3em] text-[#C8C8C8]">
                    03 // SELECTED WORKS
                  </span>
                  <span data-header-rule className="h-px w-16 bg-white/25" />
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
                  FEATURED <span className="text-[#C8C8C8]">PROJECTS</span>
                </h2>
              </div>

              {/* Project Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {categoryList.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      data-magnetic="0.16"
                      className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-white text-[#0A0A0A] font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'bg-[#151515] text-[#C8C8C8] border border-white/12 hover:border-white/35 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <ProjectGallery
              projects={filteredProjects}
              onProjectClick={(proj) => setSelectedProject(proj)}
              variant="tilt"
              onClearSearch={() => setActiveCategory('All Projects')}
            />
          </div>
        </section>

        {/* 04. CERTIFICATES & ACHIEVEMENTS SECTION */}
        <CertificatesSection />

        {/* 05. ORGANIZATIONS & EXPERIENCE SECTION */}
        <ExperienceSection
          onOpenStoryModal={(storyId) => setActiveStoryId(storyId)}
        />

        {/* 06. CONTACT SECTION */}
        <ContactSection onOpenRateModal={handleOpenRateModal} />
      </main>

      {/* MONOCHROME CINEMATIC FOOTER */}
      <footer className="relative z-10 w-full border-t border-white/10 py-12 bg-[#030303]">
        <div data-footer-reveal>
          <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <span className="font-display font-black text-lg tracking-wider text-white">
                VQ
              </span>
              <span className="h-4 w-px bg-[#777777]" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#C8C8C8]">
                {profileData.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-[#C8C8C8]">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('home');
                }}
                className="hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('about');
                }}
                className="hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#skills"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('skills');
                }}
                className="hover:text-white transition-colors"
              >
                Skills
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('projects');
                }}
                className="hover:text-white transition-colors"
              >
                Projects
              </a>
              <a
                href="#certificates"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('certificates');
                }}
                className="hover:text-white transition-colors"
              >
                Certificates
              </a>
              <a
                href="#experience"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('experience');
                }}
                className="hover:text-white transition-colors"
              >
                Experience
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('contact');
                }}
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.22"
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white text-[#C8C8C8] hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.22"
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white text-[#C8C8C8] hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={profileData.facebook}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.22"
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white text-[#C8C8C8] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={profileData.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.22"
                className="w-8 h-8 rounded-full border border-white/15 hover:border-white text-[#C8C8C8] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleReplayIntro}
                data-magnetic="0.18"
                className="px-3 py-1.5 rounded-full bg-[#151515] border border-white/15 hover:border-white/40 text-[11px] font-mono-code text-[#C8C8C8] hover:text-white flex items-center gap-1.5 cursor-pointer"
                title="Replay VQ Intro Animation"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>Intro</span>
              </button>

              <button
                onClick={() => handleNavigate('home')}
                data-magnetic="0.22"
                className="w-8 h-8 rounded-full bg-white text-[#0A0A0A] hover:bg-[#F5F5F5] flex items-center justify-center hover:scale-105 cursor-pointer"
                title="Back to top"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-w-[1320px] mx-auto px-5 sm:px-10 lg:px-14 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono-code text-[#777777]">
            <span>
              © {new Date().getFullYear()} {profileData.name}. All rights reserved.
            </span>
            <span>CODE • ANALYZE • INNOVATE</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onNavigateContact={() => handleNavigate('contact')}
        />
      )}

      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        initialTab={rateModalInitialTab}
      />

      {activeStoryId && (
        <StoryModal
          storyId={activeStoryId}
          onClose={() => setActiveStoryId(null)}
          onNavigateSection={handleNavigate}
        />
      )}
    </div>
  );
}
