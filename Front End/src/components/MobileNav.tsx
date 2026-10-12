import React from 'react';
import { Home, Moon, Sun } from 'lucide-react';
import { MessengerIcon } from './SocialIcons';
import { profileData } from '../data/profile';
import { useTheme } from '../context/ThemeContext';

interface MobileNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeSection,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profileData.email
  )}&su=${encodeURIComponent('Project Inquiry for Vince Quijano')}`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#DBDBDB] dark:border-[#262626] px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none shadow-md">
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('profile-top')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors ${
          activeSection === 'profile-top' ? 'text-[#0095F6]' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="Home"
      >
        <Home className={`w-5 h-5 ${activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px] font-semibold">Home</span>
      </button>

      {/* 2. Message me (Gmail) */}
      <a
        href={gmailComposeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#737373] dark:text-[#A8A8A8] relative"
        aria-label="Message me via Gmail"
      >
        <div className="relative">
          <MessengerIcon className="w-5 h-5 stroke-[1.75]" />
          <span className="absolute -top-1 -right-1 bg-[#ED4956] text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
            2
          </span>
        </div>
        <span className="text-[9px] font-semibold">Message</span>
      </a>

      {/* 3. Mini Profile with Story Ring */}
      <button
        onClick={() => onNavigate('about')}
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#737373] dark:text-[#A8A8A8]"
        aria-label="Profile"
      >
        <div className="w-5 h-5 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4]">
          <div className="w-full h-full rounded-full p-[1px] bg-white dark:bg-black">
            <img
              src="/assets/images/headshot/headshot.jpg"
              alt={profileData.name}
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: '0% 20%' }}
            />
          </div>
        </div>
        <span className="text-[9px] font-semibold">Profile</span>
      </button>

      {/* 4. Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#737373] dark:text-[#A8A8A8]"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 stroke-[1.75]" />
        ) : (
          <Sun className="w-5 h-5 text-amber-400 stroke-[1.75]" />
        )}
        <span className="text-[9px] font-semibold">Theme</span>
      </button>
    </nav>
  );
};
