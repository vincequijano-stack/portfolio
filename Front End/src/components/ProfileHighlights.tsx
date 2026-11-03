import React from 'react';
import { User, Code2, Award, Trophy, Building2 } from 'lucide-react';

interface ProfileHighlightsProps {
  onNavigate: (sectionId: string) => void;
  onOpenStoryModal: (storyId: string) => void;
}

export const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({
  onOpenStoryModal,
}) => {
  const highlights = [
    {
      id: 'about',
      label: 'About',
      icon: User,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: Code2,
    },
    {
      id: 'organization',
      label: 'Organization',
      icon: Building2,
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
    },
  ];

  return (
    <div className="pt-6 pb-8 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between mb-3.5 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#6B7F5E]">
          Story Highlights · Tap to Explore
        </span>
      </div>
      <div className="flex items-center gap-6 sm:gap-12 min-w-max px-2 sm:px-4">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <button
              key={h.id}
              onClick={() => onOpenStoryModal(h.id)}
              className="group flex flex-col items-center gap-2.5 cursor-pointer focus:outline-none"
              title={`Open ${h.label} Story`}
            >
              {/* Highlight Circle with Deep Olive & Sage Green Ring */}
              <div className="w-[76px] h-[76px] sm:w-[90px] sm:h-[90px] rounded-full p-[3px] bg-gradient-to-tr from-[#283618] via-[#527043] to-[#8FA882] transition-all shadow-sm group-hover:scale-105 group-hover:shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full p-[2.5px] bg-[#FAFBF8] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#F1F5EE] group-hover:bg-[#E3ECD8] flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#283618] group-hover:text-[#3A4D28] transition-all group-hover:scale-110" />
                  </div>
                </div>
              </div>

              {/* Label */}
              <span className="text-xs sm:text-[13.5px] font-semibold text-[#283618] group-hover:text-[#527043] transition-colors">
                {h.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
