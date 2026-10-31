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
    <div className="pt-5 pb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E8E] dark:text-[#737373]">
          Story Highlights · Tap to Explore
        </span>
      </div>
      <div className="flex items-center gap-6 sm:gap-10 min-w-max px-2">
        {highlights.map((h) => {
          const Icon = h.icon;
          return (
            <button
              key={h.id}
              onClick={() => onOpenStoryModal(h.id)}
              className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
              title={`Open ${h.label} Story`}
            >
              {/* Highlight Circle with interactive colored ring */}
              <div
                className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-full p-[2.5px] transition-all shadow-xs group-hover:scale-105 group-hover:shadow-md flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${h.color}55, ${h.color})`,
                }}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-white dark:bg-black flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#FAFAFA] dark:bg-[#1A1A1A] group-hover:bg-[#F2F2F2] dark:group-hover:bg-[#262626] flex items-center justify-center transition-colors">
                    <Icon
                      className="w-6 h-6 transition-transform group-hover:scale-110"
                      style={{ color: h.color }}
                    />
                  </div>
                </div>
              </div>

              {/* Label */}
              <span className="text-xs font-semibold text-[#262626] dark:text-[#F5F5F5] group-hover:text-[#0095F6] dark:group-hover:text-[#0095F6] transition-colors">
                {h.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
