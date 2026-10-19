import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Search,
  Calculator,
  BookOpen,
  Users,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      to: '/report',
      title: 'Leakage Reporting',
      desc: 'Log roadside pipe leaks, broken public taps, and overhead tank overflows with photos and GPS pins.',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      to: '/track',
      title: 'Secure Tracking',
      desc: 'Verify repair progress using your anonymous complaint reference and private tracking secret.',
      icon: Search,
      color: 'text-[#087EBC] bg-sky-50',
    },
    {
      to: '/calculator',
      title: 'Water Usage Calculator',
      desc: 'Assess daily household consumption against standard benchmarks with activity breakdowns and tips.',
      icon: Calculator,
      color: 'text-[#13B8A6] bg-teal-50',
    },
    {
      to: '/awareness',
      title: 'Conservation Hub',
      desc: 'Explore localized guides on rainwater harvesting, tank float valves, and greywater reuse for Wagholi.',
      icon: BookOpen,
      color: 'text-[#65A878] bg-emerald-50',
    },
    {
      to: '/community',
      title: 'Community Survey',
      desc: 'Contribute to our student research on local water shortage frequency, tanker reliance, and awareness.',
      icon: Users,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      to: '/admin',
      title: 'Administrative Review',
      desc: 'Protected portal for CEP organizers to verify reports, update progress, and analyze field survey data.',
      icon: ShieldCheck,
      color: 'text-[#103B54] bg-slate-100',
    },
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase font-bold tracking-wider text-[#087EBC] bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Platform Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
            Everything Needed for Community Action
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            AquaAlert combines citizen reporting with awareness and data collection to drive real community water conservation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.to}
                to={feat.to}
                className="group p-6 rounded-2xl bg-[#F5F9FB] hover:bg-white border border-gray-200/70 hover:border-[#087EBC]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#103B54] group-hover:text-[#087EBC] transition-colors mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200/50 flex items-center text-xs font-semibold text-[#087EBC] group-hover:translate-x-1 transition-transform">
                  <span>Explore Feature</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
