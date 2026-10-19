import React from 'react';
import { HeroSection } from '@/features/home/HeroSection';
import { ImpactSection } from '@/features/home/ImpactSection';
import { WorkflowSection } from '@/features/home/WorkflowSection';
import { FeaturesSection } from '@/features/home/FeaturesSection';
import { CommunityCallout } from '@/features/home/CommunityCallout';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <ImpactSection />
      <WorkflowSection />
      <FeaturesSection />
      <CommunityCallout />
    </div>
  );
};
