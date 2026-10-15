import React, { useEffect, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { LikeNotification } from '../services/notificationService';

interface LikeNotificationToastProps {
  onOpenActivity?: () => void;
}

export const LikeNotificationToast: React.FC<LikeNotificationToastProps> = ({ onOpenActivity }) => {
  const [toast, setToast] = useState<LikeNotification | null>(null);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<LikeNotification>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
      }
    };

    window.addEventListener('portfolio_new_like_toast', handleToast);
    return () => window.removeEventListener('portfolio_new_like_toast', handleToast);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div
        onClick={() => {
          if (onOpenActivity) onOpenActivity();
          setToast(null);
        }}
        className="cursor-pointer flex items-center gap-3 bg-white dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#333333] shadow-2xl rounded-2xl px-4 py-3 max-w-sm hover:scale-[1.02] transition-transform select-none"
      >
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#ED4956] flex items-center justify-center shadow-md animate-bounce">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-semibold text-[#262626] dark:text-white leading-tight">
            New Project Like!
          </p>
          <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] truncate mt-0.5">
            <span className="font-bold text-[#262626] dark:text-[#E0E0E0]">{toast.userName}</span> liked{' '}
            <span className="font-medium text-[#262626] dark:text-white">{toast.projectTitle}</span>
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setToast(null);
          }}
          className="text-[#8E8E8E] hover:text-black dark:hover:text-white p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Dismiss toast"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
