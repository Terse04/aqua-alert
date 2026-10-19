import { isSupabaseConfigured, supabase } from './supabase';
import {
  hashTrackingSecret,
  timingSafeEqual,
  generateReferenceId,
  generateTrackingSecret,
} from './crypto';
import {
  getInitialDemoComplaints,
  getInitialDemoSurveys,
  getInitialDemoFeedback,
} from './demoData';
import type {
  Complaint,
  ComplaintStatus,
  ComplaintStatusHistory,
  FeedbackSubmission,
  IssueType,
  PublicComplaintDetails,
  SurveyResponse,
} from '@/types';

const COMPLAINTS_KEY = 'aquaalert_complaints_v1';
const HISTORY_KEY = 'aquaalert_history_v1';
const SURVEYS_KEY = 'aquaalert_surveys_v1';
const FEEDBACK_KEY = 'aquaalert_feedback_v1';
const ADMIN_SESSION_KEY = 'aquaalert_admin_session_v1';

// Seed demo data into localStorage on initial load
export async function initializeStorage(): Promise<void> {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(COMPLAINTS_KEY)) {
    const { complaints, history } = await getInitialDemoComplaints();
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  if (!localStorage.getItem(SURVEYS_KEY)) {
    const surveys = getInitialDemoSurveys();
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(surveys));
  }

  if (!localStorage.getItem(FEEDBACK_KEY)) {
    const feedback = getInitialDemoFeedback();
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedback));
  }
}

// Ensure storage is initialized
initializeStorage().catch(console.error);

export const DataService = {
  isDemoMode(): boolean {
    return !isSupabaseConfigured();
  },

  // -------------------------------------------------------------
  // Complaints API
  // -------------------------------------------------------------
  async submitComplaint(params: {
    issueType: IssueType;
    areaName: string;
    description: string;
    latitude?: number | null;
    longitude?: number | null;
    photoFile?: File | null;
    reporterContact?: string | null;
  }): Promise<{ referenceId: string; trackingSecret: string }> {
    const referenceId = generateReferenceId();
    const trackingSecret = generateTrackingSecret();
    const trackingSecretHash = await hashTrackingSecret(trackingSecret);

    let photoUrl: string | null = null;
    if (params.photoFile) {
      if (isSupabaseConfigured() && supabase) {
        // Upload to private Supabase Storage bucket 'complaint-photos'
        const fileExt = params.photoFile.name.split('.').pop();
        const filePath = `${referenceId}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('complaint-photos')
          .upload(filePath, params.photoFile);

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error('Failed to upload complaint photograph. Please try again.');
        }
        // In real Supabase, store the storage path
        photoUrl = filePath;
      } else {
        // In demo mode, convert to Data URL for instant local preview and admin inspection
        photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(params.photoFile!);
        });
      }
    }

    if (isSupabaseConfigured() && supabase) {
      // Production Supabase insert via Edge Function or direct RLS policy
      const { data: newComplaint, error: insertError } = await supabase
        .from('complaints')
        .insert({
          reference_id: referenceId,
          tracking_secret_hash: trackingSecretHash,
          issue_type: params.issueType,
          area_name: params.areaName,
          description: params.description,
          latitude: params.latitude || null,
          longitude: params.longitude || null,
          photo_url: photoUrl,
          status: 'Pending',
          reporter_contact: params.reporterContact || null,
        })
        .select('id')
        .single();

      if (insertError || !newComplaint) {
        console.error('Database insert error:', insertError);
        throw new Error(insertError?.message || 'Database error occurred during submission.');
      }

      // Record initial status history
      await supabase.from('complaint_status_history').insert({
        complaint_id: newComplaint.id,
        status: 'Pending',
        notes: 'Initial community report registered.',
        changed_by: 'Citizen Reporter',
      });

      return { referenceId, trackingSecret };
    }

    // --- Demo Mode (LocalStorage) ---
    const localComplaints: Complaint[] = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || '[]'
    );
    const localHistory: ComplaintStatusHistory[] = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    );

    const complaintId = `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const newRecord: Complaint = {
      id: complaintId,
      reference_id: referenceId,
      tracking_secret_hash: trackingSecretHash,
      issue_type: params.issueType,
      area_name: params.areaName,
      latitude: params.latitude || null,
      longitude: params.longitude || null,
      description: params.description,
      photo_url: photoUrl,
      status: 'Pending',
      created_at: now,
      updated_at: now,
      internal_notes: 'Community report awaiting initial review.',
      reporter_contact: params.reporterContact || null,
    };

    const newHistory: ComplaintStatusHistory = {
      id: `hist-${Date.now()}`,
      complaint_id: complaintId,
      status: 'Pending',
      notes: 'Initial community report registered via AquaAlert.',
      changed_by: 'Citizen Reporter',
      changed_at: now,
    };

    localComplaints.unshift(newRecord);
    localHistory.unshift(newHistory);

    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(localComplaints));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(localHistory));

    return { referenceId, trackingSecret };
  },

  /**
   * Secure public complaint tracking.
   * Requires BOTH Reference ID AND private tracking secret.
   * Compares cryptographic hash and returns strictly non-sensitive fields.
   */
  async trackComplaint(
    referenceId: string,
    trackingSecret: string
  ): Promise<PublicComplaintDetails | null> {
    const cleanRef = referenceId.trim().toUpperCase();
    const cleanSecret = trackingSecret.trim().toUpperCase();
    const computedHash = await hashTrackingSecret(cleanSecret);

    if (isSupabaseConfigured() && supabase) {
      // Query database via secure lookup
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id,
          reference_id,
          tracking_secret_hash,
          issue_type,
          area_name,
          description,
          status,
          created_at,
          complaint_status_history (
            status,
            notes,
            changed_at
          )
        `)
        .eq('reference_id', cleanRef)
        .single();

      if (error || !data) {
        return null;
      }

      // Constant-time hash verification
      if (!timingSafeEqual(computedHash, data.tracking_secret_hash)) {
        return null;
      }

      // Return ONLY restricted public data
      return {
        reference_id: data.reference_id,
        issue_type: data.issue_type,
        area_name: data.area_name,
        description: data.description,
        status: data.status,
        created_at: data.created_at,
        status_history: (data.complaint_status_history || [])
          .map((h: any) => ({
            status: h.status,
            notes: h.notes,
            changed_at: h.changed_at,
          }))
          .sort((a: any, b: any) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime()),
      };
    }

    // --- Demo Mode ---
    const localComplaints: Complaint[] = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || '[]'
    );
    const localHistory: ComplaintStatusHistory[] = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    );

    const match = localComplaints.find(
      (c) => c.reference_id.toUpperCase() === cleanRef
    );

    if (!match) return null;

    // Verify secret hash
    if (!timingSafeEqual(computedHash, match.tracking_secret_hash)) {
      return null;
    }

    const complaintHistory = localHistory
      .filter((h) => h.complaint_id === match.id)
      .map((h) => ({
        status: h.status,
        notes: h.notes,
        changed_at: h.changed_at,
      }))
      .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

    return {
      reference_id: match.reference_id,
      issue_type: match.issue_type,
      area_name: match.area_name,
      description: match.description,
      status: match.status,
      created_at: match.created_at,
      status_history: complaintHistory,
    };
  },

  // -------------------------------------------------------------
  // Administrator Operations (Protected)
  // -------------------------------------------------------------
  async getAdminComplaints(): Promise<{
    complaints: Complaint[];
    history: ComplaintStatusHistory[];
  }> {
    if (isSupabaseConfigured() && supabase) {
      const { data: complaints, error: cErr } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (cErr) throw new Error(cErr.message);

      const { data: history, error: hErr } = await supabase
        .from('complaint_status_history')
        .select('*')
        .order('changed_at', { ascending: true });

      if (hErr) throw new Error(hErr.message);

      return { complaints: complaints || [], history: history || [] };
    }

    // Demo Mode
    const complaints: Complaint[] = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || '[]'
    );
    const history: ComplaintStatusHistory[] = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    );

    return { complaints, history };
  },

  async updateComplaintStatus(params: {
    complaintId: string;
    newStatus: ComplaintStatus;
    notes?: string;
    adminName: string;
  }): Promise<void> {
    const now = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      const { error: updErr } = await supabase
        .from('complaints')
        .update({ status: params.newStatus, updated_at: now })
        .eq('id', params.complaintId);

      if (updErr) throw new Error(updErr.message);

      const { error: histErr } = await supabase
        .from('complaint_status_history')
        .insert({
          complaint_id: params.complaintId,
          status: params.newStatus,
          notes: params.notes || null,
          changed_by: params.adminName,
          changed_at: now,
        });

      if (histErr) throw new Error(histErr.message);
      return;
    }

    // Demo Mode
    const localComplaints: Complaint[] = JSON.parse(
      localStorage.getItem(COMPLAINTS_KEY) || '[]'
    );
    const localHistory: ComplaintStatusHistory[] = JSON.parse(
      localStorage.getItem(HISTORY_KEY) || '[]'
    );

    const index = localComplaints.findIndex((c) => c.id === params.complaintId);
    if (index === -1) throw new Error('Complaint not found.');

    localComplaints[index].status = params.newStatus;
    localComplaints[index].updated_at = now;
    if (params.notes) {
      localComplaints[index].internal_notes = params.notes;
    }

    localHistory.unshift({
      id: `hist-${Date.now()}`,
      complaint_id: params.complaintId,
      status: params.newStatus,
      notes: params.notes || null,
      changed_by: params.adminName,
      changed_at: now,
    });

    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(localComplaints));
    localStorage.setItem(HISTORY_KEY, JSON.stringify(localHistory));
  },

  // -------------------------------------------------------------
  // Community Survey API
  // -------------------------------------------------------------
  async submitSurvey(response: Omit<SurveyResponse, 'id' | 'submitted_at'>): Promise<void> {
    const fullResponse: SurveyResponse = {
      ...response,
      id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submitted_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('community_surveys').insert(fullResponse);
      if (error) throw new Error(error.message);
      return;
    }

    // Demo Mode
    const localSurveys: SurveyResponse[] = JSON.parse(
      localStorage.getItem(SURVEYS_KEY) || '[]'
    );
    localSurveys.unshift(fullResponse);
    localStorage.setItem(SURVEYS_KEY, JSON.stringify(localSurveys));
  },

  async getSurveys(): Promise<SurveyResponse[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('community_surveys')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }

    return JSON.parse(localStorage.getItem(SURVEYS_KEY) || '[]');
  },

  // -------------------------------------------------------------
  // Feedback API
  // -------------------------------------------------------------
  async submitFeedback(feedback: Omit<FeedbackSubmission, 'id' | 'submitted_at'>): Promise<void> {
    const fullFeedback: FeedbackSubmission = {
      ...feedback,
      id: `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      submitted_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { error } = await supabase.from('feedback').insert(fullFeedback);
      if (error) throw new Error(error.message);
      return;
    }

    // Demo Mode
    const localFeedback: FeedbackSubmission[] = JSON.parse(
      localStorage.getItem(FEEDBACK_KEY) || '[]'
    );
    localFeedback.unshift(fullFeedback);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(localFeedback));
  },

  async getFeedback(): Promise<FeedbackSubmission[]> {
    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    }

    return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  },

  // -------------------------------------------------------------
  // Admin Session Management
  // -------------------------------------------------------------
  getAdminSession(): { email: string; role: string } | null {
    const sessionStr = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  setAdminSession(session: { email: string; role: string } | null): void {
    if (session) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  },

  clearAdminSession(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  },
};
