import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  Wrench,
  Sparkles,
  ShieldAlert,
  Home,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const AwarenessContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rainwater');

  const topics = [
    { id: 'scarcity-causes', label: 'Causes & Effects', icon: AlertTriangle },
    { id: 'rainwater', label: 'Rainwater Harvesting', icon: CloudRain },
    { id: 'tank-overflow', label: 'Overhead Tank Overflows', icon: Droplets },
    { id: 'leak-detection', label: 'Detecting Household Leaks', icon: Wrench },
    { id: 'kitchen-bath', label: 'Bathroom & Kitchen Savings', icon: Home },
    { id: 'groundwater-reuse', label: 'Groundwater & Reuse', icon: Sparkles },
    { id: 'community-action', label: 'Community Action', icon: ShieldAlert },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Awareness Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC] mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Wagholi Community Conservation Handbook</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
          Practical Water Conservation & Stewardship
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed max-w-3xl">
          Actionable, science-backed guidance designed for households, housing societies, and commercial premises across Wagholi and the greater Pune urban periphery.
        </p>

        {/* Quick Sticky-style Topic Navigation Pills */}
        <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100 mt-6">
          {topics.map((t) => {
            const Icon = t.icon;
            const isSelected = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTab(t.id);
                  document.getElementById(t.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#103B54] text-white shadow-xs'
                    : 'bg-[#F5F9FB] text-gray-700 hover:bg-gray-100 border border-gray-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 1: Causes & Local Effects */}
      <section
        id="scarcity-causes"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              1. Understanding Scarcity in Semi-Urban Pune
            </h2>
            <p className="text-xs text-gray-500">Root drivers and real-world impacts on Wagholi residents</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 leading-relaxed pt-2">
          <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#103B54] text-xs uppercase tracking-wide">
              Key Contributing Causes:
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600 list-disc pl-4">
              <li>
                <strong>Surging Population Density:</strong> Massive growth in high-rise residential towers outpaced municipal distribution pipeline infrastructure.
              </li>
              <li>
                <strong>Over-extraction of Borewells:</strong> Heavy reliance on deep aquifers has lowered water tables drastically across the eastern Pune belt.
              </li>
              <li>
                <strong>Distribution Pipe Vulnerabilities:</strong> Underground pipelines along busy corridors like Nagar Road undergo stress fractures from heavy construction vehicle transit.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#103B54] text-xs uppercase tracking-wide">
              Community Impacts:
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-600 list-disc pl-4">
              <li>
                <strong>Heavy Financial Burden:</strong> Societies depend on private tankers costing up to ₹1,200–₹1,800 per 10,000-litre load during summer.
              </li>
              <li>
                <strong>Water Quality Disparities:</strong> Untreated borewell water frequently presents high Total Dissolved Solids (TDS) and hardness.
              </li>
              <li>
                <strong>Intermittent Supply Stress:</strong> Irregular supply timings force families to alter daily work and school schedules.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: Rainwater Harvesting */}
      <section
        id="rainwater"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#087EBC] flex items-center justify-center shrink-0">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              2. Rainwater Harvesting (RWH) for Societies
            </h2>
            <p className="text-xs text-gray-500">Recharging aquifers and creating self-sustaining supply</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          Pune receives an average annual monsoon rainfall of approximately 750 mm. A residential building terrace of 2,000 square feet can collect over <strong>1,30,000 litres</strong> of clean runoff each rainy season.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/20 space-y-1.5">
            <span className="font-bold text-xs text-[#087EBC] uppercase tracking-wide">Step A: Rooftop Catchment</span>
            <p className="text-xs text-gray-700">
              Clean terrace tiles prior to pre-monsoon showers. Route rooftop gutters away from bird-nesting corners.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/20 space-y-1.5">
            <span className="font-bold text-xs text-[#087EBC] uppercase tracking-wide">Step B: First-Flush Diverter</span>
            <p className="text-xs text-gray-700">
              Install a manual or automatic first-flush valve to drain initial dust-laden roof washings before filling tanks.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/20 space-y-1.5">
            <span className="font-bold text-xs text-[#087EBC] uppercase tracking-wide">Step C: Recharge Borewells</span>
            <p className="text-xs text-gray-700">
              Direct filtered overflow into percolation pits with gravel and sand filters to directly replenish dry society borewells.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Overhead Tank Overflow Prevention */}
      <section
        id="tank-overflow"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#13B8A6] flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              3. Eliminating Overhead Tank Overflows
            </h2>
            <p className="text-xs text-gray-500">The most preventable form of municipal and borewell loss</p>
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          In many societies, water booster pumps are switched on without float switches. When tanks fill up, water spills over parapets for 30–60 minutes, wasting between 1,000 and 4,000 litres per event.
        </p>

        <div className="space-y-3 pt-2">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed">
              <strong>Install an Automatic Water Level Controller:</strong> Magnetic float switch kits (costing ~₹1,500) automatically turn the booster pump off when the overhead tank hits 95% capacity and restart when levels drop.
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed">
              <strong>Check Mechanical Ball Valves:</strong> Hard water scaling can freeze copper and plastic ball valves in the open position. Inspect floats every 3 months.
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-gray-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed">
              <strong>Extend Overflow Pipes:</strong> Route overflow spouts to visible ground drain points rather than hidden rooftop corners so building staff notice overflows immediately.
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Detecting Household Leaks */}
      <section
        id="leak-detection"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              4. Detecting Silent Household Leaks
            </h2>
            <p className="text-xs text-gray-500">Quick tests to identify invisible plumbing waste</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#103B54] text-xs uppercase tracking-wide">
              The 20-Minute Water Meter Test
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Ensure all taps, washing machines, and water purifiers are shut off. Check your individual society water meter or overhead valve indicator. If the dial moves or ticks after 20 minutes without active use, an undetected pipe leak or toilet flush seepage is present.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-2">
            <h3 className="font-bold text-[#103B54] text-xs uppercase tracking-wide">
              The Toilet Cistern Food-Coloring Test
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Add 3–4 drops of food coloring or tea extract into the toilet cistern tank without flushing. Wait 15 minutes. If colored water seeps into the toilet bowl, your flapper valve or seal is worn and quietly leaking up to 80 litres each day.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Bathroom & Kitchen Conservation */}
      <section
        id="kitchen-bath"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              5. Bathroom & Kitchen Conservation Habits
            </h2>
            <p className="text-xs text-gray-500">Everyday Indian kitchen and bathroom micro-adjustments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-gray-700">
          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
            <span className="font-bold text-[#087EBC] block">Faucet Aerators</span>
            <p className="text-gray-600 leading-relaxed">
              Screw in simple 3-litre/minute aerators onto washbasin and sink taps. They cost under ₹100, maintain comfortable wash pressure, and reduce flow rate by 50%.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
            <span className="font-bold text-[#087EBC] block">The Two-Basin Dish Wash</span>
            <p className="text-gray-600 leading-relaxed">
              Never scrub dishes under a continuously flowing stream. Use one tub with diluted dish soap and a second basin with rinse water to save 40 litres per meal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
            <span className="font-bold text-[#087EBC] block">Bucket Bath vs Shower</span>
            <p className="text-gray-600 leading-relaxed">
              Standard Indian bucket baths require 15–20 litres. An 8-minute overhead shower utilizes 75–90 litres. Prefer bucket bathing during peak summer months.
            </p>
          </div>
        </div>
      </section>

      {/* Section 6: Groundwater & Reuse */}
      <section
        id="groundwater-reuse"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#103B54]">
              6. Groundwater Recharge & RO Reject Water Reuse
            </h2>
            <p className="text-xs text-gray-500">Safely repurposing reject streams from home appliances</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/20 space-y-3">
          <h3 className="text-sm font-bold text-[#103B54]">
            Don't Let Reverse Osmosis (RO) Reject Go Down the Drain!
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Standard residential RO purifiers reject 3 litres of water for every 1 litre of purified drinking water produced. This reject stream is mineral-rich and completely non-toxic.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-700 pt-1">
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Perfect for balcony floor mopping & utensil pre-rinsing</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Suitable for toilet flushing & non-flowering potted plants</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
