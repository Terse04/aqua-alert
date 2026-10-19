import React from 'react';
import { Camera, Send, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Identify Leakage',
      desc: 'Spot pipeline fractures, broken taps, or overflowing overhead water tanks in your neighborhood or society.',
      icon: Camera,
      color: 'bg-sky-50 text-[#087EBC] border-sky-200',
    },
    {
      step: '02',
      title: 'Submit a Report',
      desc: 'Fill out the simple 30-second form with the area name, description, and an optional photo. No registration required.',
      icon: Send,
      color: 'bg-teal-50 text-[#13B8A6] border-teal-200',
    },
    {
      step: '03',
      title: 'Track Progress',
      desc: 'Receive your unique Complaint ID and private tracking code to follow review milestones and maintenance updates.',
      icon: Search,
      color: 'bg-emerald-50 text-[#65A878] border-emerald-200',
    },
  ];

  return (
    <section className="py-16 bg-[#F5F9FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-[#13B8A6] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/50">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            How AquaAlert Works
          </h2>
          <p className="text-sm text-gray-600">
            A frictionless reporting mechanism engineered for mobile-first community reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-gray-200 font-mono group-hover:text-[#087EBC] transition-colors">
                      {item.step}
                    </span>
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#103B54] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>

                {idx < 2 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-gray-300">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#103B54] hover:bg-[#087EBC] text-white text-sm font-semibold transition-colors shadow-xs"
          >
            <span>Ready to report an incident?</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
