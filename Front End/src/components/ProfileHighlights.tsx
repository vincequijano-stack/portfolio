import React from 'react';
import { User, Code2, Grid, Award, Trophy, Building2 } from 'lucide-react';

interface ProfileHighlightsProps {
  onNavigate: (sectionId: string) => void;
  onOpenStoryModal: (storyId: string) => void;
}

export const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({
  onNavigate,
  onOpenStoryModal,
}) => {
  const highlights = [
    {
      id: 'about',
      label: 'About',
      icon: User,
      color: '#3B82F6',
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Code2,
      color: '#10B981',
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Grid,
      color: '#8B5CF6',
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
      color: '#0284C7',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
      color: '#F59E0B',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      color: '#EC4899',
    },
  ];

  return (
    <div className="pt-6 pb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 sm:gap-10 min-w-max px-2">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <button
              key={h.id}
              onClick={() => onOpenStoryModal(h.id)}
              className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
            >
              {/* Highlight Circle with subtle ring matching reference image */}
              <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-full p-[3px] border border-[#DBDBDB] dark:border-[#363636] group-hover:border-[#262626] dark:group-hover:border-white transition-all bg-white dark:bg-black flex items-center justify-center shadow-2xs group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-[#FAFAFA] dark:bg-[#1A1A1A] group-hover:bg-[#F2F2F2] dark:group-hover:bg-[#262626] flex items-center justify-center transition-colors">
                  <Icon
                    className="w-6 h-6 transition-transform group-hover:scale-110"
                    style={{ color: h.color }}
                  />
                </div>
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-[#262626] dark:text-[#F5F5F5] group-hover:text-black dark:group-hover:text-white">
                {h.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
