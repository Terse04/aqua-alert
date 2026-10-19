import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { DataService } from '@/lib/storage';
import { LocationPicker } from '@/components/map/LocationPicker';
import { ReportSuccessModal } from './ReportSuccessModal';
import type { IssueType } from '@/types';
import {
  Upload,
  X,
  AlertCircle,
  Loader2,
  Send,
  Droplet,
  Info,
} from 'lucide-react';

const reportSchema = z.object({
  issueType: z.enum(['Pipeline Leakage', 'Broken Tap', 'Tank Overflow', 'Other']),
  areaName: z
    .string()
    .min(4, 'Location/Area must be at least 4 characters.')
    .max(120, 'Location is too long (maximum 120 characters).'),
  description: z
    .string()
    .min(10, 'Please provide a clear description (at least 10 characters).')
    .max(600, 'Description cannot exceed 600 characters.'),
  reporterContact: z.string().max(80).optional(),
});

export const ReportForm: React.FC = () => {
  const [issueType, setIssueType] = useState<IssueType>('Pipeline Leakage');
  const [areaName, setAreaName] = useState('');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [latitude, setLatitude] = useState<number | null>(18.5793);
  const [longitude, setLongitude] = useState<number | null>(73.9812);

  // Photo state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    referenceId: string;
    trackingSecret: string;
  } | null>(null);

  const issueTypes: { value: IssueType; label: string; desc: string }[] = [
    {
      value: 'Pipeline Leakage',
      label: 'Pipeline Leakage',
      desc: 'Burst, cracked, or leaking underground / roadside distribution pipe.',
    },
    {
      value: 'Broken Tap',
      label: 'Broken Standpost / Tap',
      desc: 'Public drinking standpost valve broken or leaking continuously.',
    },
    {
      value: 'Tank Overflow',
      label: 'Tank Overflow',
      desc: 'Overhead society or commercial water tank overflowing wastefully.',
    },
    {
      value: 'Other',
      label: 'Other Wastage',
      desc: 'Unattended hose, construction water loss, or valve leakage.',
    },
  ];

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Photo size exceeds 5 MB. Please upload a smaller image.',
      }));
      return;
    }

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Unsupported format. Please upload JPEG, PNG, or WebP.',
      }));
      return;
    }

    setPhotoFile(file);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrors({});
    setGeneralError(null);

    // Zod validation
    const result = reportSchema.safeParse({
      issueType,
      areaName: areaName.trim(),
      description: description.trim(),
      reporterContact: reporterContact.trim() || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() || 'general';
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setSubmitting(true);
      const res = await DataService.submitComplaint({
        issueType,
        areaName: areaName.trim(),
        description: description.trim(),
        latitude,
        longitude,
        photoFile,
        reporterContact: reporterContact.trim() || null,
      });

      setSuccessData({
        referenceId: res.referenceId,
        trackingSecret: res.trackingSecret,
      });
    } catch (err: any) {
      console.error('Submission failed:', err);
      setGeneralError(
        err.message || 'Failed to submit report. Please check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setIssueType('Pipeline Leakage');
    setAreaName('');
    setDescription('');
    setReporterContact('');
    setPhotoFile(null);
    setPhotoPreview(null);
    setErrors({});
    setGeneralError(null);
    setSuccessData(null);
  };

  if (successData) {
    return (
      <ReportSuccessModal
        referenceId={successData.referenceId}
        trackingSecret={successData.trackingSecret}
        onReset={handleResetForm}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-10 max-w-3xl mx-auto">
      {/* Form Header */}
      <div className="mb-8 border-b border-gray-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC] mb-3">
          <Droplet className="w-3.5 h-3.5 fill-[#087EBC]/30" />
          <span>Community Leakage Dispatch Form</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Report Water Leakage or Wastage
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Provide accurate details about the leakage. Your report helps our CEP student team and housing society maintenance address the loss quickly.
        </p>
      </div>

      {generalError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{generalError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Issue Type */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#103B54]">
            1. Select Issue Type <span className="text-rose-500">*</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {issueTypes.map((item) => {
              const selected = issueType === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setIssueType(item.value)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selected
                      ? 'border-[#087EBC] bg-[#E9F8F7]/50 shadow-xs ring-2 ring-[#087EBC]/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#103B54]">{item.label}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selected
                          ? 'border-[#087EBC] bg-[#087EBC]'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </button>
              );
            })}
          </div>
          {errors.issueType && (
            <p className="text-xs text-rose-600">{errors.issueType}</p>
          )}
        </div>

        {/* Section 2: Location and Area */}
        <div className="space-y-4">
          <div>
            <label htmlFor="areaName" className="block text-sm font-semibold text-[#103B54] mb-1">
              2. Incident Location / Landmark <span className="text-rose-500">*</span>
            </label>
            <input
              id="areaName"
              type="text"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="e.g., Near Wagheshwar Temple, Nagar Road, Wagholi"
              maxLength={120}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-[#103B54] focus:outline-hidden transition-colors ${
                errors.areaName
                  ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                  : 'border-gray-300 focus:border-[#087EBC] focus:ring-2 focus:ring-[#087EBC]/10'
              }`}
            />
            {errors.areaName ? (
              <p className="text-xs text-rose-600 mt-1">{errors.areaName}</p>
            ) : (
              <p className="text-xs text-gray-400 mt-1">
                Mention street name, society gate, or noticeable landmark in Wagholi.
              </p>
            )}
          </div>

          {/* Map Pinning Component */}
          <LocationPicker
            initialLat={latitude}
            initialLng={longitude}
            onLocationChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>

        {/* Section 3: Problem Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="description" className="block text-sm font-semibold text-[#103B54]">
              3. Problem Description <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-gray-400">{description.length}/600</span>
          </div>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the intensity of the water leak, how long it has been running, and if clean drinking water or tank water is being lost..."
            maxLength={600}
            className={`w-full px-4 py-3 rounded-xl border text-sm text-[#103B54] focus:outline-hidden transition-colors ${
              errors.description
                ? 'border-rose-300 focus:border-rose-500 bg-rose-50/20'
                : 'border-gray-300 focus:border-[#087EBC] focus:ring-2 focus:ring-[#087EBC]/10'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 mt-1">{errors.description}</p>
          )}
        </div>

        {/* Section 4: Photograph Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-[#103B54]">
            4. Upload Photograph (Recommended)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoSelect}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          {!photoPreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-[#087EBC] rounded-2xl p-6 text-center cursor-pointer bg-[#F5F9FB] hover:bg-[#E9F8F7]/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white text-[#087EBC] flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-[#103B54]">
                Click or drag to upload incident photo
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPEG, PNG, or WebP up to 5 MB
              </p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-black/5 p-2 max-w-sm">
              <img
                src={photoPreview}
                alt="Complaint preview"
                className="w-full h-48 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-2 flex items-center justify-between px-2">
                <span className="text-xs text-gray-600 truncate">
                  {photoFile?.name || 'Uploaded photo'}
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#087EBC] hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          )}
          {errors.photo && <p className="text-xs text-rose-600">{errors.photo}</p>}
        </div>

        {/* Section 5: Optional Contact Field */}
        <div>
          <label htmlFor="reporterContact" className="block text-sm font-semibold text-[#103B54] mb-1">
            5. Optional Contact Note / Name
          </label>
          <input
            id="reporterContact"
            type="text"
            value={reporterContact}
            onChange={(e) => setReporterContact(e.target.value)}
            placeholder="e.g., Local Resident (Lane 4) or Society Member"
            maxLength={80}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
          />
          <p className="text-xs text-gray-400 mt-1">
            Optional. You do not need to share a phone number or full name.
          </p>
        </div>

        {/* Privacy & Academic Notice */}
        <div className="p-4 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/30 text-xs text-[#103B54] space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <Info className="w-4 h-4 text-[#087EBC]" />
            <span>Community Privacy Guarantee</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            AquaAlert does not create public profile pages or expose personal information. Tracking requires your private tracking secret code which is displayed upon submission.
          </p>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting Report...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Leakage Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
