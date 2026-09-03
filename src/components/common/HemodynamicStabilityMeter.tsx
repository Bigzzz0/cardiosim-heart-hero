import React from 'react';
import { GameStage } from '../../types/game';
import { ShieldCheck, AlertTriangle, AlertOctagon, HeartPulse } from 'lucide-react';

interface HemodynamicStabilityMeterProps {
  currentStage: GameStage;
  compact?: boolean;
}

export const HemodynamicStabilityMeter: React.FC<HemodynamicStabilityMeterProps> = ({
  currentStage,
  compact = true
}) => {
  // Calculate stability score (0 - 100%) mapped to clinical stage
  const getStabilityData = () => {
    switch (currentStage) {
      case 'STAGE8_CRISIS_EVENT':
        return {
          score: 26,
          label: 'CRITICAL',
          subLabel: 'ภาวะวิกฤตฉุกเฉิน (SVT)',
          color: '#ef4444',
          bgClass: 'bg-rose-50 text-rose-700 border-rose-300'
        };
      case 'STAGE9_DEBRIEF':
      case 'RESULTS_DASHBOARD':
      case 'SURVEY':
        return {
          score: 94,
          label: 'OPTIMAL',
          subLabel: 'สัญญาณชีพคงที่ปลอดภัย',
          color: '#10b981',
          bgClass: 'bg-emerald-50 text-emerald-800 border-emerald-300'
        };
      case 'STAGE6_MEDICATION':
      case 'STAGE7_IO_RECORD':
        return {
          score: 78,
          label: 'STABILIZING',
          subLabel: 'ตอบสนองต่อการขับน้ำ',
          color: '#059669',
          bgClass: 'bg-teal-50 text-teal-800 border-teal-200'
        };
      case 'STAGE5_ABC_ACTION':
        return {
          score: 68,
          label: 'IMPROVING',
          subLabel: 'หลังจัดท่า High Fowler',
          color: '#0d9488',
          bgClass: 'bg-sky-50 text-sky-800 border-sky-200'
        };
      default:
        // STAGE1_HANDOVER, STAGE2_ASSESSMENT, STAGE3_PRIORITIZATION, STAGE4_RATIONALE
        return {
          score: 52,
          label: 'GUARDED',
          subLabel: 'สัญญาณชีพเฝ้าระวัง (HT Crisis)',
          color: '#f59e0b',
          bgClass: 'bg-amber-50 text-amber-800 border-amber-200'
        };
    }
  };

  const { score, label, subLabel, color, bgClass } = getStabilityData();

  // Needle angle for 200° arc from -100deg to +100deg
  const needleAngle = -100 + (score / 100) * 200;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl border text-[10px] font-mono transition-all ${bgClass}`}
        title={`ระดับความปลอดภัยของผู้ป่วย (Hemodynamic Stability): ${score}% - ${subLabel}`}
      >
        <HeartPulse className="w-3.5 h-3.5 animate-pulse shrink-0" style={{ color }} />
        <span className="font-bold">เสถียรภาพ:</span>
        <span className="font-extrabold" style={{ color }}>{score}%</span>
        <span className="hidden xl:inline text-[9px] font-sans font-medium text-slate-500">
          ({label})
        </span>
      </div>
    );
  }

  // Expanded View with Gauge SVG
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col items-center select-none">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <HeartPulse className="w-4 h-4 text-rose-500" />
          <span>Hemodynamic Stability Gauge</span>
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bgClass}`}>
          {label}
        </span>
      </div>

      {/* Speedometer Gauge SVG */}
      <div className="relative py-2">
        <svg width="180" height="110" viewBox="0 0 180 110">
          <defs>
            <linearGradient id="meterTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 25 95 A 65 65 0 0 1 155 95"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored Gradient Value Arc */}
          <path
            d="M 25 95 A 65 65 0 0 1 155 95"
            fill="none"
            stroke="url(#meterTrackGrad)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="205"
            strokeDashoffset={205 - (score / 100) * 205}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          />

          {/* Pivot Center Point */}
          <circle cx="90" cy="95" r="7" fill="#0f172a" />
          <circle cx="90" cy="95" r="3" fill="#ffffff" />

          {/* Gauge Needle */}
          <line
            x1="90"
            y1="95"
            x2="90"
            y2="42"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{
              transformOrigin: '90px 95px',
              transform: `rotate(${needleAngle}deg)`,
              transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          />
        </svg>

        <div className="text-center -mt-3">
          <span className="text-2xl font-black font-mono" style={{ color }}>{score}%</span>
          <p className="text-[10px] text-slate-500 font-medium">{subLabel}</p>
        </div>
      </div>
    </div>
  );
};
