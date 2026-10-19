import React, { useState } from 'react';
import {
  CheckCircle2,
  Share2,
  FileDown,
  Mail,
  ExternalLink,
  Check,
  Star,
  Pencil,
  X
} from 'lucide-react';
import { RateModal, ClientReview } from './RateModal';
import { profileData } from '../data/profile';
import { eventStories } from '../data/events';

interface ProfileHeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenStoryModal: (storyId: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onNavigate,
  onOpenStoryModal,
}) => {
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [reviews, setReviews] = useState<ClientReview[]>(() => {
    try {
      const saved = localStorage.getItem('vince_client_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Real-time editable Note (persists in localStorage)
  const [note, setNote] = useState<string>(() => {
    try {
      return localStorage.getItem('vince_profile_note') || 'Available for work 🚀';
    } catch {
      return 'Available for work 🚀';
    }
  });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);

  const handleSaveNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = noteDraft.trim() || 'Available for work 🚀';
    setNote(trimmed);
    setIsEditingNote(false);
    try {
      localStorage.setItem('vince_profile_note', trimmed);
    } catch {}
  };

  const handleAddReview = (newRev: Omit<ClientReview, 'id' | 'date'>) => {
    const review: ClientReview = {
      ...newRev,
      id: Date.now().toString(),
      date: 'Just now',
    };
    const updated = [review, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('vince_client_reviews', JSON.stringify(updated));
    } catch {}
  };

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = '/assets/images/certificates/Software-Engineering-Python.pdf';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <section id="profile-top" className="pt-2 pb-2">
      {/* Upper Profile Container: Responsive Mobile vs Desktop Layout */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-14">
        {/* Mobile Header Row (Avatar on Left, Stats on Right on mobile; on desktop Avatar sits in left column) */}
        <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-0 flex-shrink-0 w-full sm:w-auto">
          {/* Left: Avatar with Real-Time Editable Note Bubble and MyDay Gradient Ring */}
          <div className="flex flex-col items-center flex-shrink-0 relative">
            {/* 1. Floating Real-Time Note Bubble */}
            <div className="relative mb-2 sm:mb-2.5 z-20">
              {isEditingNote ? (
                <form
                  onSubmit={handleSaveNote}
                  className="bg-white dark:bg-[#262626] border border-[#0095F6] rounded-2xl shadow-md px-2 py-0.5 sm:px-2.5 sm:py-1 flex items-center gap-1.5 text-xs animate-scale-in"
                >
                  <input
                    type="text"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    maxLength={35}
                    autoFocus
                    placeholder="Share a thought..."
                    className="bg-transparent border-none outline-none text-[#262626] dark:text-white text-[11px] sm:text-xs w-28 sm:w-36 px-1"
                  />
                  <button
                    type="submit"
                    className="bg-[#0095F6] text-white rounded-full p-1 hover:bg-[#1877F2] transition-colors cursor-pointer"
                    title="Save Note"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft(note);
                      setIsEditingNote(false);
                    }}
                    className="text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white p-0.5 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </form>
              ) : (
                <div
                  onClick={() => {
                    setNoteDraft(note);
                    setIsEditingNote(true);
                  }}
                  className="group/note bg-white dark:bg-[#262626] border border-[#DBDBDB] dark:border-[#363636] text-[#262626] dark:text-white text-[10px] sm:text-[11px] font-medium px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer hover:border-[#0095F6] hover:scale-105 transition-all"
                  title="Click anytime to update your real-time note"
                >
                  <span className="max-w-[100px] sm:max-w-[130px] truncate">{note}</span>
                  <Pencil className="w-2.5 h-2.5 text-[#8E8E8E] dark:text-[#A8A8A8] opacity-60 group-hover/note:opacity-100 group-hover/note:text-[#0095F6] transition-opacity" />
                </div>
              )}
              {/* Small speech bubble pointer */}
              <div className="w-2 h-2 bg-white dark:bg-[#262626] border-r border-b border-[#DBDBDB] dark:border-[#363636] transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </div>

            {/* 2. Circular Avatar with Instagram "MyDay" Story Colorful Gradient Ring */}
            <div
              className="relative cursor-pointer group"
              onClick={() => onOpenStoryModal('myday')}
              title="View Vince's MyDay / Story"
            >
              {/* Instagram MyDay Gradient Ring */}
              <div className="w-22 h-22 sm:w-36 sm:h-36 rounded-full p-[3px] sm:p-[3.5px] bg-gradient-to-tr from-[#FCAF45] via-[#FD1D1D] to-[#833AB4] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full p-[2px] sm:p-[2.5px] bg-white dark:bg-black">
                  <img
                    src="/assets/images/headshot/headshot.jpg"
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                    style={{ objectPosition: '0% 20%' }}
                  />
                </div>
              </div>

              {/* Live CS Tag */}
              <span className="absolute bottom-0 right-1 sm:bottom-1 sm:right-2 bg-[#0095F6] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full border-2 border-white dark:border-black shadow-xs">
                CS
              </span>
            </div>
          </div>

          {/* On Mobile Screens: 4 Stats columns beside avatar (Instagram Mobile App layout) */}
          <div className="flex sm:hidden flex-1 justify-around items-center text-center pl-2">
            <button onClick={() => onNavigate('projects')} className="flex flex-col items-center">
              <span className="font-bold text-sm text-black dark:text-white">{profileData.stats.projects}</span>
              <span className="text-[11px] text-[#737373] dark:text-[#A8A8A8]">projects</span>
            </button>
            <button onClick={() => onNavigate('skills')} className="flex flex-col items-center">
              <span className="font-bold text-sm text-black dark:text-white">{profileData.stats.skills}</span>
              <span className="text-[11px] text-[#737373] dark:text-[#A8A8A8]">skills</span>
            </button>
            <button onClick={() => onNavigate('certificates')} className="flex flex-col items-center">
              <span className="font-bold text-sm text-black dark:text-white">{profileData.stats.certificates}</span>
              <span className="text-[11px] text-[#737373] dark:text-[#A8A8A8]">certs</span>
            </button>
            <button onClick={() => setIsRateModalOpen(true)} className="flex flex-col items-center">
              <span className="font-bold text-sm text-black dark:text-white flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#F59E0B] text-[#F59E0B]" />
                {averageRating}
              </span>
              <span className="text-[11px] text-[#737373] dark:text-[#A8A8A8]">({totalReviews})</span>
            </button>
          </div>
        </div>

        {/* Right: Username, Stats (desktop), Display Name, Bio */}
        <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 text-left w-full sm:w-auto mt-1 sm:mt-0">
          {/* Row 1: Username + Verified */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-semibold sm:font-normal text-[#262626] dark:text-white flex items-center gap-1.5 tracking-tight">
              <span>{profileData.username}</span>
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#0095F6] fill-[#0095F6] text-white inline-block" />
            </h1>
          </div>

          {/* Row 2: Subtitle / Title Badge */}
          <p className="text-xs text-[#737373] dark:text-[#A8A8A8] font-medium -mt-1 sm:-mt-1">
            {profileData.badge}
          </p>

          {/* Row 3: Desktop Statistics (Projects, Skills, Certificates, Client Rating) */}
          <div className="hidden sm:flex items-center gap-6 sm:gap-8 text-sm text-[#262626] dark:text-[#F5F5F5] py-0.5">
            <button
              onClick={() => onNavigate('projects')}
              className="text-left hover:opacity-75 transition-opacity cursor-pointer"
            >
              <span className="font-semibold text-black dark:text-white">{profileData.stats.projects}</span>{' '}
              <span className="text-[#262626] dark:text-[#D1D5DB]">projects</span>
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="text-left hover:opacity-75 transition-opacity cursor-pointer"
            >
              <span className="font-semibold text-black dark:text-white">{profileData.stats.skills}</span>{' '}
              <span className="text-[#262626] dark:text-[#D1D5DB]">skills</span>
            </button>
            <button
              onClick={() => onNavigate('certificates')}
              className="text-left hover:opacity-75 transition-opacity cursor-pointer"
            >
              <span className="font-semibold text-black dark:text-white">{profileData.stats.certificates}</span>{' '}
              <span className="text-[#262626] dark:text-[#D1D5DB]">certificates</span>
            </button>

            {/* Client Feedback Rating */}
            <button
              onClick={() => setIsRateModalOpen(true)}
              className="text-left hover:opacity-75 transition-opacity flex items-center gap-1 cursor-pointer"
              title="Client Feedback"
            >
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span className="font-semibold text-black dark:text-white">{averageRating}</span>
              <span className="text-[#737373] dark:text-[#8E8E8E] text-xs">({totalReviews})</span>
            </button>
          </div>

          {/* Row 4: Real Authentic Bio */}
          <div className="text-[13px] sm:text-[13.5px] leading-relaxed text-[#262626] dark:text-[#F5F5F5]">
            <p className="font-semibold text-black dark:text-white">{profileData.name}</p>
            <p className="whitespace-pre-line mt-0.5 text-[#4A4A4A] dark:text-[#D1D5DB]">
              {profileData.bio}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#00376B] dark:text-[#0095F6] hover:underline">
              <ExternalLink className="w-3 h-3" />
              <a href={profileData.github} target="_blank" rel="noopener noreferrer">
                github.com/{profileData.username}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row Below: Full-Width Gray Action Buttons (Responsive on Mobile and Desktop) */}
      <div className="flex items-center gap-2 mt-4 sm:mt-5">
        <button
          onClick={() => onNavigate('contact')}
          className="flex-1 py-1.5 px-3 sm:px-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] hover:bg-[#DBDBDB] dark:hover:bg-[#333333] text-xs sm:text-sm font-semibold text-[#262626] dark:text-white transition-colors text-center cursor-pointer"
        >
          Connect / Inquire
        </button>

        <button
          onClick={handleDownloadCV}
          className="flex-1 py-1.5 px-3 sm:px-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] hover:bg-[#DBDBDB] dark:hover:bg-[#333333] text-xs sm:text-sm font-semibold text-[#262626] dark:text-white transition-colors text-center cursor-pointer"
          title="Download CV"
        >
          View Resume
        </button>

        <button
          onClick={() => setIsRateModalOpen(true)}
          className="py-1.5 px-3 sm:px-4 rounded-lg bg-[#EFEFEF] dark:bg-[#262626] hover:bg-[#DBDBDB] dark:hover:bg-[#333333] text-xs sm:text-sm font-semibold text-[#0095F6] dark:text-[#0095F6] transition-colors text-center flex items-center justify-center gap-1 cursor-pointer"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Rate ({totalReviews})</span>
        </button>
      </div>

      {/* Transparent Client Rating Modal */}
      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        reviews={reviews}
        onSubmitReview={handleAddReview}
      />
    </section>
  );
};
