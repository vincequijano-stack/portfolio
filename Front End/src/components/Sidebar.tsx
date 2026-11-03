import React from 'react';
import { Home } from 'lucide-react';
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
}) => {
  return (
    <aside
      className="hidden md:flex flex-col w-[88px] h-screen fixed left-0 top-0 bg-[#FAFBF8]/95 backdrop-blur-md border-r border-[#D4E0CD] z-40 py-7 items-center select-none transition-colors duration-200"
      aria-label="Portfolio Navigation"
    >
      <div className="flex flex-col items-center w-full px-2">
        {/* Navigation Items: Home, GitHub, LinkedIn, Facebook, Instagram */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('profile-top')}
            className={`relative w-full py-3 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group ${
              activeSection === 'profile-top'
                ? 'text-[#283618] bg-[#8FA882]/25 font-bold'
                : 'text-[#526348] hover:text-[#283618] hover:bg-[#EBF1E6]'
            }`}
            title="Home"
            aria-label="Home"
          >
            {activeSection === 'profile-top' && (
              <span className="absolute left-0 top-2 bottom-2 w-[3.5px] rounded-r-full bg-[#283618]" />
            )}
            <Home
              className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                activeSection === 'profile-top' ? 'stroke-[2.5]' : 'stroke-[1.75]'
              }`}
            />
            <span className="text-[11px] font-medium leading-none tracking-tight">Home</span>
          </button>

          {/* 2. GitHub Profile */}
          <a
            href={profileData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-1.5 text-[#526348] hover:text-[#283618] hover:bg-[#EBF1E6] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
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
            className="w-full py-3 px-1.5 text-[#526348] hover:text-[#283618] hover:bg-[#EBF1E6] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
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
            className="w-full py-3 px-1.5 text-[#526348] hover:text-[#283618] hover:bg-[#EBF1E6] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
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
            className="w-full py-3 px-1.5 text-[#526348] hover:text-[#283618] hover:bg-[#EBF1E6] rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all group"
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
