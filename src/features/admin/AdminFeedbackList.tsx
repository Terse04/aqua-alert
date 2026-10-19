import React from 'react';
import type { FeedbackSubmission } from '@/types';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Star, User } from 'lucide-react';

interface AdminFeedbackListProps {
  feedback: FeedbackSubmission[];
}

export const AdminFeedbackList: React.FC<AdminFeedbackListProps> = ({ feedback }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#103B54] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#087EBC]" />
            <span>Resident Feedback & Platform Suggestions ({feedback.length})</span>
          </h3>
          <p className="text-xs text-gray-400">
            Internal evaluation feedback submitted by community visitors.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedback.map((f) => (
          <div
            key={f.id}
            className="p-5 rounded-2xl bg-[#F5F9FB] border border-gray-200/80 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#087EBC] bg-white px-2.5 py-1 rounded-lg border border-gray-100">
                  {f.category}
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < f.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-100">
                "{f.comments}"
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200/50 flex items-center justify-between text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-gray-400" />
                <span>{f.contact_info || 'Anonymous Resident'}</span>
              </span>
              <span className="font-mono text-gray-400">{formatDate(f.submitted_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
