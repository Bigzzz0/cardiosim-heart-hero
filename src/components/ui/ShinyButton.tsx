import React from 'react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

export interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'crisis' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = true,
  icon,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (variant === 'crisis') {
      clinicalAudio.playHeartBeep(440, 0.15);
    } else {
      clinicalAudio.playHeartBeep(880, 0.06);
    }
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-2xl gap-2.5',
    xl: 'px-8 py-4 text-lg rounded-2xl gap-3 font-extrabold'
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-rose-200/80 hover:from-rose-600 hover:to-pink-600',
    secondary:
      'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-slate-300 hover:from-slate-900 hover:to-black',
    crisis:
      'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-red-300 hover:from-red-700 hover:to-rose-700 animate-pulse',
    success:
      'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-teal-200 hover:from-teal-600 hover:to-emerald-700',
    outline:
      'bg-white/90 text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
  }[variant];

  const glowClass = glow && !disabled ? (
    variant === 'primary' ? 'shadow-lg shadow-rose-300/60' :
    variant === 'crisis' ? 'shadow-xl shadow-red-400/80' :
    variant === 'success' ? 'shadow-lg shadow-teal-300/60' :
    'shadow-md'
  ) : 'shadow-sm';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-bold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group ${sizeClasses} ${variantClasses} ${glowClass} ${className}`}
      {...props}
    >
      {/* 21st.dev Shimmer Sweep Layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-[250%] ease-in-out"
      />

      {icon && <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
