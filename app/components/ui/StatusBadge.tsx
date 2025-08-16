import React from 'react';
import { cn, getStatusColor, getPriorityColor } from '@/app/lib/utils';

interface StatusBadgeProps {
  type: 'status' | 'priority';
  value: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, className }) => {
  const getColorClasses = () => {
    if (type === 'status') {
      return getStatusColor(value);
    }
    return getPriorityColor(value);
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        getColorClasses(),
        className
      )}
    >
      {value.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
