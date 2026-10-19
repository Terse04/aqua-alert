import React from 'react';
import type { ComplaintStatus } from '@/types';
import { Clock, Eye, Wrench, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const configs: Record<
    ComplaintStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Pending: {
      label: 'Pending',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    'Under Review': {
      label: 'Under Review',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-200',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    'In Progress': {
      label: 'In Progress',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      icon: <Wrench className="w-3.5 h-3.5" />,
    },
    Resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const config = configs[status] || configs['Pending'];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors',
        config.bg,
        config.text,
        config.border,
        sizeClasses[size]
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
