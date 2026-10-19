import { describe, it, expect, beforeEach } from 'vitest';

// Lightweight in-memory localStorage mock for node test runner
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value.toString();
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    for (const key in store) {
      delete store[key];
    }
  },
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

import { DataService } from '../lib/storage';

describe('DataService Offline & Local Storage Persistence', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('submits a new complaint, generates reference and secret, and allows tracking', async () => {
    const { referenceId, trackingSecret } = await DataService.submitComplaint({
      issueType: 'Broken Tap',
      areaName: 'Lane 3, Wagholi Central',
      description: 'Public tap valve is broken and dripping continuously.',
    });

    expect(referenceId).toBeDefined();
    expect(trackingSecret).toBeDefined();

    // 1. Valid tracking query
    const result = await DataService.trackComplaint(referenceId, trackingSecret);
    expect(result).not.toBeNull();
    expect(result?.reference_id).toBe(referenceId);
    expect(result?.issue_type).toBe('Broken Tap');
    expect(result?.status).toBe('Pending');
    expect(result?.status_history.length).toBeGreaterThanOrEqual(1);

    // 2. Invalid tracking code must fail
    const invalidResult = await DataService.trackComplaint(referenceId, 'WRONG-SECRET-CODE');
    expect(invalidResult).toBeNull();
  });

  it('allows authorized administrators to update complaint status and logs audit entry', async () => {
    const { referenceId, trackingSecret } = await DataService.submitComplaint({
      issueType: 'Tank Overflow',
      areaName: 'Building B Parapet',
      description: 'Overhead tank sensor failed.',
    });

    const { complaints } = await DataService.getAdminComplaints();
    const target = complaints.find((c) => c.reference_id === referenceId);
    expect(target).toBeDefined();

    await DataService.updateComplaintStatus({
      complaintId: target!.id,
      newStatus: 'In Progress',
      notes: 'Volunteer contacted maintenance team.',
      adminName: 'Lead Coordinator',
    });

    // Verify updated status in public tracking view
    const updated = await DataService.trackComplaint(referenceId, trackingSecret);
    expect(updated?.status).toBe('In Progress');
    expect(updated?.status_history.some((h) => h.status === 'In Progress')).toBe(true);
  });

  it('persists community surveys and feedback submissions', async () => {
    await DataService.submitSurvey({
      locality: 'BAIF Road Cluster',
      shortage_frequency: 'Daily',
      primary_source: 'Private Water Tanker',
      conservation_awareness: 'Moderate',
      leakage_experienced: 'Occasionally',
      willingness_to_use_app: 'Very Likely',
    });

    const surveys = await DataService.getSurveys();
    expect(surveys.length).toBeGreaterThanOrEqual(1);
    expect(surveys[0].locality).toBe('BAIF Road Cluster');

    await DataService.submitFeedback({
      category: 'Leakage Reporting',
      rating: 5,
      comments: 'Very easy to report without entering a password.',
    });

    const feedback = await DataService.getFeedback();
    expect(feedback.length).toBeGreaterThanOrEqual(1);
    expect(feedback[0].rating).toBe(5);
  });
});
