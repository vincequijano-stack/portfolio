import React, { useState, useEffect } from 'react';
import {
  Star,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
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
} from '../services/visitorSession';
import { VisitorIdentityChip } from './VisitorIdentity';

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

  // Ratings store state
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
    5: 'Exceptional — Made a Huge Difference! 🚀',
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
    if (!nameValidation.ok) {
      setError(nameValidation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      // Retain display name for the current browser session
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#EFEFEF] dark:border-[#262626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-[#D97706] dark:text-[#FBBF24]">
              <Star className="w-4 h-4 fill-[#D97706] dark:fill-[#FBBF24]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#262626] dark:text-white">
                  Client Feedback &amp; Ratings
                </h3>
              </div>
              <p className="text-[11px] text-[#8E8E8E] dark:text-[#737373]">
                {ratingsState.count > 0
                  ? `${ratingsState.average} ★ from ${ratingsState.count} eligible reviews`
                  : 'Transparent real-time client reviews'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#EFEFEF] dark:border-[#262626] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'rate'
                ? 'border-[#0095F6] text-[#0095F6]'
                : 'border-transparent text-[#737373] dark:text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white'
            }`}
          >
            ★ Leave a Rating
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-[#0095F6] text-[#0095F6]'
                : 'border-transparent text-[#737373] dark:text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white'
            }`}
          >
            All Reviews ({ratingsState.total})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'rate' ? (
            isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mb-2 animate-bounce" />
                <h4 className="text-base font-bold text-[#262626] dark:text-white">
                  Thank You for Your Rating!
                </h4>
                <p className="text-xs text-[#737373] dark:text-[#A8A8A8] max-w-xs mt-1">
                  Your feedback has been saved and published transparently on the portfolio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Visitor identity chip if already recognized */}
                <VisitorIdentityChip label="Submitting as" />

                {/* Rating Prompt */}
                <div>
                  <label className="block text-xs font-bold text-[#262626] dark:text-white mb-1">
                    How did my work &amp; service impact your project?{' '}
                    <span className="text-[#ED4956]">*</span>
                  </label>
                  <p className="text-[11px] text-[#737373] dark:text-[#A8A8A8] mb-2">
                    Click the stars below to rate how I helped make your life or business better.
                  </p>

                  {/* Star Selector */}
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
                                ? 'text-[#F59E0B] fill-[#F59E0B]'
                                : 'text-[#DBDBDB] dark:text-[#4B5563] stroke-[1.5]'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-semibold text-[#262626] dark:text-white ml-2">
                      {starLabels[hoverRating || selectedRating]}
                    </span>
                  </div>
                </div>

                {/* Display Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#262626] dark:text-[#E0E0E0] mb-1">
                    Your Name / Nickname <span className="text-[#ED4956]">*</span>
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    maxLength={40}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-white dark:bg-[#141414] text-[#262626] dark:text-white focus:outline-none focus:border-[#0095F6] transition-colors"
                  />
                </div>

                {/* Role / Company Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#262626] dark:text-[#E0E0E0] mb-1">
                    Your Role / Company{' '}
                    <span className="text-[11px] text-[#8E8E8E] font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    placeholder="e.g. Founder at TechStartup / Client"
                    maxLength={50}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-white dark:bg-[#141414] text-[#262626] dark:text-white focus:outline-none focus:border-[#0095F6] transition-colors"
                  />
                </div>

                {/* Feedback Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-[#262626] dark:text-[#E0E0E0] mb-1">
                    Written Feedback / Testimonial{' '}
                    <span className="text-[11px] text-[#8E8E8E] font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={clientFeedback}
                    onChange={(e) => setClientFeedback(e.target.value)}
                    placeholder="How was your experience working with me? What did we accomplish together?"
                    maxLength={500}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-white dark:bg-[#141414] text-[#262626] dark:text-white focus:outline-none focus:border-[#0095F6] transition-colors resize-none"
                  />
                  <div className="flex justify-between text-[10px] text-[#8E8E8E] mt-0.5">
                    <span>Authentic feedback helps future clients decide with confidence.</span>
                    <span>{clientFeedback.length}/500</span>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-2.5 bg-[#FFF5F5] dark:bg-[#3B1C1D]/30 border border-[#FED7D7] dark:border-[#742A2A] rounded-lg text-xs text-[#ED4956] flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
            /* All Reviews List */
            <div className="space-y-3">
              {ratingsState.status === 'loading' && ratingsState.reviews.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center gap-2 text-xs text-[#8E8E8E]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#0095F6]" />
                  <span>Loading reviews from database...</span>
                </div>
              ) : ratingsState.reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8E8E8E] dark:text-[#737373]">
                  <p>No client ratings received yet.</p>
                  <p className="mt-1">Be the first client to submit a rating!</p>
                  <button
                    onClick={() => setActiveTab('rate')}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#0095F6] text-white text-xs font-semibold cursor-pointer"
                  >
                    Rate Now
                  </button>
                </div>
              ) : (
                <>
                  {ratingsState.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 bg-[#FAFAFA] dark:bg-[#262626]/40 border border-[#EFEFEF] dark:border-[#333333] rounded-xl text-left space-y-1.5 relative"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#262626] dark:text-white">
                            {rev.name}
                          </span>
                          {rev.role && (
                            <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373] bg-[#EFEFEF] dark:bg-[#262626] px-1.5 py-0.2 rounded">
                              {rev.role}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">
                          {formatReviewDate(rev)}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-[#F59E0B]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? 'fill-[#F59E0B]'
                                : 'text-[#DBDBDB] dark:text-[#4B5563]'
                            }`}
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#262626] dark:text-white ml-1.5">
                          {rev.rating}.0
                        </span>
                      </div>

                      {rev.feedback && (
                        <p className="text-xs text-[#4A4A4A] dark:text-[#D1D5DB] leading-relaxed italic">
                          "{rev.feedback}"
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Load More Button */}
                  {ratingsState.hasMore && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => ratingService.loadMore()}
                        disabled={ratingsState.loadingMore}
                        className="w-full py-2 bg-[#EFEFEF] dark:bg-[#262626] hover:bg-[#DBDBDB] dark:hover:bg-[#333333] text-xs font-semibold text-[#262626] dark:text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
