import React from 'react';
import { Home, Grid, Award, Mail, Moon, Sun } from 'lucide-react';
import { profileData } from '../data/profile';
import { useTheme } from '../context/ThemeContext';

interface MobileNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenActivity?: () => void;
  unreadCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeSection,
  onNavigate,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-[#DBDBDB] dark:border-[#262626] px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none shadow-md">
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('profile-top')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'profile-top' ? 'text-[#0095F6] font-bold' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="Home"
      >
        <Home className={`w-5 h-5 ${activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px]">Home</span>
      </button>

      {/* 2. Projects */}
      <button
        onClick={() => onNavigate('projects')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'projects' ? 'text-[#0095F6] font-bold' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="Projects"
      >
        <Grid className={`w-5 h-5 ${activeSection === 'projects' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px]">Projects</span>
      </button>

      {/* 3. Certificates */}
      <button
        onClick={() => onNavigate('certificates')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'certificates' ? 'text-[#0095F6] font-bold' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="Certificates"
      >
        <Award className={`w-5 h-5 ${activeSection === 'certificates' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px]">Certs</span>
      </button>

      {/* 4. Mini Profile / About */}
      <button
        onClick={() => onNavigate('about')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'about' ? 'text-[#0095F6] font-bold' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="About"
      >
        <div
          className={`w-5 h-5 rounded-full p-[1.5px] ${
            activeSection === 'about'
              ? 'bg-[#0095F6]'
              : 'bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4]'
          }`}
        >
          <div className="w-full h-full rounded-full p-[1px] bg-white dark:bg-black">
            <img
              src="/assets/images/headshot/headshot.jpg"
              alt={profileData.name}
              className="w-full h-full rounded-full object-cover"
              style={{ objectPosition: '0% 20%' }}
            />
          </div>
        </div>
        <span className="text-[9px]">About</span>
      </button>

      {/* 5. Contact */}
      <button
        onClick={() => onNavigate('contact')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'contact' ? 'text-[#0095F6] font-bold' : 'text-[#737373] dark:text-[#A8A8A8]'
        }`}
        aria-label="Contact"
      >
        <Mail className={`w-5 h-5 ${activeSection === 'contact' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px]">Contact</span>
      </button>

      {/* 6. Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#737373] dark:text-[#A8A8A8] cursor-pointer"
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
