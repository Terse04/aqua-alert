import React, { useState } from 'react';
import type { Complaint } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatDate } from '@/lib/utils';
import {
  Search,
  Eye,
  Camera,
  MapPin,
  AlertCircle,
} from 'lucide-react';

interface AdminComplaintTableProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
}

export const AdminComplaintTable: React.FC<AdminComplaintTableProps> = ({
  complaints,
  onSelectComplaint,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.reference_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.area_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || c.status === statusFilter;

    const matchesType =
      typeFilter === 'ALL' || c.issue_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reference ID, area, or description..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-300 text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-300 text-gray-700 bg-white focus:border-[#087EBC] focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          {/* Issue Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-gray-300 text-gray-700 bg-white focus:border-[#087EBC] focus:outline-hidden"
          >
            <option value="ALL">All Issue Types</option>
            <option value="Pipeline Leakage">Pipeline Leakage</option>
            <option value="Broken Tap">Broken Tap</option>
            <option value="Tank Overflow">Tank Overflow</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F9FB] text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="px-4 py-3.5">Reference ID</th>
              <th className="px-4 py-3.5">Issue Type</th>
              <th className="px-4 py-3.5">Location / Area</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Reported</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  <AlertCircle className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  <span>No complaints match your active search or filter criteria.</span>
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-sky-50/30 transition-colors group"
                >
                  <td className="px-4 py-3 font-mono font-bold text-[#103B54]">
                    <div className="flex items-center gap-1.5">
                      <span>{c.reference_id}</span>
                      {c.photo_url && (
                        <span title="Photo attached">
                          <Camera className="w-3.5 h-3.5 text-[#087EBC]" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {c.issue_type}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{c.area_name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelectComplaint(c)}
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-[#087EBC] bg-sky-50 hover:bg-sky-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review & Update</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
        <span>Showing {filteredComplaints.length} of {complaints.length} records</span>
        <span>Click any row action to update status or review photos</span>
      </div>
    </div>
  );
};
