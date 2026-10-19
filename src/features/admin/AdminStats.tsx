import React from 'react';
import type { Complaint } from '@/types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Clock,
  Eye,
  Wrench,
  CheckCircle2,
  FileText,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';

interface AdminStatsProps {
  complaints: Complaint[];
}

export const AdminStats: React.FC<AdminStatsProps> = ({ complaints }) => {
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const underReview = complaints.filter((c) => c.status === 'Under Review').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  // Issue types aggregation
  const issueCounts: Record<string, number> = {};
  complaints.forEach((c) => {
    issueCounts[c.issue_type] = (issueCounts[c.issue_type] || 0) + 1;
  });

  const issueChartData = Object.entries(issueCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Status breakdown data
  const statusChartData = [
    { name: 'Pending', count: pending, fill: '#F59E0B' },
    { name: 'Under Review', count: underReview, fill: '#087EBC' },
    { name: 'In Progress', count: inProgress, fill: '#13B8A6' },
    { name: 'Resolved', count: resolved, fill: '#10B981' },
  ];

  const TYPE_COLORS = ['#087EBC', '#13B8A6', '#65A878', '#103B54'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-2.5 rounded-xl shadow-lg border border-gray-100 text-xs">
          <p className="font-bold text-[#103B54]">{d.name}</p>
          <p className="text-[#087EBC] font-semibold mt-0.5">{d.count} reports</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* 5 Metric Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <FileText className="w-4 h-4 text-[#103B54]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#103B54] font-mono">
            {total}
          </span>
          <span className="text-[10px] text-gray-400 block mt-0.5">All time records</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono">
            {pending}
          </span>
          <span className="text-[10px] text-amber-600/70 block mt-0.5">Needs check</span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/80 shadow-xs">
          <div className="flex items-center justify-between text-sky-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Reviewing</span>
            <Eye className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-sky-700 font-mono">
            {underReview}
          </span>
          <span className="text-[10px] text-sky-600/70 block mt-0.5">Team assigned</span>
        </div>

        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 shadow-xs">
          <div className="flex items-center justify-between text-teal-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Wrench className="w-4 h-4 text-teal-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-mono">
            {inProgress}
          </span>
          <span className="text-[10px] text-teal-600/70 block mt-0.5">Maintenance active</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
            {resolved}
          </span>
          <span className="text-[10px] text-emerald-600/70 block mt-0.5">Leak fixed</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#087EBC]" />
              <span>Complaints by Current Status</span>
            </h4>
            <span className="text-[11px] text-gray-400">Database Counts</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Type Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#13B8A6]" />
              <span>Complaints by Issue Type</span>
            </h4>
            <span className="text-[11px] text-gray-400">Wastage category</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={issueChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="count"
                >
                  {issueChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[11px] text-gray-600">
            {issueChartData.map((item, idx) => (
              <span key={item.name} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: TYPE_COLORS[idx % TYPE_COLORS.length] }}
                />
                {item.name}: {item.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
