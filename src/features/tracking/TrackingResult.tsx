import React from 'react';
import type { PublicComplaintDetails, ComplaintStatus } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  Clock,
  Eye,
  Wrench,
  CheckCircle2,
  Calendar,
  MapPin,
  FileText,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

interface TrackingResultProps {
  details: PublicComplaintDetails;
  onTrackAnother: () => void;
}

export const TrackingResult: React.FC<TrackingResultProps> = ({
  details,
  onTrackAnother,
}) => {
  const steps: { status: ComplaintStatus; label: string; desc: string; icon: any }[] = [
    {
      status: 'Pending',
      label: 'Pending',
      desc: 'Report registered in system',
      icon: Clock,
    },
    {
      status: 'Under Review',
      label: 'Under Review',
      desc: 'Volunteer team verified',
      icon: Eye,
    },
    {
      status: 'In Progress',
      label: 'In Progress',
      desc: 'Maintenance notified',
      icon: Wrench,
    },
    {
      status: 'Resolved',
      label: 'Resolved',
      desc: 'Leakage stopped',
      icon: CheckCircle2,
    },
  ];

  const getStatusIndex = (s: ComplaintStatus) => {
    switch (s) {
      case 'Pending':
        return 0;
      case 'Under Review':
        return 1;
      case 'In Progress':
        return 2;
      case 'Resolved':
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStatusIndex(details.status);

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-10 max-w-3xl mx-auto space-y-8">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Complaint Reference
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              Verified Authenticated
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] font-mono tracking-tight">
            {details.reference_id}
          </h2>
        </div>

        <div>
          <StatusBadge status={details.status} size="lg" />
        </div>
      </div>

      {/* Visual Step Progress Bar */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Resolution Pipeline Progress
        </h3>

        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.status} className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-[#087EBC] text-white ring-4 ring-sky-100 shadow-md'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={`mt-2 text-xs font-bold ${
                    isCurrent
                      ? 'text-[#087EBC]'
                      : isCompleted
                      ? 'text-[#103B54]'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[10px] text-gray-400 hidden sm:block mt-0.5">
                  {step.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-[#F5F9FB] border border-gray-100">
        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#087EBC]" />
            Issue Category
          </span>
          <p className="text-sm font-bold text-[#103B54]">{details.issue_type}</p>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#087EBC]" />
            Reported Date & Time
          </span>
          <p className="text-sm font-bold text-[#103B54]">{formatDate(details.created_at)}</p>
        </div>

        <div className="sm:col-span-2 space-y-1 pt-2 border-t border-gray-200/50">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#087EBC]" />
            Incident Location / Area
          </span>
          <p className="text-sm font-semibold text-[#103B54]">{details.area_name}</p>
        </div>

        <div className="sm:col-span-2 space-y-1 pt-2 border-t border-gray-200/50">
          <span className="text-xs text-gray-500 font-medium">Problem Description</span>
          <p className="text-sm text-[#263746] leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
            {details.description}
          </p>
        </div>
      </div>

      {/* Status History Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#103B54] uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#087EBC]" />
          <span>Status Update History</span>
        </h3>

        {details.status_history.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No milestone updates recorded yet.</p>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
            {details.status_history.map((hist, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#087EBC] shadow-xs" />
                <div className="bg-[#F5F9FB] rounded-xl p-3.5 border border-gray-200/80 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={hist.status} size="sm" />
                    <span className="text-[11px] text-gray-400 font-mono">
                      {formatDate(hist.changed_at)}
                    </span>
                  </div>
                  {hist.notes && (
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">{hist.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Privacy Notice */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          Private contact numbers and exact GPS coordinates are omitted from public tracking to protect community privacy.
        </span>
      </div>

      {/* Action */}
      <div className="pt-2 flex justify-end">
        <button
          onClick={onTrackAnother}
          type="button"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-[#103B54] bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          Track Another Complaint
        </button>
      </div>
    </div>
  );
};
