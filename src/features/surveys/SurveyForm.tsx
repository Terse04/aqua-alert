import React, { useState } from 'react';
import { DataService } from '@/lib/storage';
import {
  Users,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import type { SurveyResponse } from '@/types';

interface SurveyFormProps {
  onSubmitted: () => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmitted }) => {
  const [locality, setLocality] = useState('');
  const [shortageFrequency, setShortageFrequency] = useState<SurveyResponse['shortage_frequency']>('Several times a week');
  const [primarySource, setPrimarySource] = useState<SurveyResponse['primary_source']>('Private Water Tanker');
  const [conservationAwareness, setConservationAwareness] = useState<SurveyResponse['conservation_awareness']>('Moderate');
  const [leakageExperienced, setLeakageExperienced] = useState<SurveyResponse['leakage_experienced']>('Frequently in my lane');
  const [willingness, setWillingness] = useState<SurveyResponse['willingness_to_use_app']>('Very Likely');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);
      setError(null);

      await DataService.submitSurvey({
        locality: locality.trim() || 'Wagholi Resident',
        shortage_frequency: shortageFrequency,
        primary_source: primarySource,
        conservation_awareness: conservationAwareness,
        leakage_experienced: leakageExperienced,
        willingness_to_use_app: willingness,
      });

      setSubmitted(true);
      onSubmitted();
    } catch (err: any) {
      console.error('Survey submission error:', err);
      setError(err.message || 'Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-emerald-200/80 shadow-md text-center space-y-4 max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-[#103B54]">
          Survey Response Recorded
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Thank you! Your anonymous inputs have been incorporated into the community water analytics charts below.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="px-4 py-2 text-xs font-semibold text-[#087EBC] bg-sky-50 rounded-xl hover:bg-sky-100 transition-colors"
        >
          Submit Another Response
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md max-w-2xl mx-auto">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC] mb-2">
          <Users className="w-3.5 h-3.5" />
          <span>Wagholi Field Research</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#103B54] font-['Plus_Jakarta_Sans',sans-serif]">
          Community Water Survey
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Share your household’s water experience to help our CEP engineering team quantify localized scarcity patterns.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Q1: Locality */}
        <div>
          <label htmlFor="locality" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1.5">
            1. Housing Society / Locality in Wagholi (Optional)
          </label>
          <input
            id="locality"
            type="text"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            placeholder="e.g., Ivy Estate, BAIF Road, or Domkhel Road"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden"
          />
        </div>

        {/* Q2: Water Shortage Frequency */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-2">
            2. How frequently does your household experience water shortages?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {(['Daily', 'Several times a week', 'Weekly', 'Rarely', 'Never'] as const).map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  shortageFrequency === opt
                    ? 'border-[#087EBC] bg-[#E9F8F7]/50 font-semibold text-[#103B54]'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="shortage"
                  checked={shortageFrequency === opt}
                  onChange={() => setShortageFrequency(opt)}
                  className="accent-[#087EBC]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q3: Main Water Supply Source */}
        <div>
          <label htmlFor="primarySource" className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-1.5">
            3. What is your primary household water source?
          </label>
          <select
            id="primarySource"
            value={primarySource}
            onChange={(e) => setPrimarySource(e.target.value as any)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm text-[#103B54] focus:border-[#087EBC] focus:outline-hidden bg-white"
          >
            <option value="Private Water Tanker">Private Water Tanker (Societies / Residential)</option>
            <option value="Groundwater / Borewell">Groundwater / Borewell</option>
            <option value="Municipal Pipeline">Municipal Pipeline (PMC / Gram Panchayat Line)</option>
            <option value="Well / Community Source">Open Well / Community Standpost</option>
            <option value="Other">Other Alternative Source</option>
          </select>
        </div>

        {/* Q4: Awareness Level */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-2">
            4. How would you rate your awareness of water conservation methods (RWH, Aerators)?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            {(['High', 'Moderate', 'Basic', 'None'] as const).map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setConservationAwareness(opt)}
                className={`py-2.5 px-3 rounded-xl border font-medium transition-all ${
                  conservationAwareness === opt
                    ? 'border-[#087EBC] bg-[#087EBC] text-white shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q5: Leakage Encountered */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-2">
            5. Have you observed untreated pipeline leaks or tank overflows in your area?
          </label>
          <div className="space-y-1.5 text-xs text-gray-700">
            {(['Frequently in my lane', 'Occasionally', 'Rarely', 'Never noticed'] as const).map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer ${
                  leakageExperienced === opt
                    ? 'border-[#087EBC] bg-sky-50/50 font-semibold text-[#103B54]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="leakage"
                  checked={leakageExperienced === opt}
                  onChange={() => setLeakageExperienced(opt)}
                  className="accent-[#087EBC]"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Q6: Willingness to use AquaAlert */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#103B54] mb-2">
            6. How willing are you to report water leaks using AquaAlert?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            {(['Very Likely', 'Likely', 'Neutral', 'Unlikely'] as const).map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setWillingness(opt)}
                className={`py-2 px-3 rounded-xl border font-medium transition-all ${
                  willingness === opt
                    ? 'border-[#13B8A6] bg-[#13B8A6] text-white shadow-xs'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>100% Anonymous:</strong> Submissions are aggregated for academic research. No personal phone numbers or identifiers are collected.
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 disabled:opacity-50 transition-all active:scale-[0.99]"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Anonymous Response...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Anonymous Survey</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
