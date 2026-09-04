import React from 'react';

export interface PulseBadgeProps {
  status: 'critical' | 'warning' | 'stable' | 'info' | 'neutral';
  text: string;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const PulseBadge: React.FC<PulseBadgeProps> = ({
  status,
  text,
  pulse = true,
  className = '',
  icon
}) => {
  const statusStyles = {
    critical: {
      container: 'bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100',
      dot: 'bg-red-500',
      ping: 'bg-red-400'
    },
    warning: {
      container: 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm shadow-amber-100',
      dot: 'bg-amber-500',
      ping: 'bg-amber-400'
    },
    stable: {
      container: 'bg-teal-50 text-teal-700 border-teal-200 shadow-sm shadow-teal-100',
      dot: 'bg-teal-500',
      ping: 'bg-teal-400'
    },
    info: {
      container: 'bg-sky-50 text-sky-700 border-sky-200 shadow-sm shadow-sky-100',
      dot: 'bg-sky-500',
      ping: 'bg-sky-400'
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      ping: 'bg-slate-300'
    }
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles.container} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusStyles.ping}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${statusStyles.dot}`} />
      </span>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{text}</span>
    </span>
  );
};
