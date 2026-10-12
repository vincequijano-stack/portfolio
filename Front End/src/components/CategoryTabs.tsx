import React from 'react';
import {
  Grid,
  Globe,
  Palette,
  Terminal,
  Database,
  GraduationCap
} from 'lucide-react';
import { categoryList, CategoryType } from '../data/projects';

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  projectCounts: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  projectCounts,
}) => {
  const getCategoryIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'All Projects':
        return Grid;
      case 'Web Development':
        return Globe;
      case 'UI/UX Design':
        return Palette;
      case 'Programming':
        return Terminal;
      case 'Database Systems':
        return Database;
      case 'Academic Projects':
        return GraduationCap;
      default:
        return Grid;
    }
  };

  const getShortLabel = (cat: CategoryType) => {
    switch (cat) {
      case 'All Projects':
        return 'POSTS';
      case 'Web Development':
        return 'WEB DEV';
      case 'UI/UX Design':
        return 'UI/UX';
      case 'Programming':
        return 'CODE';
      case 'Database Systems':
        return 'DATABASE';
      case 'Academic Projects':
        return 'ACADEMIC';
      default:
        return cat.toUpperCase();
    }
  };

  return (
    <div className="w-full border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-2 sm:px-0">
      <div className="flex items-center min-w-max gap-6 sm:gap-14 h-[44px] sm:h-[52px]">
        {categoryList.map((category) => {
          const Icon = getCategoryIcon(category);
          const isActive = activeCategory === category;
          const label = getShortLabel(category);

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`h-full flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-all relative ${
                isActive
                  ? 'text-black dark:text-white border-t border-black dark:border-white -mt-[1px] font-bold'
                  : 'text-[#8E8E8E] dark:text-[#737373] hover:text-[#262626] dark:hover:text-white'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
