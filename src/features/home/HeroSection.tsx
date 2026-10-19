import React from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Calculator,
  Search,
  Droplet,
  MapPin,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-white via-[#E9F8F7]/30 to-[#F5F9FB]">
      {/* Decorative environmental wave shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#13B8A6]/20 to-[#087EBC]/20 blur-3xl" />
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-[#087EBC]/15 to-[#65A878]/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Student CEP Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E9F8F7] border border-[#13B8A6]/30 text-xs font-semibold text-[#103B54] shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#13B8A6]" />
              <MapPin className="w-3.5 h-3.5 text-[#087EBC]" />
              <span>Student Community Engagement Project (CEP) • Wagholi, Pune</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#103B54] tracking-tight leading-[1.15] font-['Plus_Jakarta_Sans',sans-serif]">
              Every Drop Matters —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#087EBC] to-[#13B8A6]">
                Report Leaks, Save Water.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#263746]/85 max-w-2xl leading-relaxed">
              Water scarcity affects hundreds of households across our community. AquaAlert empowers residents in Wagholi to report road and standpost water wastage, calculate household consumption, and practice sustainable conservation.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#087EBC] to-[#13B8A6] hover:opacity-95 shadow-md shadow-cyan-900/15 hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Report Water Leakage</span>
              </Link>

              <Link
                to="/calculator"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-[#103B54] bg-white border border-gray-200/90 hover:bg-gray-50 hover:border-gray-300 shadow-xs transition-all active:scale-[0.99]"
              >
                <Calculator className="w-5 h-5 text-[#087EBC]" />
                <span>Calculate Water Usage</span>
              </Link>

              <Link
                to="/track"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-600 hover:text-[#087EBC] transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Track Report</span>
              </Link>
            </div>

            {/* Micro Benefits Bar */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6]" />
                No login required for citizens
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6]" />
                Private tracking code
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6]" />
                Household benchmark calculator
              </span>
            </div>
          </div>

          {/* Right Column: Custom Environmental Visual Composition */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Card with Water Drop Composition */}
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-7 border border-white/80 shadow-xl shadow-cyan-950/5 space-y-6">
                {/* Header of composition card */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#E9F8F7] flex items-center justify-center text-[#087EBC]">
                      <Droplet className="w-5 h-5 fill-[#087EBC]/30" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-[#103B54]">Community Pulse</h2>
                      <p className="text-[11px] text-gray-500">Wagholi Water Watch</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Active Initiative
                  </span>
                </div>

                {/* Illustrated SVG Drop & Water Flow Composition */}
                <div className="relative py-4 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#103B54] via-[#087EBC] to-[#13B8A6] flex items-center justify-center shadow-lg shadow-cyan-900/20 relative group">
                    {/* Concentric pulse rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#13B8A6]/40 animate-ping opacity-30" />
                    <div className="absolute -inset-3 rounded-full border border-[#087EBC]/30" />
                    {/* Inner Droplet Icon */}
                    <Droplet className="w-16 h-16 text-white fill-white/90 filter drop-shadow-md" />
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#F5F9FB] border border-gray-100">
                    <p className="text-[11px] font-medium text-gray-500">Target Community</p>
                    <p className="text-sm font-bold text-[#103B54] mt-0.5">Wagholi, Pune</p>
                    <span className="text-[10px] text-[#087EBC]">Borewell & Tanker reliant</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#F5F9FB] border border-gray-100">
                    <p className="text-[11px] font-medium text-gray-500">Urban Benchmark</p>
                    <p className="text-sm font-bold text-[#103B54] mt-0.5">135 L / person</p>
                    <span className="text-[10px] text-emerald-700">CPHEEO guideline</span>
                  </div>
                </div>

                {/* Notice */}
                <div className="text-center pt-1">
                  <p className="text-[11px] text-gray-500 italic">
                    “Conserving 1 bucket (~18 litres) per household daily saves over 21,000 litres annually.”
                  </p>
                </div>
              </div>

              {/* Floating Pill Accent 1 */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-gray-100 shadow-md flex items-center gap-2 text-xs font-semibold text-[#103B54]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#13B8A6]" />
                <span>Fast 30-Second Reporting</span>
              </div>

              {/* Floating Pill Accent 2 */}
              <div className="absolute -top-3 -right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-gray-100 shadow-md flex items-center gap-1.5 text-xs font-semibold text-[#087EBC]">
                <span className="text-emerald-600">●</span>
                <span>Zero Account Barrier</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
