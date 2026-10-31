import React from 'react';
import {
  Home,
  Heart,
  Moon,
  Sun,
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

  return (
    <aside
      className="hidden md:flex flex-col w-[76px] h-screen fixed left-0 top-0 bg-white dark:bg-black border-r border-[#DBDBDB] dark:border-[#262626] z-40 py-6 items-center select-none transition-colors duration-200"
      aria-label="Instagram Navigation"
    >
      {/* 1. Top Instagram Camera Glyph */}
      <div className="flex flex-col items-center gap-4 w-full px-1.5">
        <a
          href="#profile-top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile-top');
          }}
          className="p-2.5 text-black dark:text-white hover:scale-105 transition-transform"
          aria-label="Instagram Home"
          title="Back to Top"
        >
          <InstagramIcon className="w-6 h-6 stroke-[2]" />
        </a>

        {/* 2. Original Navigation Items with Upgraded Design */}
        <nav className="flex flex-col items-center gap-2.5 w-full">
          {/* Home */}
          <button
            onClick={() => onNavigate('profile-top')}
            className={`relative w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
              activeSection === 'profile-top'
                ? 'text-[#0095F6] bg-[#0095F6]/10 dark:bg-[#0095F6]/15 font-bold'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]'
            }`}
            title="Home"
            aria-label="Home"
          >
            {activeSection === 'profile-top' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#0095F6]" />
            )}
            <Home
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'
              }`}
            />
            <span className="text-[9.5px] leading-none tracking-tight">Home</span>
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
            className="w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-all relative group cursor-pointer"
            title="Notifications / Activity"
            aria-label="Notifications"
          >
            <div className="relative">
              <Heart
                className={`w-5 h-5 stroke-[1.75] transition-transform group-hover:scale-110 ${
                  unreadCount > 0 ? 'text-[#ED4956] fill-[#ED4956]/20' : ''
                }`}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ED4956] text-white text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px] leading-none tracking-tight">Activity</span>
          </button>

          {/* Profile (Mini Circular Avatar) */}
          <button
            onClick={() => onNavigate('about')}
            className={`relative w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group ${
              activeSection === 'about'
                ? 'text-[#0095F6] bg-[#0095F6]/10 dark:bg-[#0095F6]/15 font-bold'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]'
            }`}
            title="Profile Details"
            aria-label="Profile"
          >
            {activeSection === 'about' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#0095F6]" />
            )}
            <div
              className={`w-6 h-6 rounded-full p-[1.5px] transition-transform group-hover:scale-110 ${
                activeSection === 'about'
                  ? 'border-2 border-[#0095F6]'
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
            <span className="text-[9.5px] leading-none tracking-tight">Profile</span>
          </button>

          {/* Switch appearance (Theme toggle) */}
          <button
            onClick={toggleTheme}
            className="w-full py-2.5 px-1 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Switch appearance"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 stroke-[1.75] transition-transform group-hover:-rotate-12" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 stroke-[1.75] transition-transform group-hover:rotate-45" />
            )}
            <span className="text-[9.5px] leading-none tracking-tight">Theme</span>
          </button>

          {/* GitHub Profile */}
          <a
            href={profileData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-1 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
            title="GitHub Profile"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[9.5px] leading-none tracking-tight">GitHub</span>
          </a>

          {/* LinkedIn Profile */}
          <a
            href={profileData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-1 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1 transition-all group"
            title="LinkedIn Profile"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[9.5px] leading-none tracking-tight">LinkedIn</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};
