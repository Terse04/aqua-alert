import { describe, it, expect } from 'vitest';
import { calculateWaterConsumption, DEFAULT_CALCULATOR_INPUTS } from '../lib/calculator';

describe('Water Consumption Calculator Engine', () => {
  it('calculates benchmark default consumption correctly for a 4-person household', () => {
    const summary = calculateWaterConsumption(DEFAULT_CALCULATOR_INPUTS);

    expect(summary.dailyTotal).toBeGreaterThan(0);
    expect(summary.monthlyTotal).toBe(summary.dailyTotal * 30);
    expect(summary.perPersonDaily).toBe(Math.round(summary.dailyTotal / 4));
    expect(summary.breakdown.length).toBe(6);
    expect(summary.topContributors.length).toBe(6);
  });

  it('correctly reflects increased usage when switching from bucket to shower bath', () => {
    const bucketSummary = calculateWaterConsumption({
      ...DEFAULT_CALCULATOR_INPUTS,
      householdMembers: 2,
      bathType: 'bucket',
    });

    const showerSummary = calculateWaterConsumption({
      ...DEFAULT_CALCULATOR_INPUTS,
      householdMembers: 2,
      bathType: 'shower',
      bathingMinutes: 10, // 10 mins * 9.5 L/min = 95 L/person vs 18 L/person bucket
    });

    expect(showerSummary.dailyTotal).toBeGreaterThan(bucketSummary.dailyTotal);
    const bucketBathing = bucketSummary.breakdown.find(b => b.category.includes('Bathing'))?.dailyLitres;
    const showerBathing = showerSummary.breakdown.find(b => b.category.includes('Bathing'))?.dailyLitres;

    expect(bucketBathing).toBe(36); // 2 * 18
    expect(showerBathing).toBe(190); // 2 * 10 * 9.5
  });

  it('handles minimum zero inputs and boundary values gracefully', () => {
    const minSummary = calculateWaterConsumption({
      householdMembers: 1,
      bathType: 'bucket',
      bathingMinutes: 0,
      laundryLoadsPerWeek: 0,
      washingUtensilsMinutes: 0,
      toiletFlushesPerPersonPerDay: 0,
      toiletType: 'dual',
      cleaningLitresPerDay: 0,
      otherDailyLitres: 0,
    });

    // 1 member * 18 litres bucket bath = 18 L/day minimum
    expect(minSummary.dailyTotal).toBe(18);
    expect(minSummary.monthlyTotal).toBe(540);
  });
});
