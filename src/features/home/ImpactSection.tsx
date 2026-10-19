import React, { useEffect, useState } from 'react';
import { DataService } from '@/lib/storage';
import { AlertCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const [stats, setStats] = useState<{
    total: number;
    pending: number;
    inProgress: number;
    resolved: number;
  }>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    DataService.getAdminComplaints()
      .then(({ complaints }) => {
        const total = complaints.length;
        const pending = complaints.filter((c) => c.status === 'Pending').length;
        const inProgress = complaints.filter(
          (c) => c.status === 'In Progress' || c.status === 'Under Review'
        ).length;
        const resolved = complaints.filter((c) => c.status === 'Resolved').length;
        setStats({ total, pending, inProgress, resolved });
      })
      .catch((err) => console.error('Failed to load application stats:', err));
  }, []);

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <span className="text-xs uppercase font-bold tracking-wider text-[#087EBC] bg-[#E9F8F7] px-3 py-1 rounded-full border border-[#13B8A6]/20">
            Localized Environmental Context
          </span>
          <h2 className="text-3xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Why Wagholi Faces Acute Water Scarcity
          </h2>
          <p className="text-base text-[#263746]/80 leading-relaxed">
            Rapid suburban expansion in the Wagholi corridor has intensified groundwater depletion and municipal supply shortages. When pipeline joints leak or standposts overflow, thousands of litres of treated or borewell water are lost before repairs can be initiated.
          </p>
        </div>

        {/* Genuine Platform Telemetry Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="p-6 rounded-2xl bg-[#F5F9FB] border border-gray-100/90 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#103B54] block">
              {stats.total}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
              Total Reports Logged
            </p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">Stored in application records</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F9FB] border border-gray-100/90 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-amber-600 block">
              {stats.pending}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
              Awaiting Verification
            </p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">Pending field check</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F9FB] border border-gray-100/90 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-[#087EBC] block">
              {stats.inProgress}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
              Under Review / Action
            </p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">Notified to local maintenance</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#F5F9FB] border border-gray-100/90 text-center">
            <span className="text-3xl lg:text-4xl font-extrabold text-emerald-600 block">
              {stats.resolved}
            </span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">
              Issues Resolved
            </p>
            <span className="text-[10px] text-gray-400 mt-0.5 block">Taps fixed / leaks stopped</span>
          </div>
        </div>

        {/* 3 Core Problem Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#103B54]">Delayed Leak Detection</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sub-surface valve seepage and broken standposts often go unnoticed or unreported for days, eroding road foundations and squandering potable water.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#087EBC] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#103B54]">Overhead Tank Overflows</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Without automatic shutoff sensors or vigilance, building tanks overflow into drains, depleting scarce groundwater extracted through private borewells.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#13B8A6] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-[#103B54]">Community-Led Stewardship</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Empowering local citizens with a fast reporting tool bridges the communication gap between noticing a leak and mobilizing community maintenance.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#13B8A6]" />
            Telemetry counts above are computed directly from live application records.
          </p>
        </div>
      </div>
    </section>
  );
};
