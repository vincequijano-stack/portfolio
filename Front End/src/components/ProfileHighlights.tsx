import React from 'react';
import { User, Grid, Award } from 'lucide-react';
import { eventStories } from '../data/events';

interface ProfileHighlightsProps {
  onNavigate: (sectionId: string) => void;
  onOpenStoryModal: (storyId: string) => void;
}

export const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({
  onNavigate,
  onOpenStoryModal,
}) => {
  // Dynamically create a highlight circle for each discovered event story
  const dynamicEventHighlights = eventStories.map((story) => ({
    id: story.id,
    label:
      story.title.length > 14
        ? story.title.replace('Cryptita Plays: ', '').replace('Roadshow', '').trim()
        : story.title,
    image: story.image,
    isStory: true,
    storyId: story.id,
  }));

  const highlights = [
    {
      id: 'all-events',
      label: 'All Events',
      image: eventStories[0]?.image || '/assets/images/event/Cryptita-Workshop.jpg',
      isStory: true,
      storyId: eventStories[0]?.id,
    },
    ...dynamicEventHighlights,
    {
      id: 'projects',
      label: 'Projects',
      icon: Grid,
      color: '#8B5CF6',
      targetSection: 'projects',
    },
    {
      id: 'certificates',
      label: 'Certificates',
      icon: Award,
      color: '#F59E0B',
      targetSection: 'certificates',
    },
    {
      id: 'about',
      label: 'About',
      icon: User,
      color: '#3B82F6',
      targetSection: 'profile-top',
    },
  ];

  const handleClick = (h: (typeof highlights)[0]) => {
    if (h.isStory && h.storyId) {
      onOpenStoryModal(h.storyId);
    } else if (h.targetSection) {
      onNavigate(h.targetSection);
    }
  };

  return (
    <div className="pt-6 pb-6 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 sm:gap-10 min-w-max px-2">
        {highlights.map((h) => {
          const Icon = 'icon' in h ? h.icon : undefined;
          const color = 'color' in h ? h.color : undefined;

          return (
            <button
              key={h.id}
              onClick={() => handleClick(h)}
              className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
              title={h.isStory ? `View ${h.label} Story` : `Go to ${h.label}`}
            >
              {/* Highlight Circle with subtle ring matching Instagram highlight aesthetic */}
              <div className="w-[72px] h-[72px] sm:w-[78px] sm:h-[78px] rounded-full p-[3px] border border-[#DBDBDB] dark:border-[#363636] group-hover:border-[#262626] dark:group-hover:border-white transition-all bg-white dark:bg-black flex items-center justify-center shadow-2xs group-hover:scale-105">
                <div className="w-full h-full rounded-full bg-[#FAFAFA] dark:bg-[#1A1A1A] overflow-hidden flex items-center justify-center transition-colors">
                  {h.image ? (
                    <img
                      src={h.image}
                      alt={h.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : Icon ? (
                    <Icon
                      className="w-6 h-6 transition-transform group-hover:scale-110"
                      style={{ color }}
                    />
                  ) : null}
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
