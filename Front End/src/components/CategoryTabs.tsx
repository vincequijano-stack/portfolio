import React from 'react';
import { Grid, Globe, Palette } from 'lucide-react';
import { categoryList, CategoryType } from '../data/projects';

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  projectCounts: Record<string, number>;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const getCategoryIcon = (cat: CategoryType) => {
    switch (cat) {
      case 'All Projects':
        return Grid;
      case 'Web Development':
        return Globe;
      case 'UI/UX Design':
        return Palette;
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
      default:
        return cat.toUpperCase();
    }
  };

  return (
    <div className="w-full border-t border-[#D4E0CD] flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar px-2 sm:px-0">
      <div className="flex items-center min-w-max gap-6 sm:gap-16 h-[48px] sm:h-[56px]">
        {categoryList.map((category) => {
          const Icon = getCategoryIcon(category);
          const isActive = activeCategory === category;
          const label = getShortLabel(category);

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`h-full flex items-center gap-2 text-xs sm:text-[13px] font-semibold tracking-widest uppercase transition-all relative cursor-pointer ${
                isActive
                  ? 'text-[#283618] border-t-2 border-[#283618] -mt-[1px] font-bold'
                  : 'text-[#6B7F5E] hover:text-[#283618]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5] text-[#283618]' : 'stroke-[1.75]'}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
