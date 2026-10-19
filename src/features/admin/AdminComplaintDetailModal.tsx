import React, { useState } from 'react';
import type { Complaint, ComplaintStatus, ComplaintStatusHistory } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  X,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Edit3,
} from 'lucide-react';

interface AdminComplaintDetailModalProps {
  complaint: Complaint;
  history: ComplaintStatusHistory[];
  onClose: () => void;
  onUpdateStatus: (newStatus: ComplaintStatus, notes: string) => Promise<void>;
}

export const AdminComplaintDetailModal: React.FC<AdminComplaintDetailModalProps> = ({
  complaint,
  history,
  onClose,
  onUpdateStatus,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const statuses: ComplaintStatus[] = [
    'Pending',
    'Under Review',
    'In Progress',
    'Resolved',
  ];

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === complaint.status && !statusNotes.trim()) {
      onClose();
      return;
    }

    try {
      setUpdating(true);
      setUpdateError(null);
      await onUpdateStatus(selectedStatus, statusNotes.trim());
      setUpdateSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const complaintHistory = history.filter((h) => h.complaint_id === complaint.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-gray-500 uppercase">
                Reference ID
              </span>
              <StatusBadge status={complaint.status} size="sm" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#103B54] font-mono mt-0.5">
              {complaint.reference_id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {updateSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Complaint status successfully updated and logged in timeline.</span>
          </div>
        )}

        {updateError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{updateError}</span>
          </div>
        )}

        <div className="mt-6 space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          {/* Photograph Review (Admin only) */}
          {complaint.photo_url ? (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#087EBC]" />
                Incident Photograph
              </span>
              <div className="rounded-2xl overflow-hidden border border-gray-200 max-h-64 bg-slate-900">
                <img
                  src={complaint.photo_url}
                  alt="Complaint incident"
                  className="w-full h-64 object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 italic">
              No photograph was attached with this report.
            </div>
          )}

          {/* Incident Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#F5F9FB] p-4 rounded-2xl border border-gray-100">
            <div>
              <span className="text-gray-400 block mb-0.5">Issue Type</span>
              <strong className="text-[#103B54] text-sm">{complaint.issue_type}</strong>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Submitted On</span>
              <strong className="text-[#103B54] text-sm">{formatDate(complaint.created_at)}</strong>
            </div>
            <div className="sm:col-span-2 pt-2 border-t border-gray-200/50">
              <span className="text-gray-400 block mb-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#087EBC]" />
                Reported Area / Landmark
              </span>
              <strong className="text-[#103B54]">{complaint.area_name}</strong>
              {complaint.latitude && complaint.longitude && (
                <span className="font-mono text-[10px] text-gray-500 block mt-0.5">
                  GPS: {complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}
                </span>
              )}
            </div>
            {complaint.reporter_contact && (
              <div className="sm:col-span-2 pt-2 border-t border-gray-200/50">
                <span className="text-gray-400 block mb-0.5 flex items-center gap-1">
                  <User className="w-3 h-3 text-[#087EBC]" />
                  Internal Reporter Contact (Protected)
                </span>
                <span className="text-gray-700 font-medium">{complaint.reporter_contact}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Problem Description
            </span>
            <p className="text-xs text-gray-700 leading-relaxed bg-white p-3 rounded-xl border border-gray-200">
              {complaint.description}
            </p>
          </div>

          {/* Authorized Status Update Form */}
          <form
            onSubmit={handleSaveStatus}
            className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wide">
              <Edit3 className="w-4 h-4 text-amber-700" />
              <span>Update Complaint Status (Administrator)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statuses.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                    selectedStatus === s
                      ? 'border-[#087EBC] bg-[#087EBC] text-white shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
                Resolution Notes / Action Log (Visible in tracking timeline)
              </label>
              <textarea
                id="notes"
                rows={2}
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                placeholder="e.g., Volunteer visited site on 20th Oct; notified society secretary to fix float valve..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 text-[#103B54] focus:border-[#087EBC] focus:outline-hidden bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#103B54] hover:bg-[#087EBC] disabled:opacity-50 transition-colors shadow-xs"
              >
                {updating ? 'Saving Status...' : 'Apply Status Update'}
              </button>
            </div>
          </form>

          {/* Milestone Timeline */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#087EBC]" />
              Historical Audit Trail
            </span>

            <div className="space-y-2">
              {complaintHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-xl bg-gray-50 border border-gray-200/70 text-xs flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={h.status} size="sm" />
                      <span className="text-gray-500 font-medium">by {h.changed_by}</span>
                    </div>
                    {h.notes && <p className="text-gray-600 mt-1">{h.notes}</p>}
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {formatDate(h.changed_at)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
