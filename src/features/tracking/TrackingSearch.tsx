import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataService } from '@/lib/storage';
import { TrackingResult } from './TrackingResult';
import type { PublicComplaintDetails } from '@/types';
import {
  Search,
  KeyRound,
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const TrackingSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlRef = searchParams.get('ref') || '';

  const [referenceId, setReferenceId] = useState(urlRef);
  const [trackingSecret, setTrackingSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicComplaintDetails | null>(null);

  useEffect(() => {
    if (urlRef) {
      setReferenceId(urlRef);
    }
  }, [urlRef]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      setError('Please enter your Complaint Reference ID.');
      return;
    }
    if (!trackingSecret.trim()) {
      setError('Please enter your Private Tracking Secret Code.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await DataService.trackComplaint(
        referenceId.trim(),
        trackingSecret.trim()
      );

      if (!data) {
        setError(
          'Verification failed. Please check both the Complaint Reference ID and your Secret Code. Both are case-insensitive.'
        );
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      console.error('Tracking query error:', err);
      setError(err.message || 'An error occurred while looking up this complaint.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (ref: string, secret: string) => {
    setReferenceId(ref);
    setTrackingSecret(secret);
    setError(null);
  };

  if (result) {
    return (
      <TrackingResult
        details={result}
        onTrackAnother={() => {
          setResult(null);
          setTrackingSecret('');
          setError(null);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-10 max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2 border-b border-gray-100 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#087EBC] flex items-center justify-center mx-auto mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
          Track Leakage Complaint
        </h2>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Enter your unique reference ID and private secret code received during submission to check real-time progress.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-5">
        <div>
          <label htmlFor="refId" className="block text-sm font-semibold text-[#103B54] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#087EBC]" />
            <span>Complaint Reference ID</span>
          </label>
          <input
            id="refId"
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            placeholder="e.g., AQA-2024-WAG01"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-sm uppercase text-[#103B54] focus:border-[#087EBC] focus:ring-2 focus:ring-[#087EBC]/10 focus:outline-hidden"
          />
        </div>

        <div>
          <label htmlFor="trackSecret" className="block text-sm font-semibold text-[#103B54] mb-1.5 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Private Tracking Secret Code</span>
          </label>
          <input
            id="trackSecret"
            type="text"
            value={trackingSecret}
            onChange={(e) => setTrackingSecret(e.target.value)}
            placeholder="e.g., TRK-WAG1-DEMO"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 font-mono text-sm uppercase text-[#103B54] focus:border-[#087EBC] focus:ring-2 focus:ring-[#087EBC]/10 focus:outline-hidden"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying Credentials...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Track Complaint Status</span>
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Helper Pill */}
      <div className="pt-4 border-t border-gray-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1 font-semibold text-[#103B54]">
            <Sparkles className="w-3.5 h-3.5 text-[#087EBC]" />
            Try Pre-seeded Demo Complaints:
          </span>
          <span className="text-[11px] text-gray-400">Click to autofill</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('AQA-2024-WAG01', 'TRK-WAG1-DEMO')}
            className="text-left p-2.5 rounded-xl border border-gray-200 hover:border-[#087EBC] hover:bg-sky-50/50 transition-colors text-xs"
          >
            <p className="font-mono font-bold text-[#103B54]">AQA-2024-WAG01</p>
            <p className="text-[11px] text-gray-500">Nagar Road (In Progress)</p>
          </button>

          <button
            type="button"
            onClick={() => handleFillDemo('AQA-2024-BAIF2', 'TRK-BAIF-DEMO')}
            className="text-left p-2.5 rounded-xl border border-gray-200 hover:border-[#087EBC] hover:bg-sky-50/50 transition-colors text-xs"
          >
            <p className="font-mono font-bold text-[#103B54]">AQA-2024-BAIF2</p>
            <p className="text-[11px] text-gray-500">BAIF Road (Resolved)</p>
          </button>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#13B8A6] shrink-0" />
        <span>
          To prevent ID enumeration and scraper bots, complaint status is protected behind SHA-256 cryptographic hashes.
        </span>
      </div>
    </div>
  );
};
