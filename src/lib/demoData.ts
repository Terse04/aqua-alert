import type { Complaint, ComplaintStatusHistory, SurveyResponse, FeedbackSubmission } from '@/types';
import { hashTrackingSecret } from '@/lib/crypto';

// Default demo tracking secrets for pre-seeded complaints:
// Reference: AQA-2024-WAG01 -> Secret: TRK-WAG1-DEMO
// Reference: AQA-2024-BAIF2 -> Secret: TRK-BAIF-DEMO
// Reference: AQA-2024-OVR03 -> Secret: TRK-TANK-DEMO

export async function getInitialDemoComplaints(): Promise<{
  complaints: Complaint[];
  history: ComplaintStatusHistory[];
}> {
  const hash1 = await hashTrackingSecret('TRK-WAG1-DEMO');
  const hash2 = await hashTrackingSecret('TRK-BAIF-DEMO');
  const hash3 = await hashTrackingSecret('TRK-TANK-DEMO');
  const hash4 = await hashTrackingSecret('TRK-PIPE-DEMO');

  const complaints: Complaint[] = [
    {
      id: 'demo-cmp-1',
      reference_id: 'AQA-2024-WAG01',
      tracking_secret_hash: hash1,
      issue_type: 'Pipeline Leakage',
      area_name: 'Near Wagheshwar Temple, Nagar Road, Wagholi',
      latitude: 18.5793,
      longitude: 73.9812,
      description: 'Major underground pipeline rupture visible along the roadside footpath. Clean drinking water has been gushing out continuously during morning supply hours for 3 days.',
      photo_url: null,
      status: 'In Progress',
      created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      internal_notes: 'Inspected by community volunteer team. Noted during morning survey walk. Repair notice prepared for local water tanker/pipeline vendor.',
      reporter_contact: 'Local Resident (Nagar Rd)',
    },
    {
      id: 'demo-cmp-2',
      reference_id: 'AQA-2024-BAIF2',
      tracking_secret_hash: hash2,
      issue_type: 'Broken Tap',
      area_name: 'BAIF Road, Near Primary School, Wagholi',
      latitude: 18.5835,
      longitude: 73.9854,
      description: 'Community public standpost tap broken at the valve joint. Water leaks constantly whenever overhead supply line pressure is active.',
      photo_url: null,
      status: 'Resolved',
      created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      internal_notes: 'Community volunteer replaced the broken brass valve with assistance from local society maintenance team.',
      reporter_contact: 'School Gatekeeper',
    },
    {
      id: 'demo-cmp-3',
      reference_id: 'AQA-2024-OVR03',
      tracking_secret_hash: hash3,
      issue_type: 'Tank Overflow',
      area_name: 'Domkhel Road, Wagholi Residential Cluster',
      latitude: 18.5861,
      longitude: 73.9789,
      description: 'Commercial building overhead storage tank overflowing for over 45 minutes every evening between 6 PM and 7 PM. Water floods the lane.',
      photo_url: null,
      status: 'Under Review',
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
      internal_notes: 'Visited site; spoken to building security guard regarding installing an automatic float ball valve.',
      reporter_contact: 'Society Secretary',
    },
    {
      id: 'demo-cmp-4',
      reference_id: 'AQA-2024-PIPE4',
      tracking_secret_hash: hash4,
      issue_type: 'Pipeline Leakage',
      area_name: 'Ivy Estate Road, Wagholi',
      latitude: 18.5912,
      longitude: 73.9921,
      description: 'Slow seepage from sub-surface valve junction causing muddy water stagnation and wastage.',
      photo_url: null,
      status: 'Pending',
      created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 3600000).toISOString(),
      internal_notes: 'Newly reported by resident. Pending physical verification on upcoming weekend field drive.',
      reporter_contact: null,
    },
  ];

  const history: ComplaintStatusHistory[] = [
    {
      id: 'hist-1-1',
      complaint_id: 'demo-cmp-1',
      status: 'Pending',
      notes: 'Initial community report submitted via AquaAlert portal.',
      changed_by: 'Citizen Reporter',
      changed_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'hist-1-2',
      complaint_id: 'demo-cmp-1',
      status: 'Under Review',
      notes: 'CEP student team verified location during morning survey.',
      changed_by: 'CEP Admin Team',
      changed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'hist-1-3',
      complaint_id: 'demo-cmp-1',
      status: 'In Progress',
      notes: 'Notified local maintenance committee and valve mechanic.',
      changed_by: 'CEP Admin Team',
      changed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'hist-2-1',
      complaint_id: 'demo-cmp-2',
      status: 'Pending',
      notes: 'Reported by local resident near primary school.',
      changed_by: 'Citizen Reporter',
      changed_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'hist-2-2',
      complaint_id: 'demo-cmp-2',
      status: 'In Progress',
      notes: 'New replacement tap washer procured.',
      changed_by: 'CEP Admin Team',
      changed_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'hist-2-3',
      complaint_id: 'demo-cmp-2',
      status: 'Resolved',
      notes: 'Tap replaced and water leakage stopped completely.',
      changed_by: 'CEP Admin Team',
      changed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'hist-3-1',
      complaint_id: 'demo-cmp-3',
      status: 'Pending',
      notes: 'Report logged for tank overflow on Domkhel Rd.',
      changed_by: 'Citizen Reporter',
      changed_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'hist-3-2',
      complaint_id: 'demo-cmp-3',
      status: 'Under Review',
      notes: 'Contacted building secretary to inspect the overflow float sensor.',
      changed_by: 'CEP Admin Team',
      changed_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'hist-4-1',
      complaint_id: 'demo-cmp-4',
      status: 'Pending',
      notes: 'Report registered through AquaAlert.',
      changed_by: 'Citizen Reporter',
      changed_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    },
  ];

  return { complaints, history };
}

export function getInitialDemoSurveys(): SurveyResponse[] {
  return [
    {
      id: 'srv-1',
      locality: 'Nagar Road / Wagholi Central',
      shortage_frequency: 'Several times a week',
      primary_source: 'Private Water Tanker',
      conservation_awareness: 'Moderate',
      leakage_experienced: 'Frequently in my lane',
      willingness_to_use_app: 'Very Likely',
      submitted_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: 'srv-2',
      locality: 'BAIF Road',
      shortage_frequency: 'Daily',
      primary_source: 'Groundwater / Borewell',
      conservation_awareness: 'Basic',
      leakage_experienced: 'Occasionally',
      willingness_to_use_app: 'Very Likely',
      submitted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    },
    {
      id: 'srv-3',
      locality: 'Domkhel Road',
      shortage_frequency: 'Several times a week',
      primary_source: 'Private Water Tanker',
      conservation_awareness: 'Moderate',
      leakage_experienced: 'Frequently in my lane',
      willingness_to_use_app: 'Likely',
      submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'srv-4',
      locality: 'Ivy Estate Area',
      shortage_frequency: 'Weekly',
      primary_source: 'Municipal Pipeline',
      conservation_awareness: 'High',
      leakage_experienced: 'Occasionally',
      willingness_to_use_app: 'Very Likely',
      submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'srv-5',
      locality: 'Kesnand Road',
      shortage_frequency: 'Daily',
      primary_source: 'Private Water Tanker',
      conservation_awareness: 'Basic',
      leakage_experienced: 'Frequently in my lane',
      willingness_to_use_app: 'Likely',
      submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
    {
      id: 'srv-6',
      locality: 'Wagholi Village Gaothan',
      shortage_frequency: 'Several times a week',
      primary_source: 'Well / Community Source',
      conservation_awareness: 'Moderate',
      leakage_experienced: 'Occasionally',
      willingness_to_use_app: 'Very Likely',
      submitted_at: new Date(Date.now() - 10 * 3600000).toISOString(),
    },
  ];
}

export function getInitialDemoFeedback(): FeedbackSubmission[] {
  return [
    {
      id: 'fb-1',
      category: 'Leakage Reporting',
      rating: 5,
      comments: 'The two-step tracking code without account login is very convenient for elderly residents in our society.',
      contact_info: 'Society Member, Wagholi',
      submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'fb-2',
      category: 'Calculator Accuracy',
      rating: 4,
      comments: 'The water calculator gave our family a realistic perspective on how much we lose during shower bathing vs bucket bathing.',
      contact_info: null,
      submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'fb-3',
      category: 'Awareness Content',
      rating: 5,
      comments: 'Detailed explanation about rainwater harvesting and Wagholi groundwater depletion was very helpful for our college CEP activity.',
      contact_info: 'IT Dept Student',
      submitted_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    },
  ];
}
