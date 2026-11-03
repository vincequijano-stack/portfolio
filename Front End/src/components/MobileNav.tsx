import React from 'react';
import { Home, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon, FacebookIcon, InstagramIcon } from './SocialIcons';
import { profileData } from '../data/profile';

interface MobileNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenActivity?: () => void;
  unreadCount?: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeSection,
  onNavigate,
  onOpenActivity,
  unreadCount = 0,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAFBF8]/95 backdrop-blur-md border-t border-[#D4E0CD] px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around select-none shadow-md">
      {/* 1. Home */}
      <button
        onClick={() => onNavigate('profile-top')}
        className={`flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 transition-colors cursor-pointer ${
          activeSection === 'profile-top' ? 'text-[#283618] font-bold' : 'text-[#526348]'
        }`}
        aria-label="Home"
      >
        <Home className={`w-5 h-5 ${activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
        <span className="text-[9px]">Home</span>
      </button>

      {/* 2. Activity */}
      <button
        onClick={() => {
          if (onOpenActivity) {
            onOpenActivity();
          } else {
            onNavigate('certificates');
          }
        }}
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#526348] relative cursor-pointer"
        aria-label="Activity and notifications"
      >
        <div className="relative">
          <Heart className={`w-5 h-5 ${unreadCount > 0 ? 'text-[#283618] stroke-[2]' : 'stroke-[1.75]'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#283618] text-white text-[8px] font-bold rounded-full min-w-3.5 h-3.5 px-0.5 flex items-center justify-center shadow-xs animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className="text-[9px] font-semibold">Activity</span>
      </button>

      {/* 3. GitHub */}
      <a
        href={profileData.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#526348] hover:text-[#283618]"
        aria-label="GitHub"
      >
        <GithubIcon className="w-5 h-5" />
        <span className="text-[9px] font-semibold">GitHub</span>
      </a>

      {/* 4. LinkedIn */}
      <a
        href={profileData.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#526348] hover:text-[#283618]"
        aria-label="LinkedIn"
      >
        <LinkedinIcon className="w-5 h-5" />
        <span className="text-[9px] font-semibold">LinkedIn</span>
      </a>

      {/* 5. Facebook */}
      <a
        href={profileData.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#526348] hover:text-[#283618]"
        aria-label="Facebook"
      >
        <FacebookIcon className="w-5 h-5" />
        <span className="text-[9px] font-semibold">Facebook</span>
      </a>

      {/* 6. Instagram */}
      <a
        href={profileData.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center min-w-[48px] min-h-[40px] gap-0.5 text-[#526348] hover:text-[#283618]"
        aria-label="Instagram"
      >
        <InstagramIcon className="w-5 h-5" />
        <span className="text-[9px] font-semibold">Instagram</span>
      </a>
    </nav>
  );
};
