import React, { useState } from 'react';
import {
  Share2,
  FileDown,
  Mail,
  ExternalLink,
  Check,
  Star,
  Pencil,
  X,
  Play
} from 'lucide-react';
import { RateModal } from './RateModal';
import { ratingService, ClientReview } from '../services/ratingService';
import { isOwnerUnlocked } from '../services/visitorSession';
import { apiFetch } from '../config/api';
import { profileData } from '../data/profile';
import { eventStories } from '../data/events';

const resumeModules = import.meta.glob<string>(
  '../../../Photo/**/*.{pdf,PDF}',
  { eager: true, import: 'default' }
);
const discoveredResumeUrl = '/assets/resume/Resume.pdf' || Object.values(resumeModules)[0];

interface ProfileHeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenStoryModal: (storyId: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onNavigate,
  onOpenStoryModal,
}) => {
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateModalInitialTab, setRateModalInitialTab] = useState<'rate' | 'all'>('rate');
  const [ratingsState, setRatingsState] = useState(() => ratingService.getState());

  React.useEffect(() => {
    const unsubscribe = ratingService.subscribe((state) => {
      setRatingsState(state);
    });
    return () => unsubscribe();
  }, []);

  const averageRating = ratingsState.average;
  const totalReviews = ratingsState.count;

  const DEFAULT_NOTE = 'LF OJT';
  const NOTE_CLOUD_TOPIC = 'vince_quijano_portfolio_note_live';
  const isOwner = isOwnerUnlocked();

  // Real-time editable Note (synced globally so all visitors see the owner's note)
  const [note, setNote] = useState<string>(() => {
    try {
      return (
        localStorage.getItem('vince_profile_note') ||
        localStorage.getItem('vince_public_note_cache') ||
        DEFAULT_NOTE
      );
    } catch {
      return DEFAULT_NOTE;
    }
  });
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState(note);

  // Fetch latest owner note from database & cloud stream so all visitors always see the latest note
  React.useEffect(() => {
    let eventSource: EventSource | null = null;
    let channel: BroadcastChannel | null = null;
    let latestTime = 0;

    const applyIncomingNote = (incomingNote: string, ts = 0) => {
      const cleaned = (incomingNote || '').trim();
      if (!cleaned) return;
      if (ts > 0 && ts < latestTime) return;
      if (ts > latestTime) latestTime = ts;
      setNote(cleaned);
      try {
        localStorage.setItem('vince_public_note_cache', cleaned);
      } catch {}
    };

    const syncNote = () => {
      // 1. Fetch from persistent backend/database (/api/note)
      apiFetch<{ note?: string; timestamp?: number }>('/api/note')
        .then((data) => {
          if (data && data.note) {
            applyIncomingNote(data.note, Number(data.timestamp) || 0);
          }
        })
        .catch(() => {});

      // 2. Fetch latest published note from cloud history (ntfy.sh)
      fetch(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}/json?poll=1&since=all`)
        .then((res) => (res.ok ? res.text() : ''))
        .then((text) => {
          if (!text) return;
          const lines = text.trim().split('\n');
          lines.forEach((line) => {
            try {
              const item = JSON.parse(line);
              if (item.event === 'message' && item.message) {
                const parsed = JSON.parse(item.message);
                if (parsed && typeof parsed.note === 'string' && parsed.note.trim()) {
                  const ts = Number(parsed.timestamp) || Number(item.time) * 1000 || 0;
                  applyIncomingNote(parsed.note, ts);
                }
              }
            } catch {}
          });
        })
        .catch(() => {});
    };

    syncNote();

    // 3. Cross-tab BroadcastChannel sync
    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('portfolio_note_channel');
        channel.onmessage = (e) => {
          if (e.data && typeof e.data.note === 'string') {
            applyIncomingNote(e.data.note, Number(e.data.timestamp) || Date.now());
          }
        };
      }
    } catch {}

    // 4. Real-time SSE stream so visitors across devices see note updates live
    try {
      eventSource = new EventSource(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}/sse`);
      eventSource.onmessage = (event) => {
        try {
          const item = JSON.parse(event.data);
          if (item && item.event === 'message' && item.message) {
            const parsed = JSON.parse(item.message);
            if (parsed && typeof parsed.note === 'string' && parsed.note.trim()) {
              applyIncomingNote(parsed.note, Number(parsed.timestamp) || Date.now());
            }
          }
        } catch {}
      };
    } catch {}

    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible') syncNote();
    }, 30_000);
    window.addEventListener('focus', syncNote);

    return () => {
      if (eventSource) eventSource.close();
      if (channel) channel.close();
      window.clearInterval(interval);
      window.removeEventListener('focus', syncNote);
    };
  }, []);

  const handleSaveNote = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = noteDraft.trim() || DEFAULT_NOTE;
    const now = Date.now();
    setNote(trimmed);
    setIsEditingNote(false);
    try {
      localStorage.setItem('vince_profile_note', trimmed);
      localStorage.setItem('vince_public_note_cache', trimmed);
      localStorage.setItem('portfolio_is_owner', 'true');
    } catch {}

    // 1. Save permanently in backend/database (/api/note)
    apiFetch('/api/note', {
      method: 'POST',
      body: JSON.stringify({ note: trimmed }),
    }).catch(() => {});

    // 2. Broadcast across tabs
    try {
      if ('BroadcastChannel' in window) {
        const ch = new BroadcastChannel('portfolio_note_channel');
        ch.postMessage({ note: trimmed, timestamp: now });
        ch.close();
      }
    } catch {}

    // 3. Publish note globally in real-time so all visitors see it immediately
    try {
      fetch(`https://ntfy.sh/${NOTE_CLOUD_TOPIC}`, {
        method: 'POST',
        body: JSON.stringify({ note: trimmed, timestamp: now }),
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    } catch {}
  };

  const handleDownloadCV = () => {
    const link = document.createElement('a');
    link.href = discoveredResumeUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <section id="profile-top" className="pt-2 pb-4">
      {/* Upper Profile Container: Responsive Mobile vs Desktop Layout */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-12 md:gap-16">
        {/* Mobile Header Row (Avatar on Left, Stats on Right on mobile; on desktop Avatar sits centered in wide left column) */}
        <div className="flex items-center justify-between sm:justify-center gap-4 sm:gap-0 flex-shrink-0 w-full sm:w-[220px] md:w-[270px]">
          {/* Left: Avatar with Real-Time Editable Note Bubble and MyDay Gradient Ring */}
          <div className="flex flex-col items-center flex-shrink-0 relative">
            {/* 1. Floating Real-Time Note Bubble */}
            <div className="relative mb-2.5 sm:mb-3 z-20">
              {isEditingNote ? (
                <form
                  onSubmit={handleSaveNote}
                  className="bg-white border border-[#3A4D28] rounded-2xl shadow-md px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center gap-1.5 text-xs sm:text-sm animate-scale-in"
                >
                  <input
                    type="text"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    maxLength={35}
                    autoFocus
                    placeholder="Share a thought..."
                    className="bg-transparent border-none outline-none text-[#283618] text-xs sm:text-sm w-28 sm:w-40 px-1"
                  />
                  <button
                    type="submit"
                    className="bg-[#283618] text-white rounded-full p-1 hover:bg-[#3A4D28] transition-colors cursor-pointer"
                    title="Save Note"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNoteDraft(note);
                      setIsEditingNote(false);
                    }}
                    className="text-[#526348] hover:text-[#283618] p-0.5 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : isOwner ? (
                <div
                  onClick={() => {
                    setNoteDraft(note);
                    setIsEditingNote(true);
                  }}
                  className="group/note bg-white border border-[#D4E0CD] text-[#283618] text-xs sm:text-[13px] font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 cursor-pointer hover:border-[#3A4D28] hover:scale-105 transition-all"
                  title="Click anytime to update your real-time note"
                >
                  <span className="max-w-[110px] sm:max-w-[150px] truncate">{note}</span>
                  <Pencil className="w-3 h-3 text-[#6B7F5E] opacity-60 group-hover/note:opacity-100 group-hover/note:text-[#283618] transition-opacity" />
                </div>
              ) : (
                <div
                  className="bg-white border border-[#D4E0CD] text-[#283618] text-xs sm:text-[13px] font-semibold px-3 py-1 sm:px-4 sm:py-1.5 rounded-2xl shadow-sm flex items-center gap-1.5 select-none"
                  title={`${profileData.name}'s note`}
                >
                  <span className="max-w-[120px] sm:max-w-[160px] truncate">{note}</span>
                </div>
              )}
              {/* Small speech bubble pointer */}
              <div className="w-2.5 h-2.5 bg-white border-r border-b border-[#D4E0CD] transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
            </div>

            {/* 2. Circular Avatar with Deep Olive & Sage Green MyDay Ring */}
            <div
              className="relative cursor-pointer group"
              onClick={() => onOpenStoryModal('myday')}
              title="View Vince's MyDay / Story"
            >
              {/* Deep Olive & Sage Green Gradient Ring */}
              <div className="w-24 h-24 sm:w-[164px] sm:h-[164px] rounded-full p-[3px] sm:p-[4px] bg-gradient-to-tr from-[#283618] via-[#527043] to-[#8FA882] shadow-lg shadow-[#283618]/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full p-[2.5px] sm:p-[3px] bg-[#FAFBF8]">
                  <img
                    src="/assets/images/headshot/headshot.jpg"
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                    style={{ objectPosition: '0% 20%' }}
                  />
                </div>
              </div>

              {/* Interactive Story Play Badge */}
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#283618] via-[#3A4D28] to-[#527043] text-white text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border-2 border-[#FAFBF8] shadow-md flex items-center gap-1 whitespace-nowrap group-hover:scale-105 transition-transform">
                <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                <span>Click</span>
              </span>
            </div>
          </div>

          {/* On Mobile Screens: 4 Stats columns beside avatar */}
          <div className="flex sm:hidden flex-1 justify-around items-center text-center pl-2">
            <button
              onClick={() => onNavigate('projects')}
              className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[#EBF1E6] active:scale-95 transition-all cursor-pointer"
            >
              <span className="font-bold text-sm text-[#283618]">{profileData.stats.projects}</span>
              <span className="text-[11px] text-[#526348] font-medium">projects</span>
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[#EBF1E6] active:scale-95 transition-all cursor-pointer"
            >
              <span className="font-bold text-sm text-[#283618]">{profileData.stats.skills}</span>
              <span className="text-[11px] text-[#526348] font-medium">skills</span>
            </button>
            <button
              onClick={() => onNavigate('certificates')}
              className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[#EBF1E6] active:scale-95 transition-all cursor-pointer"
            >
              <span className="font-bold text-sm text-[#283618]">{profileData.stats.certificates}</span>
              <span className="text-[11px] text-[#526348] font-medium">certs</span>
            </button>
            <button
              onClick={() => {
                setRateModalInitialTab('all');
                setIsRateModalOpen(true);
              }}
              className="flex flex-col items-center px-2 py-1 rounded-lg hover:bg-[#EBF1E6] active:scale-95 transition-all cursor-pointer"
              title="View Client Reviews"
            >
              <span className="font-bold text-sm text-[#283618] flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#3A4D28] text-[#3A4D28]" />
                {averageRating}
              </span>
              <span className="text-[11px] text-[#526348] font-medium">({totalReviews})</span>
            </button>
          </div>
        </div>

        {/* Right: Display Name, Stats (desktop), Bio */}
        <div className="flex-1 flex flex-col gap-3 sm:gap-3.5 text-left w-full sm:w-auto mt-1 sm:mt-0">
          {/* Row 1: Display Name */}
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-[26px] font-semibold sm:font-bold text-[#283618] flex items-center gap-2 tracking-tight">
              <span>{profileData.name}</span>
            </h1>
          </div>

          {/* Row 2: Subtitle / Title Badge */}
          <p className="text-xs sm:text-sm text-[#526348] font-medium -mt-1">
            {profileData.badge}
          </p>

          {/* Row 3: Desktop Statistics (Clickable Pill Shortcuts) */}
          <div className="hidden sm:flex items-center gap-3.5 text-sm sm:text-[15px] text-[#283618] py-1 flex-wrap">
            <button
              onClick={() => onNavigate('projects')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#D4E0CD] hover:border-[#3A4D28] hover:bg-[#8FA882]/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Jump to Projects"
            >
              <span className="font-bold text-[#283618]">{profileData.stats.projects}</span>
              <span className="text-xs sm:text-sm font-medium text-[#526348]">projects</span>
            </button>
            <button
              onClick={() => onNavigate('skills')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#D4E0CD] hover:border-[#3A4D28] hover:bg-[#8FA882]/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Jump to Skills"
            >
              <span className="font-bold text-[#283618]">{profileData.stats.skills}</span>
              <span className="text-xs sm:text-sm font-medium text-[#526348]">skills</span>
            </button>
            <button
              onClick={() => onNavigate('certificates')}
              className="px-3.5 py-1.5 rounded-full bg-white border border-[#D4E0CD] hover:border-[#3A4D28] hover:bg-[#8FA882]/15 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Jump to Certificates"
            >
              <span className="font-bold text-[#283618]">{profileData.stats.certificates}</span>
              <span className="text-xs sm:text-sm font-medium text-[#526348]">certificates</span>
            </button>

            {/* Client Feedback Rating */}
            <button
              onClick={() => {
                setRateModalInitialTab('all');
                setIsRateModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-full bg-[#8FA882]/20 border border-[#8FA882]/50 hover:border-[#283618] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Click to view Client Reviews"
            >
              <Star className="w-4 h-4 fill-[#283618] text-[#283618]" />
              <span className="font-bold text-[#283618]">{averageRating}</span>
              <span className="text-[#526348] text-xs sm:text-sm font-medium">
                ({totalReviews} reviews)
              </span>
            </button>
          </div>

          {/* Row 4: Real Authentic Bio */}
          <div className="text-[13.5px] sm:text-[15px] leading-relaxed text-[#283618]">
            <p className="whitespace-pre-line text-[#435339]">
              {profileData.bio}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-semibold text-[#283618]">
              <a
                href={profileData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:underline text-[#3A4D28]"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span>github.com/vincequijano-stack</span>
              </a>
              <a
                href={profileData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-[#526348] hover:text-[#283618] transition-colors"
              >
                https://www.linkedin.com/in/vince-quijano/
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row Below: Standout Action Buttons with Soft White / Sage Green / Deep Olive Hierarchy */}
      <div className="flex items-center gap-2.5 sm:gap-3 mt-5 sm:mt-6">
        <button
          onClick={() => onNavigate('contact')}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl bg-[#283618] hover:bg-[#3A4D28] active:scale-[0.98] text-xs sm:text-[15px] font-semibold text-white shadow-md shadow-[#283618]/15 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
          <span>Connect / Inquire</span>
        </button>

        <button
          onClick={handleDownloadCV}
          className="flex-1 py-2.5 sm:py-3 px-3 sm:px-5 rounded-xl bg-[#8FA882]/30 hover:bg-[#8FA882]/45 border border-[#8FA882]/60 active:scale-[0.98] text-xs sm:text-[15px] font-semibold text-[#283618] shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          title="Open Resume PDF"
        >
          <FileDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 text-[#283618]" />
          <span>View Resume</span>
        </button>

        <button
          onClick={() => {
            setRateModalInitialTab('rate');
            setIsRateModalOpen(true);
          }}
          className="py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl bg-[#527043] hover:bg-[#3A4D28] active:scale-[0.98] text-xs sm:text-[15px] font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-white text-white shrink-0" />
          <span>Rate ({totalReviews})</span>
        </button>
      </div>

      {/* Transparent Client Rating Modal */}
      <RateModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        initialTab={rateModalInitialTab}
      />
    </section>
  );
};
