import React from 'react';
import type { SurveyResponse } from '@/types';
import { formatDate } from '@/lib/utils';
import { Users, MapPin } from 'lucide-react';

interface AdminSurveyListProps {
  surveys: SurveyResponse[];
}

export const AdminSurveyList: React.FC<AdminSurveyListProps> = ({ surveys }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div>
          <h3 className="text-base font-bold text-[#103B54] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#087EBC]" />
            <span>Community Survey Submissions ({surveys.length})</span>
          </h3>
          <p className="text-xs text-gray-400">
            Field survey responses submitted anonymously by Wagholi residents.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F5F9FB] text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="px-4 py-3">Locality / Society</th>
              <th className="px-4 py-3">Shortage Frequency</th>
              <th className="px-4 py-3">Primary Water Source</th>
              <th className="px-4 py-3">Awareness</th>
              <th className="px-4 py-3">Leakage In Lane</th>
              <th className="px-4 py-3">Willingness</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {surveys.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-[#103B54]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                    <span>{s.locality}</span>
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60 font-medium">
                    {s.shortage_frequency}
                  </span>
                </td>
                <td className="px-4 py-3">{s.primary_source}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200/60 font-medium">
                    {s.conservation_awareness}
                  </span>
                </td>
                <td className="px-4 py-3">{s.leakage_experienced}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 font-medium">
                    {s.willingness_to_use_app}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 font-mono text-[11px]">
                  {formatDate(s.submitted_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
