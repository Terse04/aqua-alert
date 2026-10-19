import React, { useState, useMemo } from 'react';
import {
  DEFAULT_CALCULATOR_INPUTS,
  calculateWaterConsumption,
} from '@/lib/calculator';
import { CalculatorCharts } from './CalculatorCharts';
import type { CalculatorInputs } from '@/types';
import {
  Calculator,
  RotateCcw,
  Users,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';

export const CalculatorForm: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_CALCULATOR_INPUTS);
  const [showAssumptions, setShowAssumptions] = useState(false);

  // Dynamic recalculation
  const summary = useMemo(() => {
    return calculateWaterConsumption(inputs);
  }, [inputs]);

  const handleChange = <K extends keyof CalculatorInputs>(
    key: K,
    val: CalculatorInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const handleReset = () => {
    setInputs(DEFAULT_CALCULATOR_INPUTS);
  };

  // Indian standard CPHEEO benchmark is 135 L / person / day
  const benchmarkDifference = summary.perPersonDaily - 135;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F8F7] text-xs font-semibold text-[#087EBC] mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Interactive Household Estimator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#103B54] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Household Water Consumption Calculator
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Adjust your daily routines below to estimate your household’s daily and monthly water footprint.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors self-start sm:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#103B54] to-[#087EBC] text-white shadow-md">
            <span className="text-xs uppercase font-bold tracking-wider text-[#13B8A6]">
              Total Daily Usage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono">
                {summary.dailyTotal.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-cyan-100">Litres / day</span>
            </div>
            <p className="text-[11px] text-cyan-200 mt-2">
              All household activities combined
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#E9F8F7] border border-[#13B8A6]/30 text-[#103B54]">
            <span className="text-xs uppercase font-bold tracking-wider text-[#087EBC]">
              Per Person Usage
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#087EBC]">
                {summary.perPersonDaily}
              </span>
              <span className="text-sm font-medium text-gray-600">L / person</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-2">
              Urban benchmark: 135 L/person/day
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 text-[#103B54]">
            <span className="text-xs uppercase font-bold tracking-wider text-gray-500">
              Estimated Monthly
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-gray-800">
                {summary.monthlyTotal.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-gray-500">Litres / month</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              Approx. {(summary.monthlyTotal / 1000).toFixed(1)} water tankers (10kL)
            </p>
          </div>
        </div>

        {/* CPHEEO Urban Benchmark Callout */}
        <div
          className={`mt-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-3 ${
            benchmarkDifference <= 0
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {benchmarkDifference <= 0 ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <TrendingDown className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <strong>
              {benchmarkDifference <= 0
                ? 'Excellent conservation benchmark!'
                : 'Higher than Indian national average:'}
            </strong>{' '}
            Your per-capita usage is {Math.abs(benchmarkDifference)} L{' '}
            {benchmarkDifference <= 0 ? 'below' : 'above'} the CPHEEO urban standard (135 litres/person/day).
          </div>
        </div>
      </div>

      {/* Main Grid: Form Controls on Left, Visualizations & Tips on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md space-y-6">
          <h3 className="text-base font-bold text-[#103B54] uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#087EBC]" />
            <span>Household Daily Habits</span>
          </h3>

          {/* 1. Household Size */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="members" className="text-sm font-semibold text-[#103B54]">
                1. Number of Household Members
              </label>
              <span className="font-mono font-bold text-sm text-[#087EBC]">
                {inputs.householdMembers} People
              </span>
            </div>
            <input
              id="members"
              type="range"
              min={1}
              max={12}
              step={1}
              value={inputs.householdMembers}
              onChange={(e) => handleChange('householdMembers', Number(e.target.value))}
              className="w-full accent-[#087EBC] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-gray-400 mt-1">
              <span>1 person</span>
              <span>4 members</span>
              <span>8 members</span>
              <span>12 members</span>
            </div>
          </div>

          {/* 2. Bathing Method */}
          <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-3">
            <label className="text-sm font-semibold text-[#103B54] block">
              2. Bathing Habit & Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('bathType', 'bucket')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  inputs.bathType === 'bucket'
                    ? 'border-[#087EBC] bg-white text-[#103B54] font-bold ring-2 ring-[#087EBC]/20'
                    : 'border-gray-200 bg-white/60 text-gray-600'
                }`}
              >
                <p className="text-sm">Bucket Bath</p>
                <span className="text-[11px] text-gray-500 font-normal">~18 Litres / person</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('bathType', 'shower')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  inputs.bathType === 'shower'
                    ? 'border-[#087EBC] bg-white text-[#103B54] font-bold ring-2 ring-[#087EBC]/20'
                    : 'border-gray-200 bg-white/60 text-gray-600'
                }`}
              >
                <p className="text-sm">Shower Bath</p>
                <span className="text-[11px] text-gray-500 font-normal">~9.5 Litres / minute</span>
              </button>
            </div>

            {inputs.bathType === 'shower' && (
              <div className="pt-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Average shower duration per person:</span>
                  <span className="font-bold text-[#087EBC]">{inputs.bathingMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={inputs.bathingMinutes}
                  onChange={(e) => handleChange('bathingMinutes', Number(e.target.value))}
                  className="w-full accent-[#087EBC] cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* 3. Laundry Loads */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="laundry" className="text-sm font-semibold text-[#103B54]">
                3. Clothes Washing (Washing Machine / Hand Wash)
              </label>
              <span className="font-mono font-bold text-sm text-[#087EBC]">
                {inputs.laundryLoadsPerWeek} Loads / week
              </span>
            </div>
            <input
              id="laundry"
              type="range"
              min={0}
              max={14}
              step={1}
              value={inputs.laundryLoadsPerWeek}
              onChange={(e) => handleChange('laundryLoadsPerWeek', Number(e.target.value))}
              className="w-full accent-[#087EBC] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Estimated at 55 litres per typical top/front-load wash cycle.
            </p>
          </div>

          {/* 4. Utensil Washing */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="utensils" className="text-sm font-semibold text-[#103B54]">
                4. Utensils & Dishwashing Duration
              </label>
              <span className="font-mono font-bold text-sm text-[#087EBC]">
                {inputs.washingUtensilsMinutes} Mins / day
              </span>
            </div>
            <input
              id="utensils"
              type="range"
              min={5}
              max={60}
              step={5}
              value={inputs.washingUtensilsMinutes}
              onChange={(e) => handleChange('washingUtensilsMinutes', Number(e.target.value))}
              className="w-full accent-[#087EBC] cursor-pointer"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Estimated at 5 litres per minute with sink faucet running.
            </p>
          </div>

          {/* 5. Toilet Flushing */}
          <div className="p-4 rounded-2xl bg-[#F5F9FB] border border-gray-100 space-y-3">
            <label className="text-sm font-semibold text-[#103B54] block">
              5. Toilet Cistern Type & Daily Flushes
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleChange('toiletType', 'dual')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  inputs.toiletType === 'dual'
                    ? 'border-[#087EBC] bg-white text-[#103B54] font-bold ring-2 ring-[#087EBC]/20'
                    : 'border-gray-200 bg-white/60 text-gray-600'
                }`}
              >
                <p className="text-sm">Dual Flush (Eco)</p>
                <span className="text-[11px] text-gray-500 font-normal">~4.5 Litres / flush</span>
              </button>

              <button
                type="button"
                onClick={() => handleChange('toiletType', 'standard')}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  inputs.toiletType === 'standard'
                    ? 'border-[#087EBC] bg-white text-[#103B54] font-bold ring-2 ring-[#087EBC]/20'
                    : 'border-gray-200 bg-white/60 text-gray-600'
                }`}
              >
                <p className="text-sm">Single Standard</p>
                <span className="text-[11px] text-gray-500 font-normal">~9 Litres / flush</span>
              </button>
            </div>

            <div className="pt-2">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Flushes per person per day:</span>
                <span className="font-bold text-[#087EBC]">
                  {inputs.toiletFlushesPerPersonPerDay} flushes
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={8}
                value={inputs.toiletFlushesPerPersonPerDay}
                onChange={(e) =>
                  handleChange('toiletFlushesPerPersonPerDay', Number(e.target.value))
                }
                className="w-full accent-[#087EBC] cursor-pointer"
              />
            </div>
          </div>

          {/* 6. House Mopping & Cleaning */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="mopping" className="text-sm font-semibold text-[#103B54]">
                6. Floor Mopping & House Cleaning
              </label>
              <span className="font-mono font-bold text-sm text-[#087EBC]">
                {inputs.cleaningLitresPerDay} Litres / day
              </span>
            </div>
            <input
              id="mopping"
              type="range"
              min={5}
              max={60}
              step={5}
              value={inputs.cleaningLitresPerDay}
              onChange={(e) => handleChange('cleaningLitresPerDay', Number(e.target.value))}
              className="w-full accent-[#087EBC] cursor-pointer"
            />
          </div>

          {/* 7. Other Activities */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="other" className="text-sm font-semibold text-[#103B54]">
                7. Cooking, Drinking, Plants & Miscellaneous
              </label>
              <span className="font-mono font-bold text-sm text-[#087EBC]">
                {inputs.otherDailyLitres} Litres / day
              </span>
            </div>
            <input
              id="other"
              type="range"
              min={5}
              max={80}
              step={5}
              value={inputs.otherDailyLitres}
              onChange={(e) => handleChange('otherDailyLitres', Number(e.target.value))}
              className="w-full accent-[#087EBC] cursor-pointer"
            />
          </div>

          {/* Assumptions Accordion */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAssumptions(!showAssumptions)}
              className="text-xs font-semibold text-[#087EBC] hover:underline flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showAssumptions ? 'Hide calculation assumptions' : 'View calculation methodology & assumptions'}</span>
            </button>

            {showAssumptions && (
              <div className="mt-3 p-4 bg-gray-50 rounded-2xl text-xs text-gray-600 space-y-2 border border-gray-200">
                <p>
                  <strong>Transparency Disclosure:</strong> Figures presented are model estimates grounded on Indian urban household consumption norms published by the Central Public Health and Environmental Engineering Organisation (CPHEEO):
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Bucket bath estimated at 18 litres (one full medium bucket).</li>
                  <li>Shower flow estimated at 9.5 litres/minute based on standard Indian plumbing fixtures.</li>
                  <li>Washing machine estimated at 55 litres per average cycle.</li>
                  <li>Dual-flush toilet cistern assumed at 4.5 litres avg; standard flush assumed at 9 litres.</li>
                  <li>Running tap dishwashing estimated at 5 litres/minute.</li>
                </ul>
                <p className="italic text-gray-500 pt-1">
                  Actual consumption varies with water pressure, fixture aerators, and appliance energy ratings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Visualizations & Personalized Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          {/* Charts */}
          <CalculatorCharts
            breakdown={summary.breakdown}
            dailyTotal={summary.dailyTotal}
          />

          {/* Top Contributors Ranked */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-md space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[#087EBC]" />
              <h3 className="text-base font-bold text-[#103B54]">Top Consumption Drivers</h3>
            </div>

            <div className="space-y-3">
              {summary.topContributors.slice(0, 3).map((item, index) => (
                <div
                  key={item.category}
                  className="p-3.5 rounded-2xl bg-[#F5F9FB] border border-gray-100 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-white border font-mono text-xs font-bold text-gray-700 flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-[#103B54] truncate">
                        {item.category}
                      </p>
                      <span className="text-xs font-extrabold text-[#087EBC]">
                        {item.dailyLitres} L ({item.percentage}%)
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      {item.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Personalized Recommendations */}
          <div className="bg-gradient-to-br from-[#103B54] to-[#0D4B6E] rounded-3xl p-6 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#13B8A6] font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Tailored Conservation Suggestions</span>
            </div>
            <div className="space-y-2.5 text-xs text-gray-200 leading-relaxed">
              {summary.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#13B8A6] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
