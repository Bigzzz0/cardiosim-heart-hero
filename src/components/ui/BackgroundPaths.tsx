import React from 'react';

export interface BackgroundPathsProps {
  className?: string;
  intensity?: 'subtle' | 'medium' | 'high';
}

export const BackgroundPaths: React.FC<BackgroundPathsProps> = ({
  className = '',
  intensity = 'subtle'
}) => {
  const opacity = {
    subtle: 'opacity-25',
    medium: 'opacity-40',
    high: 'opacity-65'
  }[intensity];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
    >
      {/* Ambient Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-rose-200/40 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-teal-200/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[24rem] h-[24rem] bg-pink-100/50 rounded-full blur-[90px] pointer-events-none" />

      {/* SVG Flowing Cardiac Rhythm Paths */}
      <svg
        className={`w-full h-full ${opacity}`}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M-100,450 C300,450 400,200 650,450 C800,600 1050,300 1200,450 C1300,550 1400,450 1540,450"
          stroke="url(#cardiac-gradient-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="16 12"
          className="animate-[pathFlow_25s_linear_infinite]"
        />

        {/* ECG QRS Pulse Waveform Vector */}
        <path
          d="M-50,520 L350,520 L380,520 L395,505 L410,545 L430,360 L450,580 L465,510 L480,520 L750,520 L780,520 L795,505 L810,545 L830,360 L850,580 L865,510 L880,520 L1200,520 L1230,520 L1245,505 L1260,545 L1280,360 L1300,580 L1315,510 L1330,520 L1500,520"
          stroke="url(#cardiac-gradient-2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.7"
          className="animate-[pathFlow_18s_linear_infinite]"
        />

        <path
          d="M0,250 C400,100 700,400 1100,200 C1300,100 1400,220 1500,250"
          stroke="url(#cardiac-gradient-3)"
          strokeWidth="1.5"
          strokeDasharray="8 8"
          className="animate-[pathFlow_35s_linear_infinite]"
        />

        <defs>
          <linearGradient id="cardiac-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#fb7185" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="cardiac-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
            <stop offset="30%" stopColor="#e11d48" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0d9488" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="cardiac-gradient-3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
