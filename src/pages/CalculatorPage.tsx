import React from 'react';
import { CalculatorForm } from '@/features/calculator/CalculatorForm';

export const CalculatorPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-14 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalculatorForm />
      </div>
    </div>
  );
};
