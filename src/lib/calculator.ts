import type { CalculatorInputs, CalculatorSummary, CalculatorBreakdownItem } from '@/types';

export const DEFAULT_CALCULATOR_INPUTS: CalculatorInputs = {
  householdMembers: 4,
  bathType: 'bucket',
  bathingMinutes: 10,
  laundryLoadsPerWeek: 4,
  washingUtensilsMinutes: 25,
  toiletFlushesPerPersonPerDay: 4,
  toiletType: 'dual',
  cleaningLitresPerDay: 20,
  otherDailyLitres: 25, // drinking, cooking, plants, hand washing
};

export function calculateWaterConsumption(inputs: CalculatorInputs): CalculatorSummary {
  const members = Math.max(1, Number(inputs.householdMembers) || 1);

  // 1. Bathing
  // Bucket bath: ~18 litres per person per bath
  // Shower bath: ~9.5 litres per minute * duration
  let bathingDaily = 0;
  if (inputs.bathType === 'bucket') {
    bathingDaily = members * 18;
  } else {
    const mins = Math.max(0, Number(inputs.bathingMinutes) !== undefined && !isNaN(Number(inputs.bathingMinutes)) ? Number(inputs.bathingMinutes) : 8);
    bathingDaily = members * (mins * 9.5);
  }

  // 2. Laundry
  // Standard washing machine or hand bucket: ~55 litres per load. Convert weekly loads to daily.
  const weeklyLoads = Math.max(0, !isNaN(Number(inputs.laundryLoadsPerWeek)) ? Number(inputs.laundryLoadsPerWeek) : 0);
  const laundryDaily = (weeklyLoads * 55) / 7;

  // 3. Washing Utensils
  // Running tap uses approx 5 litres per minute
  const utensilMins = Math.max(0, !isNaN(Number(inputs.washingUtensilsMinutes)) ? Number(inputs.washingUtensilsMinutes) : 0);
  const utensilDaily = utensilMins * 5;

  // 4. Toilet Flushing
  // Dual flush average = 4.5 L/flush; Standard single flush = 9 L/flush
  const flushesPerPerson = Math.max(0, inputs.toiletFlushesPerPersonPerDay !== undefined && !isNaN(Number(inputs.toiletFlushesPerPersonPerDay)) ? Number(inputs.toiletFlushesPerPersonPerDay) : 4);
  const litresPerFlush = inputs.toiletType === 'dual' ? 4.5 : 9;
  const toiletDaily = members * flushesPerPerson * litresPerFlush;

  // 5. House Cleaning & Mopping
  const cleaningDaily = Math.max(0, !isNaN(Number(inputs.cleaningLitresPerDay)) ? Number(inputs.cleaningLitresPerDay) : 0);

  // 6. Other (Cooking, Drinking, Gardening)
  const otherDaily = Math.max(0, !isNaN(Number(inputs.otherDailyLitres)) ? Number(inputs.otherDailyLitres) : 0);

  const dailyTotal = Math.round(bathingDaily + laundryDaily + utensilDaily + toiletDaily + cleaningDaily + otherDaily);
  const monthlyTotal = Math.round(dailyTotal * 30);
  const perPersonDaily = Math.round(dailyTotal / members);

  const rawBreakdown = [
    {
      category: 'Bathing & Personal Hygiene',
      dailyLitres: Math.round(bathingDaily),
      monthlyLitres: Math.round(bathingDaily * 30),
      color: '#087EBC',
      tip: inputs.bathType === 'shower' 
        ? 'Switching to a bucket bath or a low-flow aerated shower head can save up to 40% of bathing water.'
        : 'Bucket baths are already efficient! Ensure the tap is shut tightly while applying soap.',
    },
    {
      category: 'Toilet Flushing',
      dailyLitres: Math.round(toiletDaily),
      monthlyLitres: Math.round(toiletDaily * 30),
      color: '#13B8A6',
      tip: inputs.toiletType === 'standard'
        ? 'Upgrading to a dual-flush cistern (or placing a displacement bottle in the tank) can save up to 18 litres per person daily.'
        : 'Good choice with dual-flush! Remind household members to use the half-flush button for liquid waste.',
    },
    {
      category: 'Utensil Washing',
      dailyLitres: Math.round(utensilDaily),
      monthlyLitres: Math.round(utensilDaily * 30),
      color: '#65A878',
      tip: 'Washing utensils in a pre-soaked tub rather than running the tap continuously saves 30–50 litres every meal.',
    },
    {
      category: 'Laundry & Clothes',
      dailyLitres: Math.round(laundryDaily),
      monthlyLitres: Math.round(laundryDaily * 30),
      color: '#103B54',
      tip: 'Only run the washing machine on full loads. Reuse the greywater rinse cycle for balcony mopping or outdoor washrooms.',
    },
    {
      category: 'House Mopping & Cleaning',
      dailyLitres: Math.round(cleaningDaily),
      monthlyLitres: Math.round(cleaningDaily * 30),
      color: '#F59E0B',
      tip: 'Use a single double-bucket mopping system and consider reusing RO water purifier wastewater for floor cleaning.',
    },
    {
      category: 'Cooking, Drinking & Misc',
      dailyLitres: Math.round(otherDaily),
      monthlyLitres: Math.round(otherDaily * 30),
      color: '#8B5CF6',
      tip: 'RO purifier reject water is safe for washing dishes and watering non-edible plants. Never let it drain away into sewage.',
    },
  ];

  const breakdown: CalculatorBreakdownItem[] = rawBreakdown.map(item => ({
    ...item,
    percentage: dailyTotal > 0 ? Math.round((item.dailyLitres / dailyTotal) * 100) : 0,
  }));

  // Sort by highest consumption
  const topContributors = [...breakdown].sort((a, b) => b.dailyLitres - a.dailyLitres);

  // Dynamic recommendations
  const tips: string[] = [];
  if (perPersonDaily > 150) {
    tips.push('Your household exceeds the CPHEEO urban standard benchmark of 135 litres/person/day. Focusing on your top 2 usage areas will yield immediate conservation.');
  } else {
    tips.push('Great job! Your consumption is within or below the benchmark urban water usage. Maintaining these habits helps safeguard Wagholi groundwater reserves.');
  }

  if (topContributors[0]) {
    tips.push(`Your largest single water user is "${topContributors[0].category}" (${topContributors[0].percentage}% of total). ${topContributors[0].tip}`);
  }
  if (topContributors[1]) {
    tips.push(`Your secondary impact area is "${topContributors[1].category}". ${topContributors[1].tip}`);
  }

  return {
    dailyTotal,
    monthlyTotal,
    perPersonDaily,
    breakdown,
    topContributors,
    tips,
  };
}
