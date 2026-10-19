import React from 'react';
import type { SurveyResponse } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, BarChart3, AlertCircle } from 'lucide-react';

interface SurveyResultsViewProps {
  surveys: SurveyResponse[];
}

export const SurveyResultsView: React.FC<SurveyResultsViewProps> = ({ surveys }) => {
  const total = surveys.length;

  if (total === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-gray-200/80 shadow-xs text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-gray-400 mx-auto" />
        <h3 className="text-lg font-bold text-[#103B54]">No Survey Responses Yet</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Be the first community member to fill out our Wagholi water survey! Your response will appear in aggregate visualisations below.
        </p>
      </div>
    );
  }

  // Aggregate helper
  const aggregateBy = <K extends keyof SurveyResponse>(key: K) => {
    const counts: Record<string, number> = {};
    surveys.forEach((s) => {
      const val = String(s[key] || 'Not specified');
      counts[val] = (counts[val] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  };

  const shortageData = aggregateBy('shortage_frequency');
  const sourceData = aggregateBy('primary_source');
  const awarenessData = aggregateBy('conservation_awareness');
  const willingnessData = aggregateBy('willingness_to_use_app');

  const COLORS = ['#087EBC', '#13B8A6', '#65A878', '#103B54', '#F59E0B', '#8B5CF6'];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-xs">
          <p className="font-bold text-[#103B54]">{d.name}</p>
          <p className="text-[#087EBC] font-semibold mt-0.5">
            {d.count} responses ({d.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Sample Size Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#087EBC] uppercase tracking-wider">
            Verified Community Feedback
          </span>
          <h3 className="text-xl font-bold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
            Wagholi Water Survey Analytics
          </h3>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F8F7] border border-[#13B8A6]/30 text-xs font-bold text-[#103B54]">
          <Users className="w-3.5 h-3.5 text-[#087EBC]" />
          <span>Sample Size: {total} Verified Submissions</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Water Shortage Frequency */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#087EBC]" />
              <span>Water Shortage Frequency</span>
            </h4>
            <span className="text-[11px] text-gray-400">Distribution %</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={shortageData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#087EBC" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Primary Water Source */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#13B8A6]" />
              <span>Primary Water Sources</span>
            </h4>
            <span className="text-[11px] text-gray-400">Tanker vs Borewell vs Municipal</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  dataKey="count"
                >
                  {sourceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center text-[11px] text-gray-600">
            {sourceData.map((s, idx) => (
              <span key={s.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                {s.name} ({s.percentage}%)
              </span>
            ))}
          </div>
        </div>

        {/* Chart 3: Awareness Level */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#65A878]" />
              <span>Conservation Awareness Level</span>
            </h4>
            <span className="text-[11px] text-gray-400">Self-reported</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={awarenessData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#13B8A6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Willingness to use AquaAlert */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#103B54] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>Willingness to Report Water Leaks</span>
            </h4>
            <span className="text-[11px] text-gray-400">Community intent</span>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={willingnessData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#65A878" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
