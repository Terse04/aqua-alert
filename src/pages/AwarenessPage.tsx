import React from 'react';
import { AwarenessContent } from '@/features/awareness/AwarenessContent';

export const AwarenessPage: React.FC = () => {
  return (
    <div className="py-10 sm:py-14 bg-gradient-to-b from-[#F5F9FB] to-white min-h-[calc(100vh-4.5rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AwarenessContent />
      </div>
    </div>
  );
};
