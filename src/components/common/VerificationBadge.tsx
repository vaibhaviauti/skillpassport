import React from 'react';
import { VerificationStatus } from '../../types';
import { CheckCircle2, AlertCircle, CircleDot, XCircle } from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  status,
  size = 'md',
  showLabel = true,
}) => {
  const configs = {
    VERIFIED: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'Verified ✓',
      dotColor: 'bg-emerald-500',
    },
    PARTIALLY_VERIFIED: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      label: 'Partially Verified',
      dotColor: 'bg-amber-500',
    },
    SELF_DECLARED: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: CircleDot,
      label: 'Self Declared',
      dotColor: 'bg-slate-400',
    },
    INVALID: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      label: 'Invalid / Unverified',
      dotColor: 'bg-rose-500',
    },
  };

  const current = configs[status] || configs.SELF_DECLARED;
  const Icon = current.icon;

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all ${current.bg} ${sizeStyles[size]}`}
      title={`Verification status: ${current.label}`}
    >
      <Icon className={`${iconSizes[size]} shrink-0`} />
      {showLabel && <span>{current.label}</span>}
    </span>
  );
};
