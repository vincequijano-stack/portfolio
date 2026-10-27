import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Search,
  User,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { likeService, LikerUser } from '../services/likeService';

interface LikersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  likesCount?: number;
}

export const LikersModal: React.FC<LikersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  likesCount,
}) => {
  const [search, setSearch] = useState('');
  const [likers, setLikers] = useState<LikerUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadLikers = React.useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError('');
    try {
      const data = await likeService.fetchLikers(projectId);
      setLikers(data);
    } catch (err: any) {
      setError(err?.message || 'Could not load liker list.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      loadLikers();
    }
  }, [isOpen, loadLikers]);

  if (!isOpen) return null;

  const filtered = likers.filter((u) =>
    (u.userName || '').toLowerCase().includes(search.toLowerCase().trim())
  );

  const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return 'Recently';
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (1000 * 60));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const currentCount = !loading ? likers.length : (typeof likesCount === 'number' ? likesCount : likers.length);

  return (
    <div
      className="fixed inset-0 z-70 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#DBDBDB] dark:border-[#262626] flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#EFEFEF] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#141414]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FFEAEB] dark:bg-[#ED4956]/20 flex items-center justify-center text-[#ED4956]">
              <Heart className="w-3.5 h-3.5 fill-[#ED4956]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#262626] dark:text-white">
                Post Likes
              </h3>
              <p className="text-[10px] text-[#8E8E8E] dark:text-[#737373] truncate max-w-[200px]">
                {projectTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <>
          {/* Search Bar if multiple likers */}
          {likers.length > 4 && (
            <div className="p-2.5 border-b border-[#EFEFEF] dark:border-[#262626]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#8E8E8E]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search likers..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] text-[#262626] dark:text-white placeholder-[#8E8E8E] focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Likers List */}
          <div className="overflow-y-auto p-2 sm:p-3 divide-y divide-[#EFEFEF]/50 dark:divide-[#262626]/50 space-y-1 flex-1">
            {loading ? (
              <div className="py-12 text-center flex flex-col items-center gap-2 text-xs text-[#8E8E8E]">
                <Loader2 className="w-5 h-5 animate-spin text-[#0095F6]" />
                <span>Loading likers...</span>
              </div>
            ) : error ? (
              <div className="py-8 text-center text-xs text-[#ED4956] px-4">
                <AlertCircle className="w-6 h-6 mx-auto mb-1.5" />
                <p>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#8E8E8E] dark:text-[#737373]">
                <div className="w-12 h-12 rounded-full bg-[#EFEFEF] dark:bg-[#262626] mx-auto flex items-center justify-center mb-2.5">
                  <Heart className="w-5 h-5 text-[#8E8E8E]" />
                </div>
                <p className="font-semibold text-[#262626] dark:text-white">
                  {likers.length === 0 ? 'No likes yet' : 'No matching likers'}
                </p>
                <p className="mt-1 text-[11px]">
                  {likers.length === 0
                    ? 'Be the first person to like this project!'
                    : 'Try searching for another name.'}
                </p>
              </div>
            ) : (
              filtered.map((user, idx) => (
                <div
                  key={`${user.userName}-${idx}`}
                  className="flex items-center justify-between py-2 px-2 hover:bg-[#FAFAFA] dark:hover:bg-[#222222] rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4] flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-white dark:bg-[#1A1A1A] flex items-center justify-center font-bold text-xs text-[#262626] dark:text-white uppercase">
                        {user.userName ? user.userName.charAt(0) : <User className="w-3.5 h-3.5" />}
                      </div>
                    </div>

                    <div className="min-w-0 text-left">
                      <p className="text-xs font-bold text-[#262626] dark:text-white truncate">
                        {user.userName}
                      </p>
                      <p className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">
                        Liked {formatRelativeTime(user.timestamp)}
                      </p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-[#ED4956] pr-1">
                    <Heart className="w-4 h-4 fill-[#ED4956]" />
                  </div>
                </div>
              ))
            )}
          </div>
        </>

        {/* Footer */}
        <div className="p-2.5 border-t border-[#EFEFEF] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#141414] flex items-center justify-between text-[11px] font-semibold text-[#8E8E8E] dark:text-[#737373]">
          <span>
            {currentCount} {currentCount === 1 ? 'like' : 'likes'} total
          </span>
        </div>
      </div>
    </div>
  );
};
