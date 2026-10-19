import React, { useState } from 'react';
import { Database, Info, X } from 'lucide-react';
import { DataService } from '@/lib/storage';

export const DemoBadge: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  const isDemo = DataService.isDemoMode();

  if (!isDemo) return null;

  return (
    <>
      <button
        onClick={() => setShowInfo(true)}
        type="button"
        title="AquaAlert is operating in local demo mode"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors shadow-xs"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        <Database className="w-3 h-3 text-amber-700" />
        <span>Demo Mode — Local Data</span>
      </button>

      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 text-[#103B54] font-semibold text-base">
                <Info className="w-5 h-5 text-[#087EBC]" />
                <h3>About Demo Mode</h3>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-[#263746] leading-relaxed">
              <p>
                AquaAlert is currently running in <strong>Interactive Demo Mode</strong> with persistent browser storage (localStorage).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
                <li>Complaints, surveys, and feedback you submit will persist across page refreshes.</li>
                <li>Tracking with generated codes works immediately in this browser.</li>
                <li>Administrator features are accessible for demonstration without remote credentials.</li>
                <li>To connect a production PostgreSQL backend, configure <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">VITE_SUPABASE_ANON_KEY</code>.</li>
              </ul>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-800">
                <strong>Academic CEP Note:</strong> Submissions in demo mode are not transmitted to municipal authorities.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 text-sm font-medium bg-[#103B54] text-white rounded-xl hover:bg-[#087EBC] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
