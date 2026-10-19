export type ComplaintStatus = 'Pending' | 'Under Review' | 'In Progress' | 'Resolved';

export type IssueType = 'Pipeline Leakage' | 'Broken Tap' | 'Tank Overflow' | 'Other';

export interface Complaint {
  id: string;
  reference_id: string; // e.g. AQA-2024-WAG78
  tracking_secret_hash: string;
  issue_type: IssueType;
  area_name: string; // e.g. "Kalyani Nagar Road, Wagholi"
  latitude?: number | null;
  longitude?: number | null;
  description: string;
  photo_url?: string | null;
  status: ComplaintStatus;
  created_at: string;
  updated_at: string;
  internal_notes?: string | null;
  reporter_contact?: string | null;
}

export interface ComplaintStatusHistory {
  id: string;
  complaint_id: string;
  status: ComplaintStatus;
  notes?: string | null;
  changed_by: string;
  changed_at: string;
}

export interface PublicComplaintDetails {
  reference_id: string;
  issue_type: IssueType;
  area_name: string;
  description: string;
  status: ComplaintStatus;
  created_at: string;
  status_history: Array<{
    status: ComplaintStatus;
    notes?: string | null;
    changed_at: string;
  }>;
}

export interface SurveyResponse {
  id: string;
  shortage_frequency: 'Daily' | 'Several times a week' | 'Weekly' | 'Rarely' | 'Never';
  primary_source: 'Municipal Pipeline' | 'Groundwater / Borewell' | 'Private Water Tanker' | 'Well / Community Source' | 'Other';
  conservation_awareness: 'High' | 'Moderate' | 'Basic' | 'None';
  leakage_experienced: 'Frequently in my lane' | 'Occasionally' | 'Rarely' | 'Never noticed';
  willingness_to_use_app: 'Very Likely' | 'Likely' | 'Neutral' | 'Unlikely';
  locality: string;
  submitted_at: string;
}

export interface FeedbackSubmission {
  id: string;
  category: 'Platform Experience' | 'Leakage Reporting' | 'Calculator Accuracy' | 'Awareness Content' | 'General Suggestion';
  rating: number; // 1 to 5
  comments: string;
  contact_info?: string | null;
  submitted_at: string;
}

export interface CalculatorInputs {
  householdMembers: number;
  bathingMinutes: number;
  bathType: 'bucket' | 'shower';
  laundryLoadsPerWeek: number;
  washingUtensilsMinutes: number;
  toiletFlushesPerPersonPerDay: number;
  toiletType: 'dual' | 'standard';
  cleaningLitresPerDay: number;
  otherDailyLitres: number;
}

export interface CalculatorBreakdownItem {
  category: string;
  dailyLitres: number;
  monthlyLitres: number;
  percentage: number;
  color: string;
  tip: string;
}

export interface CalculatorSummary {
  dailyTotal: number;
  monthlyTotal: number;
  perPersonDaily: number;
  breakdown: CalculatorBreakdownItem[];
  topContributors: CalculatorBreakdownItem[];
  tips: string[];
}
