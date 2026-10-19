import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  PlusCircle,
  AlertTriangle,
  KeyRound,
  FileText,
  Shield,
} from 'lucide-react';

interface ReportSuccessModalProps {
  referenceId: string;
  trackingSecret: string;
  onReset: () => void;
}

export const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  referenceId,
  trackingSecret,
  onReset,
}) => {
  const navigate = useNavigate();
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceId);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleCopySecret = () => {
    navigator.clipboard.writeText(trackingSecret);
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  const handleGoToTracking = () => {
    // Navigate to tracking page with pre-filled reference query parameter
    navigate(`/track?ref=${encodeURIComponent(referenceId)}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 max-w-2xl mx-auto text-left space-y-6">
      {/* Success Badge */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Report Submitted Successfully
          </span>
          <h2 className="text-2xl font-extrabold text-[#103B54] mt-1 font-['Plus_Jakarta_Sans',sans-serif]">
            Water Incident Registered
          </h2>
        </div>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">
        Thank you for being an active community steward. Your report has been logged and assigned to the local Wagholi CEP volunteer team for verification.
      </p>

      {/* Security Credentials Container */}
      <div className="p-5 rounded-2xl bg-[#F5F9FB] border border-gray-200/80 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#103B54] uppercase tracking-wider">
          <Shield className="w-4 h-4 text-[#087EBC]" />
          <span>Save Your Private Tracking Credentials</span>
        </div>

        {/* Reference ID Block */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <FileText className="w-3 h-3 text-[#087EBC]" />
              Complaint Reference ID
            </span>
            <p className="text-lg sm:text-xl font-mono font-bold text-[#103B54] truncate">
              {referenceId}
            </p>
          </div>
          <button
            onClick={handleCopyRef}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#087EBC] bg-sky-50 hover:bg-sky-100 transition-colors shrink-0"
          >
            {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedRef ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Private Tracking Secret Block */}
        <div className="p-4 bg-white rounded-xl border border-amber-200/80 bg-amber-50/20 flex items-center justify-between gap-3 shadow-xs">
          <div className="space-y-0.5 min-w-0">
            <span className="text-[11px] font-medium text-amber-700 uppercase tracking-wide flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-600" />
              Private Tracking Secret Code
            </span>
            <p className="text-lg sm:text-xl font-mono font-bold text-amber-900 truncate">
              {trackingSecret}
            </p>
          </div>
          <button
            onClick={handleCopySecret}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 transition-colors shrink-0"
          >
            {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSecret ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Important:</strong> To protect citizen privacy, our public tracking interface requires <em>both</em> the Reference ID and your Secret Code. We store only a one-way cryptographic hash of this code and cannot retrieve it if lost.
          </p>
        </div>
      </div>

      {/* CEP Academic Disclaimer */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <strong>Academic Project Notice:</strong> AquaAlert is a student-developed Community Engagement Project. Submitting a report does not guarantee municipal repair action.
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onReset}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Another Report</span>
        </button>

        <button
          onClick={handleGoToTracking}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/10 transition-all"
        >
          <Search className="w-4 h-4" />
          <span>Track This Complaint Now</span>
        </button>
      </div>
    </div>
  );
};
