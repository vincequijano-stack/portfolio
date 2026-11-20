import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  User,
  Mail,
  Star,
  X,
  Menu,
  FileDown,
} from 'lucide-react';
import { profileData } from '../data/profile';
import { ratingService } from '../services/ratingService';
import { gsap } from '../lib/gsap';

interface HeroSectionProps {
  activeSection: string;
  heroReady?: boolean;
  onNavigate: (sectionId: string) => void;
  onOpenRateModal: (initialTab: 'rate' | 'all') => void;
  onOpenStoryModal: (storyId: string) => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeSection,
  heroReady = true,
  onNavigate,
  onOpenRateModal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const parallaxApiRef = useRef<{
    bgX: (v: number) => void;
    bgY: (v: number) => void;
    pX: (v: number) => void;
    pY: (v: number) => void;
    starX: (v: number) => void;
    starY: (v: number) => void;
  } | null>(null);

  const [ratingsState, setRatingsState] = useState(() => ratingService.getState());
  useEffect(() => {
    const unsub = ratingService.subscribe((state) => setRatingsState(state));
    return () => unsub();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // GSAP Ambient Geometric Motion, Cursor quickTo Parallax & ScrollTrigger Depth
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const scope = heroRef.current;
      if (!scope) return;

      // Ambient geometric drift
      gsap.to('[data-hero-geo-drift]', {
        x: 8,
        y: -10,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // 4-point star flare subtle pulse
      gsap.to('[data-hero-star]', {
        scale: 1.15,
        rotation: 4,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Subtle continuous floating on portrait inner wrapper
      gsap.to('[data-hero-portrait-float]', {
        y: -4,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // ScrollTrigger depth parallax as user scrolls out of hero
      gsap.to('[data-hero-scroll-depth]', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      });

      // Zero-rerender pointer parallax via gsap.quickTo
      const bgEl = scope.querySelector('[data-hero-bg-parallax]');
      const pEl = scope.querySelector('[data-hero-portrait-parallax]');
      const starEl = scope.querySelector('[data-hero-star]');

      if (bgEl && pEl && starEl) {
        parallaxApiRef.current = {
          bgX: gsap.quickTo(bgEl, 'x', { duration: 0.6, ease: 'power3.out' }),
          bgY: gsap.quickTo(bgEl, 'y', { duration: 0.6, ease: 'power3.out' }),
          pX: gsap.quickTo(pEl, 'x', { duration: 0.5, ease: 'power3.out' }),
          pY: gsap.quickTo(pEl, 'y', { duration: 0.5, ease: 'power3.out' }),
          starX: gsap.quickTo(starEl, 'x', { duration: 0.55, ease: 'power3.out' }),
          starY: gsap.quickTo(starEl, 'y', { duration: 0.55, ease: 'power3.out' }),
        };
      }

      return () => {
        parallaxApiRef.current = null;
      };
    });

    return () => mm.revert();
  }, []);

  // GSAP Master Hero Entrance Timeline (triggers as soon as intro curtain opens)
  useEffect(() => {
    if (!heroReady) return;
    const scope = heroRef.current;
    if (!scope) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 1, clearProps: 'transform' });
      }
      gsap.set(
        [
          '[data-hero-bg-parallax]',
          '[data-hero-portrait]',
          '[data-hero-letter-left]',
          '[data-hero-letter-right]',
          '[data-hero-desc]',
          '[data-hero-cta]',
          '[data-hero-tagline]',
          '[data-hero-scroll]',
          '[data-hero-social]',
          '[data-hero-mobile-anim]',
        ],
        { opacity: 1, clearProps: 'transform' }
      );
      gsap.set('[data-hero-bg-parallax]', { scale: 1.04 });
      gsap.set('[data-vince-mask]', { attr: { x: 0, width: 1024 } });
      gsap.set('[data-quijano-mask]', { attr: { width: 1024 } });
      return;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const mobTl = gsap.timeline({ defaults: { ease: 'expo.out' } });
        mobTl
          .fromTo(
            '[data-hero-bg-parallax]',
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1.02, duration: 0.95, ease: 'power3.out' },
            0
          )
          .fromTo(
            '[data-hero-mobile-anim="portrait"]',
            { opacity: 0, y: 24, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.95 },
            0.05
          )
          .fromTo(
            '[data-hero-mobile-anim="title"]',
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.75 },
            0.14
          )
          .fromTo(
            '[data-hero-mobile-anim="body"]',
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.08 },
            0.24
          );
        if (headerRef.current) {
          mobTl.fromTo(
            headerRef.current,
            { opacity: 0, y: -14 },
            { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
            0.28
          );
        }
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      // 1. Diagonal geometric background reveal
      tl.fromTo(
        '[data-hero-bg-parallax]',
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1.04, duration: 1.1, ease: 'power3.out' },
        0
      )
        // 2. Center portrait entrance
        .fromTo(
          '[data-hero-portrait]',
          { opacity: 0, y: 36, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 1.15 },
          0.06
        )
        // 3. Oversized VINCE & QUIJANO SVG mask + letter stagger from behind portrait
        .fromTo(
          '[data-vince-mask]',
          { attr: { x: 459, width: 0 } },
          { attr: { x: 32, width: 428 }, duration: 1.05, ease: 'expo.inOut' },
          0.1
        )
        .fromTo(
          '[data-hero-letter-left]',
          { opacity: 0, x: 44 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: { each: 0.055, from: 'end' },
          },
          0.14
        )
        .fromTo(
          '[data-quijano-mask]',
          { attr: { width: 0 } },
          { attr: { width: 410 }, duration: 1.1, ease: 'expo.inOut' },
          0.14
        )
        .fromTo(
          '[data-hero-letter-right]',
          { opacity: 0, x: -44 },
          {
            opacity: 1,
            x: 0,
            duration: 0.9,
            stagger: { each: 0.048, from: 'start' },
          },
          0.18
        )
        // 4. Sequential introduction & CTAs
        .fromTo(
          '[data-hero-desc]',
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.36
        )
        .fromTo(
          '[data-hero-cta]',
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 },
          0.45
        );

      // 5. Navigation pill & branding bar
      if (headerRef.current) {
        tl.fromTo(
          headerRef.current,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          0.48
        );
      }

      // 6. Right tagline & bottom corner anchors
      tl.fromTo(
        '[data-hero-tagline]',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.5
      )
        .fromTo(
          '[data-hero-tagline-line]',
          { scaleX: 0, transformOrigin: 'right center' },
          { scaleX: 1, duration: 0.8 },
          0.56
        )
        .fromTo(
          '[data-hero-scroll]',
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.6
        )
        .fromTo(
          '[data-hero-social]',
          { opacity: 0, y: 14, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.07 },
          0.64
        );
    }, heroRef);

    return () => ctx.revert();
  }, [heroReady]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const api = parallaxApiRef.current;
    const host = heroRef.current;
    if (!api || !host) return;
    const rect = host.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    api.bgX(nx * -12);
    api.bgY(ny * -9);
    api.pX(nx * 7);
    api.pY(ny * 4);
    api.starX(nx * 6);
    api.starY(ny * 6);
  };

  const handleMouseLeave = () => {
    const api = parallaxApiRef.current;
    if (!api) return;
    api.bgX(0);
    api.bgY(0);
    api.pX(0);
    api.pY(0);
    api.starX(0);
    api.starY(0);
  };

  const normalizedActive =
    activeSection === 'profile-top' || activeSection === 'home'
      ? 'home'
      : activeSection === 'certificates' || activeSection === 'experience'
      ? 'projects'
      : activeSection;

  return (
    <>
      {/* ============================================================
          TOP FLOATING NAVIGATION BAR
          ============================================================ */}
      <header
        ref={headerRef}
        data-hero-nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'py-3 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'py-5 sm:py-6 lg:py-[2.2vw] bg-transparent'
        }`}
      >
        <div className="w-full px-5 sm:px-10 lg:px-[3.8%] flex items-center justify-between">
          {/* Upper-Left Personal Branding: VQ | VINCE QUIJANO */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
            data-magnetic="0.16"
            className="group flex items-center gap-3 sm:gap-3.5 focus:outline-none select-none"
            aria-label="VQ | Vince Quijano"
          >
            <svg
              viewBox="0 0 76 46"
              className="w-8 h-5 sm:w-9 sm:h-6 lg:w-[36px] lg:h-[23px] transition-transform duration-300 group-hover:scale-105"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="vqRefGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="55%" stopColor="#D4D4D4" />
                  <stop offset="100%" stopColor="#9A9A9A" />
                </linearGradient>
              </defs>
              <path
                d="M1 3 L11 3 L21 32 L31 3 L41 3 L25.5 43 L16.5 43 Z"
                fill="#FFFFFF"
              />
              <path
                d="M52 2 C64.5 2 73 10.5 73 22.5 C73 29 70 34.8 64.8 38.4 L72 44.5 L61.5 44.5 L56.8 40.5 C55.2 41 53.6 41.3 52 41.3 C39.5 41.3 31 32.8 31 21.5 C31 10.5 39.5 2 52 2 Z M52 10.8 C44.8 10.8 40.2 15.2 40.2 21.5 C40.2 27.8 44.8 32.5 52 32.5 C54 32.5 55.8 32 57.4 31.1 L50.8 25.5 L59.5 25.5 L61.8 27.5 C62.7 25.8 63.2 23.8 63.2 21.5 C63.2 15.2 59.2 10.8 52 10.8 Z"
                fill="url(#vqRefGrad)"
              />
            </svg>

            <span className="h-5 sm:h-6 w-[1px] bg-white/40" />

            <span className="text-[11px] sm:text-xs lg:text-[12.5px] font-normal uppercase tracking-[0.28em] text-[#D8D8D8] group-hover:text-white transition-colors whitespace-nowrap">
              VINCE QUIJANO
            </span>
          </a>

          {/* Upper-Right Navigation Pill Menu */}
          <div className="flex items-center">
            <nav
              aria-label="Primary Navigation"
              className={`hidden md:flex items-center rounded-full border border-white/25 bg-[#121212]/70 backdrop-blur-md transition-all duration-300 ${
                isScrolled ? 'p-[2px] shadow-[0_6px_24px_rgba(0,0,0,0.6)]' : 'p-[2px]'
              }`}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = normalizedActive === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    data-magnetic="0.14"
                    className={`nav-pill-link px-4 lg:px-5 rounded-full text-xs lg:text-[13px] transition-all duration-300 cursor-pointer active:scale-95 ${
                      isScrolled ? 'py-1' : 'py-1.5'
                    } ${
                      isActive
                        ? 'is-active bg-white text-[#0A0A0A] font-semibold shadow-[0_0_16px_rgba(255,255,255,0.28)]'
                        : 'text-[#E0E0E0] hover:text-white font-normal'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-10 h-10 rounded-full border border-white/25 bg-[#151515]/90 backdrop-blur-md text-white flex items-center justify-center hover:border-white transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 mx-4 p-4 rounded-2xl bg-[#151515]/95 backdrop-blur-2xl border border-white/15 shadow-2xl animate-modal-in">
            <div className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = normalizedActive === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      onNavigate(item.id);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-white text-[#0A0A0A] font-bold'
                        : 'text-[#C8C8C8] hover:bg-[#242424] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />}
                  </a>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRateModal('all');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#242424] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-white text-white" />
                <span>
                  {ratingsState.average} ({ratingsState.count} Reviews)
                </span>
              </button>
              <a
                href="/assets/resume/Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-white text-[#0A0A0A] text-xs font-bold flex items-center gap-1.5"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          HERO SECTION — GSAP MASTER CINEMATIC COMPOSITION
          ============================================================ */}
      <section
        id="home"
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-screen min-h-[620px] max-h-[1100px] bg-[#0D0D0D] overflow-hidden select-none"
      >
        {/* 1. Diagonal Geometric Background & Studio Lighting */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div data-hero-bg-parallax className="absolute inset-0">
            <svg
              viewBox="0 0 1024 576"
              preserveAspectRatio="none"
              data-hero-geo-drift
              className="w-full h-full"
            >
              <defs>
                <radialGradient id="bgStudioLight" cx="48%" cy="45%" r="65%">
                  <stop offset="0%" stopColor="#1F1F1F" />
                  <stop offset="55%" stopColor="#121212" />
                  <stop offset="100%" stopColor="#0A0A0A" />
                </radialGradient>

                <linearGradient id="refMainBeam" x1="56%" y1="0%" x2="32%" y2="100%">
                  <stop offset="0%" stopColor="#EAEAEA" />
                  <stop offset="45%" stopColor="#D5D5D5" />
                  <stop offset="80%" stopColor="#BDBDBD" />
                  <stop offset="100%" stopColor="#A6A6A6" />
                </linearGradient>

                <linearGradient id="refSecondaryRibbon" x1="70%" y1="0%" x2="52%" y2="85%">
                  <stop offset="0%" stopColor="#9E9E9E" stopOpacity="0.55" />
                  <stop offset="35%" stopColor="#5A5A5A" stopOpacity="0.38" />
                  <stop offset="75%" stopColor="#262626" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#121212" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="refBottomLeftWing" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CCCCCC" stopOpacity="0.88" />
                  <stop offset="65%" stopColor="#9A9A9A" stopOpacity="0.68" />
                  <stop offset="100%" stopColor="#686868" stopOpacity="0.45" />
                </linearGradient>

                <linearGradient id="refBottomRightShard1" x1="100%" y1="20%" x2="10%" y2="90%">
                  <stop offset="0%" stopColor="#B8B8B8" stopOpacity="0.34" />
                  <stop offset="55%" stopColor="#525252" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#181818" stopOpacity="0.04" />
                </linearGradient>

                <linearGradient id="refBottomRightShard2" x1="90%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9A9A9A" stopOpacity="0.25" />
                  <stop offset="60%" stopColor="#383838" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#121212" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <rect width="1024" height="576" fill="url(#bgStudioLight)" />

              <ellipse
                cx="145"
                cy="420"
                rx="190"
                ry="140"
                fill="rgba(255,255,255,0.035)"
              />

              <path
                d="M 454 12 A 305 305 0 0 0 278 265"
                fill="none"
                stroke="rgba(210, 210, 210, 0.36)"
                strokeWidth="1.15"
              />

              <polygon
                points="666,0 762,0 535,576 432,576"
                fill="url(#refSecondaryRibbon)"
              />

              <polygon
                points="318,438 232,576 80,576"
                fill="url(#refBottomLeftWing)"
              />
              <polygon
                points="318,438 380,576 225,576"
                fill="#C8C8C8"
                fillOpacity="0.92"
              />

              <polygon
                points="459,0 666,0 432,576 225,576"
                fill="url(#refMainBeam)"
              />

              <polygon
                points="1024,288 1024,412 732,500 806,358"
                fill="url(#refBottomRightShard1)"
              />
              <polygon
                points="1024,370 1024,468 634,576 764,424"
                fill="url(#refBottomRightShard2)"
              />
              <polygon
                points="895,245 1024,245 935,425 806,358"
                fill="rgba(255,255,255,0.035)"
              />
            </svg>
          </div>
        </div>

        {/* 2. DESKTOP / TABLET STAGE */}
        <div className="hidden md:block relative w-full h-full">
          {/* B. 4-POINT STAR FLARE (Above the 'O' in QUIJANO) */}
          <div
            data-hero-star
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{
              left: '93.65%',
              top: '23.61%',
              width: '7.6vw',
              height: '7.6vw',
              maxWidth: '110px',
              maxHeight: '110px',
            }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <line
                x1="0"
                y1="50"
                x2="100"
                y2="50"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="0.85"
              />
              <line
                x1="50"
                y1="5"
                x2="50"
                y2="95"
                stroke="rgba(255,255,255,0.42)"
                strokeWidth="0.85"
              />
              <path
                d="M50 18 C51.6 43 57 48.4 82 50 C57 51.6 51.6 57 50 82 C48.4 57 43 51.6 18 50 C43 48.4 48.4 43 50 18 Z"
                fill="#E8E8E8"
              />
              <circle cx="50" cy="50" r="5" fill="#FFFFFF" filter="blur(2px)" />
            </svg>
          </div>

          {/* C. OVERSIZED "VINCE" AND "QUIJANO" VECTOR TYPOGRAPHY (GSAP Animated Clip Masks) */}
          <h1 className="sr-only">VINCE QUIJANO — Portfolio</h1>
          <svg
            viewBox="0 0 1024 576"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 w-full h-full z-20"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="folioLetterGrad" x1="0%" y1="0%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#F5F5F5" />
                <stop offset="50%" stopColor="#DCDCDC" />
                <stop offset="100%" stopColor="#BDBDBD" />
              </linearGradient>

              <clipPath id="portBeamClip">
                <polygon points="0,0 459,0 225,576 0,576" />
              </clipPath>

              <clipPath id="vinceRevealMask">
                <rect data-vince-mask x="32" y="150" width="428" height="115" />
              </clipPath>

              <clipPath id="quijanoRevealMask">
                <rect data-quijano-mask x="590" y="150" width="415" height="115" />
              </clipPath>
            </defs>

            {/* "VINCE" — emerging outward from behind portrait to the left */}
            <g clipPath="url(#portBeamClip)">
              <g clipPath="url(#vinceRevealMask)" fill="#FFFFFF">
                <path
                  data-hero-letter-left
                  d="M40 171 H64 L79 217 L94 171 H118 L91 242 H67 Z"
                />
                <path data-hero-letter-left d="M126 171 H149 V242 H126 Z" />
                <path
                  data-hero-letter-left
                  d="M161 171 H183 L215 212 V171 H237 V242 H215 L183 201 V242 H161 Z"
                />
                <path
                  data-hero-letter-left
                  d="M275 171 H304 C316 171 322 178 322 192 V195 H300 V192 C300 189 298 188 294 188 H277 C271.5 188 269 191.5 269 198 V215 C269 221.5 271.5 225 277 225 H294 C298 225 300 224 300 221 V217 H322 V221 C322 235 316 242 304 242 H275 C258 242 248 231 248 214 V199 C248 182 258 171 275 171 Z"
                />
                <path
                  data-hero-letter-left
                  d="M332 171 H398 V187.5 H354 V198.5 H391 V214.5 H354 V225.5 H398 V242 H332 Z"
                />
              </g>
            </g>

            {/* "QUIJANO" — emerging outward from behind portrait to the right */}
            <g clipPath="url(#quijanoRevealMask)" fill="url(#folioLetterGrad)">
              <path
                data-hero-letter-right
                fillRule="evenodd"
                d="M622 171 H636 C650 171 658 181 658 197 V215 C658 224 655 231.5 649.5 236.5 L659 245 H641 L635.5 240 C633 241.3 630 242 627 242 H622 C608 242 600 232 600 216 V197 C600 181 608 171 622 171 Z M624 187.5 C620 187.5 618 190.5 618 196 V217 C618 222.5 620 225.5 624 225.5 H634 C635.5 225.5 636.8 225.1 637.8 224.3 L628 215.5 H640 V196 C640 190.5 638 187.5 634 187.5 Z"
              />
              <path
                data-hero-letter-right
                d="M665 171 H683 V217 C683 222.5 686 225.5 691 225.5 H695 C700 225.5 703 222.5 703 217 V171 H721 V217 C721 232.5 712 242 697 242 H689 C674 242 665 232.5 665 217 Z"
              />
              <path data-hero-letter-right d="M728 171 H746 V242 H728 Z" />
              <path
                data-hero-letter-right
                d="M780 171 H798 V218 C798 233 789.5 242 775 242 H771 C758 242 752 234 752 220 V213 H769 V219 C769 223.5 771 225.5 774.5 225.5 H776 C779 225.5 780 223.5 780 219 Z"
              />
              <path
                data-hero-letter-right
                fillRule="evenodd"
                d="M823 171 H843 L863 242 H844 L840.5 228 H825.5 L822 242 H803 Z M833 189 L827.5 213.5 H838.5 Z"
              />
              <path
                data-hero-letter-right
                d="M869 171 H886 L909 211 V171 H926 V242 H909 L886 202 V242 H869 Z"
              />
              <path
                data-hero-letter-right
                fillRule="evenodd"
                d="M955 171 H969 C983 171 991 181 991 197 V216 C991 232 983 242 969 242 H955 C941 242 933 232 933 216 V197 C933 181 941 171 955 171 Z M957 187.5 C953 187.5 951 190.5 951 196 V217 C951 222.5 953 225.5 957 225.5 H967 C971 225.5 973 222.5 973 217 V196 C973 190.5 971 187.5 967 187.5 Z"
              />
            </g>
          </svg>

          {/* D. CENTER PORTRAIT (Entrance + float + cursor parallax + scroll depth) */}
          <div
            data-hero-portrait
            className="pointer-events-none absolute bottom-0 z-30 flex items-end justify-center"
            style={{
              left: '29.0%',
              width: '43.55%',
              height: '89.58%',
            }}
          >
            <div data-hero-scroll-depth className="w-full h-full flex items-end justify-center">
              <div data-hero-portrait-parallax className="w-full h-full flex items-end justify-center">
                <img
                  data-hero-portrait-float
                  src="/assets/images/headshot/vince-portrait-cutout.png"
                  alt="Vince Quijano Portrait"
                  className="w-full h-full object-contain object-bottom drop-shadow-[0_18px_38px_rgba(0,0,0,0.75)]"
                />
              </div>
            </div>
          </div>

          {/* E. LEFT-SIDE DESCRIPTION & MAGNETIC BUTTONS */}
          <div
            className="absolute z-30 text-left"
            style={{
              left: '3.81%',
              top: '47.5%',
              maxWidth: '31%',
            }}
          >
            <p
              data-hero-desc
              className="text-sm lg:text-[15.5px] xl:text-[17px] text-[#E0E0E0] leading-[1.55] font-normal max-w-[340px] xl:max-w-[380px]"
            >
              A BS Computer Science student passionate about technology,
              problem-solving, and building innovative solutions.
            </p>

            <div className="mt-6 lg:mt-8 flex items-center gap-3 lg:gap-3.5">
              <div data-hero-cta>
                <button
                  type="button"
                  onClick={() => onNavigate('projects')}
                  data-magnetic="0.22"
                  className="group px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs lg:text-[13px] font-semibold flex items-center gap-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.45)] hover:shadow-[0_0_28px_rgba(255,255,255,0.35)] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <span>Explore My Work</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2] transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              <div data-hero-cta>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  data-magnetic="0.22"
                  className="group px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[#141414]/70 hover:bg-[#242424] text-[#EAEAEA] hover:text-white border border-white/40 hover:border-white text-xs lg:text-[13px] font-normal flex items-center gap-2 backdrop-blur-md active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 text-[#D4D4D4] group-hover:text-white stroke-[1.75]" />
                  <span>About Me</span>
                </button>
              </div>
            </div>
          </div>

          {/* F. RIGHT-SIDE TAGLINE: "CODE • ANALYZE • INNOVATE" */}
          <div
            data-hero-tagline
            className="absolute z-30 flex flex-col items-end text-right"
            style={{
              right: '3.8%',
              top: '49.2%',
            }}
          >
            <p className="text-[11px] lg:text-[13px] xl:text-[14.5px] font-normal uppercase tracking-[0.23em] text-[#E5E5E5] whitespace-nowrap">
              CODE &nbsp;•&nbsp; ANALYZE &nbsp;•&nbsp; INNOVATE
            </p>
            <div data-hero-tagline-line className="mt-3.5 h-[1px] w-[68%] bg-white/35" />
          </div>

          {/* G. BOTTOM-LEFT: SCROLL DOWN INDICATOR + VERTICAL LINE */}
          <div
            data-hero-scroll
            className="absolute z-30 flex flex-col items-start"
            style={{
              left: '4.1%',
              bottom: 0,
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate('about')}
              data-magnetic="0.18"
              className="group flex items-center gap-3 text-xs lg:text-[12.5px] text-[#C8C8C8] hover:text-white transition-colors cursor-pointer focus:outline-none"
              aria-label="Scroll down to About section"
            >
              <div className="w-[18px] h-[30px] rounded-full border-[1.25px] border-[#D4D4D4] group-hover:border-white flex flex-col items-center justify-center gap-1 transition-colors">
                <span className="w-[1.25px] h-2.5 bg-white animate-scroll-wheel" />
                <span className="w-[2px] h-[2px] rounded-full bg-white/80" />
              </div>
              <span className="tracking-wide font-normal">Scroll Down</span>
            </button>

            <div className="w-[18px] flex justify-center mt-1.5">
              <span className="w-[1px] h-11 lg:h-13 bg-white/45" />
            </div>
          </div>

          {/* H. BOTTOM-RIGHT: CIRCULAR MAGNETIC SOCIAL ICONS */}
          <div
            className="absolute z-30 flex items-center gap-3.5 lg:gap-4"
            style={{
              right: '3.8%',
              bottom: '9.5%',
            }}
          >
            <div data-hero-social>
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.25"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-[1.35px] border-white/75 bg-black/40 hover:bg-white text-white hover:text-[#0A0A0A] hover:border-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                aria-label="GitHub Profile"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
            </div>

            <div data-hero-social>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic="0.25"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-[1.35px] border-white/75 bg-black/40 hover:bg-white text-white hover:text-[#0A0A0A] hover:border-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-current" aria-hidden="true">
                  <path d="M6.94 8.5v10H3.88v-10h3.06zM5.41 4.25c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8zM13.06 8.5v1.37h.04c.43-.81 1.48-1.66 3.04-1.66 3.25 0 3.85 2.14 3.85 4.92v5.37h-3.05v-4.76c0-1.14-.02-2.6-1.58-2.6-1.59 0-1.83 1.24-1.83 2.52v4.84h-3.05v-10h2.58z" />
                </svg>
              </a>
            </div>

            <div data-hero-social>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                data-magnetic="0.25"
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-[1.35px] border-white/75 bg-black/40 hover:bg-white text-white hover:text-[#0A0A0A] hover:border-white flex items-center justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.35)]"
                aria-label="Email & Contact"
                title={`Contact ${profileData.email}`}
              >
                <Mail className="w-4.5 h-4.5 stroke-[1.75]" />
              </a>
            </div>
          </div>
        </div>

        {/* 3. MOBILE STAGE (< md): OPTIMIZED RESPONSIVE HERO */}
        <div className="md:hidden relative z-20 w-full h-full flex flex-col justify-between pt-20 pb-6 px-5">
          <div className="relative flex-1 flex flex-col items-center justify-end">
            <div
              data-hero-mobile-anim="title"
              className="absolute top-[18%] inset-x-0 text-center pointer-events-none z-0"
              aria-hidden="true"
            >
              <span className="hero-display-text block text-[9.5vw] font-black uppercase text-white tracking-wider leading-none">
                VINCE QUIJANO
              </span>
            </div>

            <div
              data-hero-mobile-anim="portrait"
              className="relative z-10 w-[265px] sm:w-[310px] max-h-[42vh] flex items-end justify-center"
            >
              <img
                src="/assets/images/headshot/vince-portrait-cutout.png"
                alt="Vince Quijano Portrait"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_18px_35px_rgba(0,0,0,0.85)]"
              />
            </div>
          </div>

          <div
            data-hero-mobile-anim="body"
            className="relative z-20 pt-3 text-left bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/95 to-transparent"
          >
            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C8C8C8] mb-2">
              CODE &nbsp;•&nbsp; ANALYZE &nbsp;•&nbsp; INNOVATE
            </p>
            <p className="text-[13.5px] sm:text-sm text-[#E0E0E0] leading-relaxed">
              A BS Computer Science student passionate about technology,
              problem-solving, and building innovative solutions.
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate('projects')}
                className="flex-1 py-2.5 px-4 rounded-full bg-white text-[#0A0A0A] text-xs font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95 transition-transform"
              >
                <span>Explore My Work</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="py-2.5 px-4 rounded-full bg-[#151515]/85 text-white border border-white/40 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
              >
                <User className="w-3.5 h-3.5" />
                <span>About Me</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="flex items-center gap-2 text-[11px] text-[#C8C8C8]"
              >
                <div className="w-3.5 h-5 rounded-full border border-white/60 flex justify-center pt-1">
                  <span className="w-px h-1.5 bg-white animate-scroll-wheel" />
                </div>
                <span>Scroll Down</span>
              </button>

              <div className="flex items-center gap-2.5">
                <a
                  href={profileData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/65 bg-black/40 text-white flex items-center justify-center"
                  aria-label="GitHub"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a
                  href={profileData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/65 bg-black/40 text-white flex items-center justify-center"
                  aria-label="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                    <path d="M6.94 8.5v10H3.88v-10h3.06zM5.41 4.25c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8zM13.06 8.5v1.37h.04c.43-.81 1.48-1.66 3.04-1.66 3.25 0 3.85 2.14 3.85 4.92v5.37h-3.05v-4.76c0-1.14-.02-2.6-1.58-2.6-1.59 0-1.83 1.24-1.83 2.52v4.84h-3.05v-10h2.58z" />
                  </svg>
                </a>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="w-8 h-8 rounded-full border border-white/65 bg-black/40 text-white flex items-center justify-center"
                  aria-label="Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
