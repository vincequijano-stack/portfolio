import React from 'react';
import { Heart, X, CheckCheck, Trash2, ExternalLink } from 'lucide-react';
import { LikeNotification, notificationService } from '../services/notificationService';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: LikeNotification[];
  onSelectProject?: (projectId: string) => void;
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectProject,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleItemClick = (projectId: string) => {
    notificationService.markAllAsRead();
    if (onSelectProject) {
      onSelectProject(projectId);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center md:justify-start md:left-20 lg:left-64 top-0 md:top-12 p-3 sm:p-4 bg-black/50 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm sm:max-w-md bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] mt-12 md:mt-0 transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#EFEFEF] dark:border-[#262626] bg-white/90 dark:bg-[#121212]/90 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center">
              <Heart className="w-4 h-4 text-[#ED4956] fill-[#ED4956]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#262626] dark:text-white leading-tight">
                Notifications
              </h2>
              <p className="text-[11px] text-[#8E8E8E] dark:text-[#737373]">
                {unreadCount > 0 ? `${unreadCount} new interactions` : 'Real-time project activity'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={() => notificationService.markAllAsRead()}
                className="p-1.5 rounded-lg text-xs text-[#0095F6] hover:bg-[#F0F9FF] dark:hover:bg-[#1A2633] transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => notificationService.clearAll()}
                className="p-1.5 rounded-lg text-xs text-[#8E8E8E] hover:text-[#ED4956] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-black dark:hover:text-white hover:bg-[#F2F2F2] dark:hover:bg-[#262626] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#EFEFEF]/50 dark:divide-[#262626]/50">
          {notifications.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full border-2 border-[#DBDBDB] dark:border-[#333333] flex items-center justify-center text-[#8E8E8E]">
                <Heart className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-semibold text-sm text-[#262626] dark:text-white mb-1">
                No activity yet
              </h3>
              <p className="text-xs text-[#8E8E8E] dark:text-[#737373] max-w-xs mx-auto">
                When visitors browse your portfolio and like your projects, real-time notifications will show up here.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif.projectId)}
                className={`p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#1A1A1A] transition-colors group ${
                  !notif.read ? 'bg-red-50/40 dark:bg-red-950/20' : ''
                }`}
              >
                {/* User Avatar with Like Badge */}
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] p-[1.5px] flex items-center justify-center">
                    <div className="w-full h-full rounded-full bg-white dark:bg-[#121212] flex items-center justify-center font-bold text-xs text-[#262626] dark:text-white uppercase">
                      {notif.userName.slice(0, 2)}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#ED4956] border-2 border-white dark:border-[#121212] flex items-center justify-center">
                    <Heart className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                </div>

                {/* Notification Text */}
                <div className="flex-1 min-w-0 pr-1">
                  <p className="text-xs text-[#262626] dark:text-[#E0E0E0] leading-snug">
                    <span className="font-bold text-[#262626] dark:text-white mr-1">
                      {notif.userName}
                    </span>
                    liked your project{' '}
                    <span className="font-medium text-black dark:text-white underline decoration-[#DBDBDB] dark:decoration-[#404040]">
                      {notif.projectTitle}
                    </span>
                  </p>
                  <p className="text-[10px] text-[#8E8E8E] dark:text-[#737373] mt-1 font-medium">
                    {timeAgo(notif.timestamp)}
                  </p>
                </div>

                {/* Project Thumbnail */}
                <div className="shrink-0 relative w-11 h-11 rounded-lg overflow-hidden border border-[#DBDBDB] dark:border-[#333333] bg-[#EFEFEF] dark:bg-[#262626]">
                  <img
                    src={notif.projectThumbnail}
                    alt={notif.projectTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/projects/project-portfolio.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-2.5 text-center border-t border-[#EFEFEF] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#171717] text-[11px] text-[#8E8E8E] dark:text-[#737373]">
          Real-time activity sync active across visitors
        </div>
      </div>
    </div>
  );
};
