import React from 'react';

export interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export interface BentoCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  colSpan?: string; // e.g. "md:col-span-2"
  rowSpan?: string; // e.g. "md:row-span-2"
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  header,
  icon,
  badge,
  colSpan = '',
  rowSpan = '',
  children,
  className = '',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative group rounded-3xl p-5 sm:p-6 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-300 flex flex-col justify-between overflow-hidden ${colSpan} ${rowSpan} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Background Hover Glow */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-rose-500/10 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {header && <div className="mb-4 relative z-10">{header}</div>}

      <div className="relative z-10 flex-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          {icon && (
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 group-hover:scale-105 transition-transform">
              {icon}
            </div>
          )}
          {badge}
        </div>

        <div className="font-bold text-slate-800 text-base sm:text-lg mb-1 group-hover:text-rose-600 transition-colors">
          {title}
        </div>

        {description && (
          <div className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
            {description}
          </div>
        )}

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};
