import React from 'react';
import { AlertOctagon, Flame } from 'lucide-react';

interface CrisisVignetteOverlayProps {
  active?: boolean;
}

export const CrisisVignetteOverlay: React.FC<CrisisVignetteOverlayProps> = ({ active = true }) => {
  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none">
      {/* Pulsing Radial Red Vignette Border Glow */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 90px 20px rgba(244, 63, 94, 0.18)',
          animation: 'svtPulseGlow 0.405s ease-in-out infinite'
        }}
      />

      {/* Top Banner Alert Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-red-600 to-rose-500 animate-pulse" />

      {/* Global CSS for SVT 148 bpm Frequency Keyframes */}
      <style>{`
        @keyframes svtPulseGlow {
          0%, 100% {
            box-shadow: inset 0 0 60px 10px rgba(244, 63, 94, 0.12);
          }
          50% {
            box-shadow: inset 0 0 110px 28px rgba(239, 68, 68, 0.24);
          }
        }
      `}</style>
    </div>
  );
};
