import React from 'react';
import { QRCodeDisplay } from '@/components/common/QRCodeDisplay';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-16 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Academic Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC]">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Information Technology Engineering CEP</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            About Our Community Engagement Project
          </h1>

          <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            This digital platform was engineered as part of the Second Year Information Technology Engineering curriculum to tackle the critical community challenge of <strong>Water Scarcity</strong> in Wagholi, Pune.
          </p>

          {/* Structured Project Profile Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
            <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Project Title</span>
              <p className="text-sm font-bold text-[#103B54] mt-0.5">Water Scarcity</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Platform Name</span>
              <p className="text-sm font-bold text-[#087EBC] mt-0.5">AquaAlert</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Project Nature</span>
              <p className="text-sm font-bold text-[#103B54] mt-0.5">Community Engagement (CEP)</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Study Geography</span>
              <p className="text-sm font-bold text-[#103B54] mt-0.5">Wagholi, Pune (MH)</p>
            </div>
          </div>
        </div>

        {/* Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Statement */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-amber-700 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Problem Statement</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Wagholi has experienced rapid real estate growth without an equivalent expansion of municipal piped drinking water infrastructure. Consequently, local housing societies and residents rely heavily on private water tankers and deep borewell extraction. In this fragile ecosystem, undetected pipeline fractures, faulty standpost taps, and overflowing overhead building tanks result in extensive freshwater wastage before remedial action can be mobilized.
            </p>
          </div>

          {/* Project Objective */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5 text-[#087EBC] font-bold text-sm uppercase tracking-wider">
              <Lightbulb className="w-5 h-5 text-[#087EBC]" />
              <span>Project Objectives</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-4 leading-relaxed">
              <li>
                To provide a lightweight, zero-barrier web portal allowing residents to report water leakages without mandatory account registration.
              </li>
              <li>
                To protect citizen confidentiality using cryptographic tracking secrets rather than public personal listings.
              </li>
              <li>
                To provide an interactive, benchmarked water consumption calculator for Indian households.
              </li>
              <li>
                To collect empirical community data on local shortage frequencies and tanker dependency.
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits & Limitations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#103B54] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Intended Community Benefits</span>
            </h3>
            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <li>• Rapid crowdsourcing of road and standpost leakages in Wagholi.</li>
              <li>• Heightened resident awareness of household greywater reuse and RWH methods.</li>
              <li>• Evidence-based data collection on localized water stress for academic analysis.</li>
              <li>• Promotes proactive maintenance culture in cooperative housing societies.</li>
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-[#103B54] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#087EBC]" />
              <span>Scope & Current Limitations</span>
            </h3>
            <ul className="text-xs text-gray-600 space-y-2 leading-relaxed">
              <li>• AquaAlert is a student academic tool, not an official municipal dispatch engine.</li>
              <li>• Physical repairs depend on volunteer outreach and society maintenance teams.</li>
              <li>• Water calculator outputs represent statistical estimates, not calibrated flow meters.</li>
              <li>• Location accuracy depends on browser GPS authorization and manual user pinning.</li>
            </ul>
          </div>
        </div>

        {/* Academic Details Configurator */}
        <div className="p-6 rounded-3xl bg-[#F5F9FB] border border-gray-200/90 space-y-4">
          <h3 className="text-sm font-bold text-[#103B54] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#13B8A6]" />
            <span>Academic Project Metadata</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-700">
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Class / Curriculum</span>
              <strong>Second Year B.Tech / B.E. Information Technology</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Activity Type</span>
              <strong>Community Engagement Project (CEP)</strong>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100">
              <span className="text-gray-400 block mb-1">Geographic Focus</span>
              <strong>Wagholi Corridor, Pune, Maharashtra</strong>
            </div>
          </div>
        </div>

        {/* Dedicated QR Code Section */}
        <div id="qr-code" className="pt-4 border-t border-gray-100">
          <QRCodeDisplay title="AquaAlert Community Stall QR Access" />
        </div>

        {/* Print Action Helper */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span>Print Project Summary Sheet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
