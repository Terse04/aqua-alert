import React from 'react';
import { Link } from 'react-router-dom';
import { Droplet, AlertTriangle, ShieldCheck, Heart, MapPin, QrCode } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#103B54] text-white/90 pt-14 pb-10 border-t border-cyan-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#13B8A6] to-[#087EBC] flex items-center justify-center shadow-md">
                <Droplet className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Aqua<span className="text-[#13B8A6]">Alert</span>
                </span>
                <p className="text-xs text-[#E9F8F7]/80">Every Drop Matters.</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              A student-engineered digital initiative addressing localized water scarcity, delayed leak detection, and conservation in Wagholi, Pune.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#E9F8F7]">
              <MapPin className="w-3.5 h-3.5 text-[#13B8A6]" />
              <span>Target Study Area: Wagholi, Pune (Maharashtra)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Actions
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/report" className="hover:text-[#13B8A6] transition-colors">
                  Report a Leakage
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-[#13B8A6] transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-[#13B8A6] transition-colors">
                  Water Usage Calculator
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-[#13B8A6] transition-colors">
                  Community Water Survey
                </Link>
              </li>
            </ul>
          </div>

          {/* Education & Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Education & Info
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/awareness" className="hover:text-[#13B8A6] transition-colors">
                  Conservation Guide
                </Link>
              </li>
              <li>
                <Link to="/awareness#rainwater" className="hover:text-[#13B8A6] transition-colors">
                  Rainwater Harvesting
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#13B8A6] transition-colors">
                  About the CEP Project
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-[#13B8A6] transition-colors">
                  Feedback & Suggestions
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & QR Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Administrative
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/admin/login" className="hover:text-[#13B8A6] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#13B8A6]" />
                  <span>Admin Login</span>
                </Link>
              </li>
              <li>
                <Link to="/about#qr-code" className="hover:text-[#13B8A6] transition-colors flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-[#13B8A6]" />
                  <span>Display QR Code</span>
                </Link>
              </li>
              <li>
                <span className="text-xs text-gray-400 block pt-2">
                  Academic Year 2024–2025
                  <br />
                  Second Year IT Dept
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Academic Disclaimer Box */}
        <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-400/20 flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong>Important Community Disclaimer:</strong> AquaAlert is a student-developed Community Engagement Project (CEP) intended to raise awareness about water scarcity and encourage water conservation. It is <strong>not an official government or municipal complaint portal</strong>. Submitting a report does not guarantee that a repair authority will receive or act on it.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} AquaAlert — Community Engagement Project. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Built with care for Pune water conservation</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
