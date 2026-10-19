import React, { useEffect, useState } from 'react';
import { SurveyForm } from '@/features/surveys/SurveyForm';
import { SurveyResultsView } from '@/features/surveys/SurveyResultsView';
import { DataService } from '@/lib/storage';
import type { SurveyResponse } from '@/types';
import { Users, BarChart3 } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'survey' | 'results'>('survey');

  const loadSurveys = () => {
    DataService.getSurveys()
      .then((data) => setSurveys(data))
      .catch((err) => console.error('Failed to load surveys:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  return (
    <div className="py-10 sm:py-14 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Switcher Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 bg-gray-200/70 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('survey')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'survey'
                  ? 'bg-white text-[#103B54] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 text-[#087EBC]" />
              <span>Fill Water Survey</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-white text-[#103B54] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-[#13B8A6]" />
              <span>View Community Analytics ({surveys.length})</span>
            </button>
          </div>
        </div>

        {activeTab === 'survey' ? (
          <div className="space-y-6">
            <SurveyForm
              onSubmitted={() => {
                loadSurveys();
                setActiveTab('results');
              }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16 text-gray-400">Loading survey results...</div>
            ) : (
              <SurveyResultsView surveys={surveys} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
