import React from 'react';
import { Link } from 'react-router-dom';
import { Users, QrCode, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

export const CommunityCallout: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-[#103B54] via-[#0D4B6E] to-[#087EBC] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#13B8A6] border border-white/15">
              <Users className="w-3.5 h-3.5" />
              Community Engagement in Wagholi
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Be the Eyes and Ears of Your Neighborhood
            </h2>

            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-2xl">
              Water tankers in Wagholi cost households thousands of rupees each month, yet untreated municipal and borewell water is frequently lost to overlooked leaks. By reporting leaks promptly and adopting sensible home habits, our entire locality benefits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-gray-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6] shrink-0" />
                <span>Share your water challenges via our survey</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6] shrink-0" />
                <span>Inspect building tank floats & prevent overflow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6] shrink-0" />
                <span>Report pipeline fractures near construction zones</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#13B8A6] shrink-0" />
                <span>Encourage rainwater harvesting in housing societies</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/community"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#103B54] font-semibold text-sm hover:bg-gray-100 transition-colors shadow-xs"
              >
                <span>Take Community Survey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/feedback"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#13B8A6]" />
                <span>Send Feedback</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/15 text-center max-w-sm w-full space-y-4">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#13B8A6]/20 text-[#13B8A6] flex items-center justify-center">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">QR Code Field Access</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Presenting this CEP project in your housing society or college stall? Use our dedicated print-ready QR code.
              </p>
              <Link
                to="/about#qr-code"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#13B8A6] hover:bg-[#087EBC] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <QrCode className="w-4 h-4" />
                <span>View & Print QR Poster</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
