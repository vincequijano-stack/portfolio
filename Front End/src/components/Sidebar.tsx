import React from 'react';
import {
  Home,
  Heart,
  Moon,
  Sun
} from 'lucide-react';
import { InstagramIcon, GithubIcon, LinkedinIcon } from './SocialIcons';
import { profileData } from '../data/profile';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenCVModal?: () => void;
  onOpenActivity?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  onOpenActivity,
  unreadCount = 0,
}) => {
  const { theme, toggleTheme } = useTheme();

  // Direct Gmail compose link for clients
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profileData.email
  )}&su=${encodeURIComponent('Project Inquiry for Vince Quijano')}&body=${encodeURIComponent(
    'Hi Vince,\n\nI visited your portfolio website and would like to discuss a project / opportunity...'
  )}`;

  const handleMessageMe = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(gmailComposeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      className="hidden md:flex flex-col w-[72px] h-screen fixed left-0 top-0 bg-white dark:bg-black border-r border-[#DBDBDB] dark:border-[#262626] z-40 py-6 items-center select-none transition-colors duration-200"
      aria-label="Instagram Navigation"
    >
      {/* 1. Top Instagram Camera Glyph */}
      <div className="flex flex-col items-center gap-6 w-full">
        <a
          href="#profile-top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile-top');
          }}
          className="p-3 text-black dark:text-white hover:scale-105 transition-transform"
          aria-label="Instagram Home"
          title="Instagram"
        >
          <InstagramIcon className="w-6 h-6 stroke-[2]" />
        </a>

        {/* 2. Navigation Icons (Search, Reels, and Plus replaced with Theme, GitHub, Menu) */}
        <nav className="flex flex-col items-center gap-4 w-full">
          {/* Home */}
          <button
            onClick={() => onNavigate('profile-top')}
            className={`p-3 rounded-xl transition-all ${
              activeSection === 'profile-top'
                ? 'text-black dark:text-white bg-[#F2F2F2] dark:bg-[#1A1A1A]'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A]'
            }`}
            title="Home"
            aria-label="Home"
          >
            <Home
              className={`w-6 h-6 transition-transform hover:scale-110 ${
                activeSection === 'profile-top' ? 'stroke-[2.5] fill-current' : 'stroke-[1.75]'
              }`}
            />
          </button>

          {/* Notifications (Heart) with Real-Time Notification Badge */}
          <button
            onClick={() => {
              if (onOpenActivity) {
                onOpenActivity();
              } else {
                onNavigate('certificates');
              }
            }}
            className="p-3 rounded-xl text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-all relative group"
            title="Notifications / Activity"
            aria-label="Notifications"
          >
            <div className="relative">
              <Heart className={`w-6 h-6 stroke-[1.75] transition-transform group-hover:scale-110 ${unreadCount > 0 ? 'text-[#ED4956]' : ''}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ED4956] text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
          </button>

          {/* Profile (Mini Circular Avatar) */}
          <button
            onClick={() => onNavigate('about')}
            className={`p-2 rounded-xl transition-all ${
              activeSection === 'about'
                ? 'bg-[#F2F2F2] dark:bg-[#1A1A1A]'
                : 'hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A]'
            }`}
            title="Profile Details"
            aria-label="Profile"
          >
            <div
              className={`w-7 h-7 rounded-full p-[1.5px] transition-transform hover:scale-110 ${
                activeSection === 'about'
                  ? 'border-2 border-black dark:border-white'
                  : 'border border-[#DBDBDB] dark:border-[#363636]'
              }`}
            >
              <img
                src="/assets/images/headshot/headshot.jpg"
                alt={profileData.name}
                className="w-full h-full rounded-full object-cover"
                style={{ objectPosition: '0% 20%' }}
              />
            </div>
          </button>

          {/* Switch appearance (Theme toggle - Replaced from below) */}
          <button
            onClick={toggleTheme}
            className="p-3 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-xl transition-all"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Switch appearance"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6 stroke-[1.75] transition-transform hover:-rotate-12" />
            ) : (
              <Sun className="w-6 h-6 text-amber-400 stroke-[1.75] transition-transform hover:rotate-45" />
            )}
          </button>

          {/* GitHub Profile (Replaced from below) */}
          <a
            href={profileData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-xl transition-all"
            title="GitHub Profile"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5 transition-transform hover:scale-110" />
          </a>

          {/* LinkedIn Profile */}
          <a
            href={profileData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-xl transition-all"
            title="LinkedIn Profile"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5 transition-transform hover:scale-110" />
          </a>
        </nav>
      </div>
    </aside>
  );
};
