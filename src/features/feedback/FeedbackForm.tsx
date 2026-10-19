import React, { useState } from 'react';
import { DataService } from '@/lib/storage';
import {
  MessageSquare,
  Star,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { FeedbackSubmission } from '@/types';

export const FeedbackForm: React.FC = () => {
  const [category, setCategory] = useState<FeedbackSubmission['category']>('Platform Experience');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const [contactInfo, setContactInfo] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories: FeedbackSubmission['category'][] = [
    'Platform Experience',
    'Leakage Reporting',
    'Calculator Accuracy',
    'Awareness Content',
    'General Suggestion',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      setError('Please provide comments or suggestions.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await DataService.submitFeedback({
        category,
        rating,
        comments: comments.trim(),
        contact_info: contactInfo.trim() || null,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Feedback submission error:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200 shadow-md text-center space-y-4 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
          Feedback Received
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Thank you for helping us refine AquaAlert! Your constructive suggestions help our student engineering team continuously improve the tool for Wagholi.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setComments('');
            setContactInfo('');
          }}
          className="px-5 py-2.5 text-xs font-semibold text-[#087EBC] bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors"
        >
          Send Another Feedback Note
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md max-w-2xl mx-auto">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC] mb-2">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Continuous Community Improvement</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
          Share Your Feedback & Ideas
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Have an idea to improve AquaAlert, noticed an incorrect benchmark, or want to suggest a feature? Let us know.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category */}
        <div>
          <label htmlFor="cat" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1.5">
            1. Feedback Category
          </label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-2">
            2. How would you rate your overall experience with AquaAlert?
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      active
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-300 fill-gray-100'
                    }`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-semibold text-gray-500 ml-2">
              {rating === 5 && 'Outstanding'}
              {rating === 4 && 'Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Needs Work'}
              {rating === 1 && 'Poor'}
            </span>
          </div>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1.5">
            3. Suggestions, Observations or Critique <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="comments"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Tell us what worked well or what features would make AquaAlert more useful in your society..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
          />
        </div>

        {/* Optional contact */}
        <div>
          <label htmlFor="contact" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1.5">
            4. Optional Name / Email (For Follow-up)
          </label>
          <input
            id="contact"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            placeholder="e.g., student / resident contact"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Feedback...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Feedback</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
