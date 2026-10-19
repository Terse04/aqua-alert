import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '@/lib/storage';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { AdminStats } from '@/features/admin/AdminStats';
import { AdminComplaintTable } from '@/features/admin/AdminComplaintTable';
import { AdminComplaintDetailModal } from '@/features/admin/AdminComplaintDetailModal';
import { AdminSurveyList } from '@/features/admin/AdminSurveyList';
import { AdminFeedbackList } from '@/features/admin/AdminFeedbackList';
import type {
  Complaint,
  ComplaintStatus,
  ComplaintStatusHistory,
  FeedbackSubmission,
  SurveyResponse,
} from '@/types';
import {
  Shield,
  LogOut,
  FileText,
  Users,
  MessageSquare,
  RefreshCw,
  Loader2,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const session = DataService.getAdminSession();

  // Redirect if unauthenticated
  useEffect(() => {
    if (!session) {
      navigate('/admin/login', { replace: true, state: { from: { pathname: '/admin' } } });
    }
  }, [session, navigate]);

  const [activeTab, setActiveTab] = useState<'complaints' | 'surveys' | 'feedback'>('complaints');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [history, setHistory] = useState<ComplaintStatusHistory[]>([]);
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [cData, sData, fData] = await Promise.all([
        DataService.getAdminComplaints(),
        DataService.getSurveys(),
        DataService.getFeedback(),
      ]);
      setComplaints(cData.complaints);
      setHistory(cData.history);
      setSurveys(sData);
      setFeedback(fData);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadAllData();
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    DataService.clearAdminSession();
    navigate('/admin/login');
  };

  const handleUpdateStatus = async (newStatus: ComplaintStatus, notes: string) => {
    if (!selectedComplaint) return;
    await DataService.updateComplaintStatus({
      complaintId: selectedComplaint.id,
      newStatus,
      notes,
      adminName: session?.email || 'CEP Admin',
    });
    // Refresh records
    await loadAllData();
  };

  if (!session) return null;

  return (
    <div className="py-8 sm:py-12 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Session Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E9F8F7] text-[#087EBC] flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#087EBC] uppercase tracking-wider">
                  Verified Portal
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  {session.role}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
                Coordinator Control Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={loadAllData}
              type="button"
              disabled={loading}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {loading && complaints.length === 0 ? (
          <div className="text-center py-20 text-gray-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#087EBC]" />
            <p className="text-sm">Fetching genuine database telemetry...</p>
          </div>
        ) : (
          <>
            {/* Live Metrics Tiles and Charts */}
            <AdminStats complaints={complaints} />

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
              <button
                type="button"
                onClick={() => setActiveTab('complaints')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'complaints'
                    ? 'bg-[#103B54] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Complaints Directory ({complaints.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('surveys')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'surveys'
                    ? 'bg-[#103B54] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Survey Responses ({surveys.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'feedback'
                    ? 'bg-[#103B54] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Resident Feedback ({feedback.length})</span>
              </button>
            </div>

            {/* Active Tab Content */}
            {activeTab === 'complaints' && (
              <AdminComplaintTable
                complaints={complaints}
                onSelectComplaint={(c) => setSelectedComplaint(c)}
              />
            )}

            {activeTab === 'surveys' && (
              <AdminSurveyList surveys={surveys} />
            )}

            {activeTab === 'feedback' && (
              <AdminFeedbackList feedback={feedback} />
            )}

            {/* Detail & Status Update Modal */}
            {selectedComplaint && (
              <AdminComplaintDetailModal
                complaint={selectedComplaint}
                history={history}
                onClose={() => setSelectedComplaint(null)}
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
