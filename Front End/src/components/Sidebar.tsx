import React from 'react';
import {
  Home,
  Heart,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from './SocialIcons';
import { profileData } from '../data/profile';

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
  return (
    <aside
      className="hidden md:flex flex-col w-[88px] h-screen fixed left-0 top-0 bg-white dark:bg-black border-r border-[#DBDBDB] dark:border-[#262626] z-40 py-7 items-center select-none transition-colors duration-200"
      aria-label="Portfolio Navigation"
    >
      <div className="flex flex-col items-center w-full px-2">
        {/* Navigation Items: Home, Activity, GitHub, LinkedIn, Facebook */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('profile-top')}
            className={`relative w-full py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
              activeSection === 'profile-top'
                ? 'text-[#0095F6] bg-[#0095F6]/10 dark:bg-[#0095F6]/15 font-bold'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A]'
            }`}
            title="Home"
            aria-label="Home"
          >
            {activeSection === 'profile-top' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3.5px] rounded-r-full bg-[#0095F6]" />
            )}
            <Home
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'
              }`}
            />
            <span className="text-[11px] font-medium leading-none tracking-tight">Home</span>
          </button>

          {/* 2. Activity (Notifications) */}
          <button
            onClick={() => {
              if (onOpenActivity) {
                onOpenActivity();
              } else {
                onNavigate('certificates');
              }
            }}
            className="w-full py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1.5 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] transition-all relative group cursor-pointer"
            title="Notifications / Activity"
            aria-label="Notifications"
          >
            <div className="relative">
              <Heart
                className={`w-6 h-6 stroke-[1.75] transition-transform group-hover:scale-110 ${
                  unreadCount > 0 ? 'text-[#ED4956] fill-[#ED4956]/20' : ''
                }`}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#ED4956] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-xs animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium leading-none tracking-tight">Activity</span>
          </button>

          {/* 3. GitHub Profile */}
          <a
            href={profileData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-1.5 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
            title="GitHub Profile"
            aria-label="GitHub"
          >
            <GithubIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-medium leading-none tracking-tight">GitHub</span>
          </a>

          {/* 4. LinkedIn Profile */}
          <a
            href={profileData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-1.5 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
            title="LinkedIn Profile"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-medium leading-none tracking-tight">LinkedIn</span>
          </a>

          {/* 5. Facebook Profile */}
          <a
            href={profileData.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-1.5 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
            title="Facebook Profile"
            aria-label="Facebook"
          >
            <FacebookIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-medium leading-none tracking-tight">Facebook</span>
          </a>

          {/* 6. Instagram Profile */}
          <a
            href={profileData.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-1.5 text-[#262626] dark:text-[#F5F5F5] hover:text-[#0095F6] dark:hover:text-[#0095F6] hover:bg-[#F2F2F2] dark:hover:bg-[#1A1A1A] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
            title="Instagram Profile"
            aria-label="Instagram"
          >
            <InstagramIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-[11px] font-medium leading-none tracking-tight">Instagram</span>
          </a>
        </nav>
      </div>
    </aside>
  );
};
