import React, { useState, useEffect } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  ratingService,
  RatingsState,
  formatReviewDate,
} from '../services/ratingService';
import {
  getSessionName,
  setSessionName,
  validateDisplayName,
  isOwnerUnlocked,
} from '../services/visitorSession';

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'rate' | 'all';
}

export const RateModal: React.FC<RateModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'rate',
}) => {
  const [activeTab, setActiveTab] = useState<'rate' | 'all'>(initialTab);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clientName, setClientName] = useState<string>(() => getSessionName());
  const [clientRole, setClientRole] = useState<string>('');
  const [clientFeedback, setClientFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [ratingsState, setRatingsState] = useState<RatingsState>(() =>
    ratingService.getState()
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setClientName(getSessionName());
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const unsubscribe = ratingService.subscribe((state) => {
      setRatingsState(state);
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const starLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality',
    4: 'Great & Responsive',
    5: 'Exceptional — High Impact!',
  };

  const handleNameChange = (val: string) => {
    setClientName(val);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedRating < 1 || selectedRating > 5) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }

    const nameValidation = validateDisplayName(clientName);
    if (nameValidation.ok === false) {
      setError(nameValidation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      setSessionName(nameValidation.value);

      await ratingService.submitReview({
        rating: selectedRating,
        name: nameValidation.value,
        role: clientRole.trim() || 'Client / Collaborator',
        feedback: clientFeedback.trim(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setClientFeedback('');
        setClientRole('');
        setActiveTab('all');
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOwner = isOwnerUnlocked();

  const handleDeleteReview = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}'s review?`)) return;
    await ratingService.deleteReview(id, name);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Client Reviews & Rating"
    >
      <div
        className="relative w-full max-w-lg bg-[#151515] border border-white/20 rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.95)] overflow-hidden max-h-[90dvh] flex flex-col z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#242424] border border-white/15 flex items-center justify-center text-white">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                Client Reviews &amp; Ratings
              </h3>
              <p className="text-[11px] font-mono-code text-[#C8C8C8]">
                {ratingsState.count > 0
                  ? `${ratingsState.average} ★ from ${ratingsState.count} eligible reviews`
                  : 'Transparent real-time client reviews'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#C8C8C8] hover:text-white rounded-full bg-[#151515] border border-white/12 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-white/10 bg-[#0A0A0A] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'rate'
                ? 'border-white text-white'
                : 'border-transparent text-[#777777] hover:text-[#C8C8C8]'
            }`}
          >
            ★ Leave a Rating
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-white text-white'
                : 'border-transparent text-[#777777] hover:text-[#C8C8C8]'
            }`}
          >
            All Reviews ({ratingsState.total})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeTab === 'rate' ? (
            isSuccess ? (
              <div className="py-10 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-white mb-3 animate-bounce" />
                <h4 className="font-display text-base font-bold text-white">
                  Thank You for Your Rating!
                </h4>
                <p className="text-xs text-[#C8C8C8] max-w-xs mt-1">
                  Your feedback has been saved and published transparently on the portfolio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    How did my work &amp; service impact your project?{' '}
                    <span className="text-[#C8C8C8]">*</span>
                  </label>
                  <p className="text-[11px] text-[#777777] mb-2">
                    Select a star rating below.
                  </p>

                  <div className="flex items-center gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || selectedRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => {
                            setSelectedRating(star);
                            setError('');
                          }}
                          className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isFilled
                                ? 'text-white fill-white'
                                : 'text-[#242424] stroke-[#777777] stroke-[1.5]'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-semibold text-[#C8C8C8] ml-2">
                      {starLabels[hoverRating || selectedRating]}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C8C8C8] mb-1">
                    Your Name / Nickname <span className="text-white">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Raziel Sevilla"
                    maxLength={40}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C8C8C8] mb-1">
                    Your Role / Company{' '}
                    <span className="text-[11px] text-[#777777] font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Founder / Collaborator"
                    maxLength={50}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C8C8C8] mb-1">
                    Written Feedback / Testimonial{' '}
                    <span className="text-[11px] text-[#777777] font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={clientFeedback}
                    onChange={(e) => setClientFeedback(e.target.value)}
                    placeholder="How was your experience working with me?"
                    maxLength={500}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-white/15 bg-[#0A0A0A] text-white placeholder-[#777777] focus:outline-none focus:border-white transition-colors resize-none"
                  />
                  <div className="flex justify-between text-[10px] text-[#777777] mt-1">
                    <span>Authentic feedback helps future collaborators.</span>
                    <span>{clientFeedback.length}/500</span>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-white hover:bg-[#F5F5F5] text-[#0A0A0A] text-xs font-bold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Rating...</span>
                    </>
                  ) : (
                    <span>Submit Client Rating ★</span>
                  )}
                </button>
              </form>
            )
          ) : (
            <div className="space-y-3">
              {ratingsState.status === 'loading' &&
              ratingsState.reviews.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-2 text-xs text-[#C8C8C8]">
                  <Loader2 className="w-6 h-6 animate-spin text-white" />
                  <span>Loading reviews from database...</span>
                </div>
              ) : ratingsState.reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#777777]">
                  <p>No client reviews received yet.</p>
                </div>
              ) : (
                <>
                  {ratingsState.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-[#0A0A0A] border border-white/12 rounded-2xl text-left space-y-2 relative"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {rev.name}
                          </span>
                          {rev.role && (
                            <span className="text-[10px] font-mono-code text-[#C8C8C8] bg-[#151515] border border-white/10 px-2 py-0.5 rounded-full">
                              {rev.role}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono-code text-[#777777]">
                            {formatReviewDate(rev)}
                          </span>
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev.id, rev.name)}
                              className="p-1 rounded-md text-[#777777] hover:text-red-400 transition-colors cursor-pointer"
                              title={`Delete ${rev.name}'s review (Owner)`}
                              aria-label={`Delete ${rev.name}'s review`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5 text-white">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? 'fill-white text-white'
                                : 'text-[#242424]'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-white ml-1.5">
                          {rev.rating}.0
                        </span>
                      </div>

                      {rev.feedback && (
                        <p className="text-xs text-[#C8C8C8] leading-relaxed italic">
                          &ldquo;{rev.feedback}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}

                  {ratingsState.hasMore && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => ratingService.loadMore()}
                        disabled={ratingsState.loadingMore}
                        className="w-full py-2.5 bg-[#242424] hover:bg-[#323232] text-xs font-semibold text-white rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {ratingsState.loadingMore ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Loading more reviews...</span>
                          </>
                        ) : (
                          <span>Load More Reviews</span>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
