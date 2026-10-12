import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare, HeartHandshake, User } from 'lucide-react';

export interface ClientReview {
  id: string;
  rating: number;
  name: string;
  role?: string;
  feedback: string;
  date: string;
}

interface RateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: ClientReview[];
  onSubmitReview: (review: Omit<ClientReview, 'id' | 'date'>) => void;
}

export const RateModal: React.FC<RateModalProps> = ({
  isOpen,
  onClose,
  reviews,
  onSubmitReview,
}) => {
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [clientName, setClientName] = useState<string>('');
  const [clientRole, setClientRole] = useState<string>('');
  const [clientFeedback, setClientFeedback] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'rate' | 'all'>('rate');
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const starLabels: Record<number, string> = {
    1: 'Needs Improvement',
    2: 'Fair Experience',
    3: 'Good Quality',
    4: 'Great & Responsive',
    5: 'Exceptional — Made a Huge Difference! 🚀',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0) {
      setError('Please select a star rating between 1 and 5.');
      return;
    }
    if (!clientName.trim()) {
      setError('Please enter your name or company handle.');
      return;
    }

    onSubmitReview({
      rating: selectedRating,
      name: clientName.trim(),
      role: clientRole.trim() || 'Client / Collaborator',
      feedback: clientFeedback.trim(),
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setClientName('');
      setClientRole('');
      setClientFeedback('');
      setActiveTab('all');
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-modal-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-[#1C1C1C] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#DBDBDB] dark:border-[#262626] flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EFEFEF] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FEF3C7] dark:bg-[#78350F]/40 flex items-center justify-center text-[#D97706] dark:text-[#FBBF24]">
              <Star className="w-4 h-4 fill-[#D97706] dark:fill-[#FBBF24]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#262626] dark:text-white">Client Feedback &amp; Ratings</h3>
              <p className="text-[11px] text-[#8E8E8E] dark:text-[#737373]">Transparent real-time client reviews</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#EFEFEF] dark:border-[#262626] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('rate')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'rate'
                ? 'border-[#0095F6] text-[#0095F6]'
                : 'border-transparent text-[#737373] dark:text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white'
            }`}
          >
            ★ Leave a Rating
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-[#0095F6] text-[#0095F6]'
                : 'border-transparent text-[#737373] dark:text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'rate' ? (
            isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mb-2 animate-bounce" />
                <h4 className="text-base font-bold text-[#262626]">Thank You for Your Rating!</h4>
                <p className="text-xs text-[#737373] max-w-xs mt-1">
                  Your feedback has been published transparently on the portfolio.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Rating Prompt */}
                <div>
                  <label className="block text-xs font-bold text-[#262626] dark:text-white mb-1">
                    How did my work &amp; service impact your project? <span className="text-red-500">*</span>
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
                  </div>

                  <p className="text-xs font-semibold text-[#D97706] dark:text-[#FBBF24] mt-1">
                    {starLabels[hoverRating || selectedRating]}
                  </p>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#262626] dark:text-white mb-1">
                      Your Name / Handle <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => {
                        setClientName(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g. Alex Rivera"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:border-[#262626] dark:focus:border-[#0095F6] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#262626] dark:text-white mb-1">
                      Role / Project (Optional)
                    </label>
                    <input
                      type="text"
                      value={clientRole}
                      onChange={(e) => setClientRole(e.target.value)}
                      placeholder="e.g. Founder, Startup / Client"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:border-[#262626] dark:focus:border-[#0095F6] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Feedback Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#262626] dark:text-white mb-1">
                    Your Feedback / Experience (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={clientFeedback}
                    onChange={(e) => setClientFeedback(e.target.value)}
                    placeholder="Tell others how Vince helped you, delivered code, or solved problems..."
                    className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#333333] bg-[#FAFAFA] dark:bg-[#121212] text-[#262626] dark:text-white focus:bg-white dark:focus:bg-[#1C1C1C] focus:border-[#262626] dark:focus:border-[#0095F6] focus:outline-none"
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Submit Honest Rating
                </button>
              </form>
            )
          ) : (
            /* All Reviews List */
            <div className="space-y-3">
              {reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8E8E8E] dark:text-[#737373]">
                  <p>No client ratings received yet.</p>
                  <p className="mt-1">Be the first client to submit a rating!</p>
                  <button
                    onClick={() => setActiveTab('rate')}
                    className="mt-3 px-3.5 py-1.5 rounded-lg bg-[#0095F6] text-white text-xs font-semibold"
                  >
                    Rate Now
                  </button>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 bg-[#FAFAFA] dark:bg-[#262626]/40 border border-[#EFEFEF] dark:border-[#333333] rounded-xl text-left space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#262626] dark:text-white">{rev.name}</span>
                        {rev.role && (
                          <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373] bg-[#EFEFEF] dark:bg-[#262626] px-1.5 py-0.2 rounded">
                            {rev.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373]">{rev.date}</span>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-0.5 text-[#F59E0B]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? 'fill-[#F59E0B]' : 'text-[#DBDBDB] dark:text-[#4B5563]'
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
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
