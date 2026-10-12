import React from 'react';
import { Home, Moon, Sun, ExternalLink } from 'lucide-react';
import { InstagramIcon, MessengerIcon, GithubIcon, LinkedinIcon } from './SocialIcons';
import { profileData } from '../data/profile';
import { useTheme } from '../context/ThemeContext';

interface TopBarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeSection,
  onNavigate,
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
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#DBDBDB] dark:border-[#262626] px-4 md:px-8 py-3 transition-colors duration-200">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Instagram Logo & Brand */}
        <a
          href="#profile-top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('profile-top');
          }}
          className="flex items-center gap-2.5 text-black dark:text-white hover:opacity-80 transition-opacity"
          aria-label="Instagram Home"
        >
          <InstagramIcon className="w-6 h-6 stroke-[2]" />
          <span
            className="text-xl font-bold tracking-tight font-sans"
            style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
          >
            Instagram
          </span>
        </a>

        {/* Right: Navigation Items (Home, Message me, Mini profile) + Appearance Switcher & Socials */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('profile-top')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              activeSection === 'profile-top'
                ? 'font-bold text-black dark:text-white bg-[#F2F2F2] dark:bg-[#1A1A1A]'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#121212]'
            }`}
            title="Home"
          >
            <Home
              className={`w-5 h-5 ${
                activeSection === 'profile-top' ? 'stroke-[2.5] fill-current' : 'stroke-[1.75]'
              }`}
            />
            <span className="hidden sm:inline text-[14px]">Home</span>
          </button>

          {/* 2. Message me (Gmail) */}
          <a
            href={gmailComposeUrl}
            onClick={handleMessageMe}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#121212] transition-colors relative group"
            title="Email Vince via Gmail"
          >
            <div className="relative">
              <MessengerIcon className="w-5 h-5 stroke-[1.75]" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#ED4956] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                2
              </span>
            </div>
            <span className="hidden sm:inline text-[14px] font-medium">Message me</span>
            <ExternalLink className="hidden sm:inline w-3 h-3 text-[#8E8E8E] dark:text-[#737373] opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>

          {/* 3. Mini Profile with Vince's photo */}
          <button
            onClick={() => onNavigate('about')}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-sm transition-colors ${
              activeSection === 'about'
                ? 'font-bold text-black dark:text-white bg-[#F2F2F2] dark:bg-[#1A1A1A]'
                : 'text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#121212]'
            }`}
            title="Profile"
          >
            <div
              className={`w-6 h-6 rounded-full p-[1.5px] transition-transform hover:scale-105 ${
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
            <span className="hidden sm:inline text-[14px] font-medium">Profile</span>
          </button>

          {/* Subtle Divider */}
          <div className="h-5 w-[1px] bg-[#DBDBDB] dark:bg-[#262626] mx-1 sm:mx-2" />

          {/* 4. Switch appearance (Dark / Light mode) */}
          <button
            onClick={toggleTheme}
            className="p-2 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 stroke-[1.75]" />
            ) : (
              <Sun className="w-5 h-5 text-amber-400 stroke-[1.75]" />
            )}
          </button>

          {/* 5. GitHub & LinkedIn */}
          <a
            href={profileData.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
            title="GitHub Profile"
            aria-label="GitHub Profile"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href={profileData.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#262626] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] rounded-lg transition-colors"
            title="LinkedIn Profile"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
};
