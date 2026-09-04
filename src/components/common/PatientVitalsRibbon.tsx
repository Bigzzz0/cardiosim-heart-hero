import React from 'react';
import { GameStage } from '../../types/game';
import { Heart, Activity, Wind, AlertOctagon, ShieldAlert, BedDouble, User } from 'lucide-react';
import { HemodynamicStabilityMeter } from './HemodynamicStabilityMeter';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { PulseBadge } from '../ui/PulseBadge';

interface PatientVitalsRibbonProps {
  currentStage: GameStage;
}

export const PatientVitalsRibbon: React.FC<PatientVitalsRibbonProps> = ({ currentStage }) => {
  // Only show ribbon in clinical stages
  const clinicalStages: GameStage[] = [
    'STAGE1_HANDOVER',
    'STAGE2_ASSESSMENT',
    'STAGE3_PRIORITIZATION',
    'STAGE4_RATIONALE',
    'STAGE5_ABC_ACTION',
    'STAGE6_MEDICATION',
    'STAGE7_IO_RECORD',
    'STAGE8_CRISIS_EVENT',
    'STAGE9_DEBRIEF'
  ];

  if (!clinicalStages.includes(currentStage)) {
    return null;
  }

  const isCrisis = currentStage === 'STAGE8_CRISIS_EVENT';
  const isStabilized = currentStage === 'STAGE9_DEBRIEF';

  // Dynamic vitals according to patient condition
  const vitals = isCrisis
    ? {
        bp: '220/130 mmHg',
        hr: 148,
        rr: 36,
        spo2Num: 82,
        oxygen: 'Non-rebreather 15 L',
        rhythm: 'SVT (Crisis)',
        statusText: 'CRITICAL DETERIORATION'
      }
    : isStabilized
    ? {
        bp: '140/85 mmHg',
        hr: 92,
        rr: 20,
        spo2Num: 96,
        oxygen: 'Nasal Cannula 3 L',
        rhythm: 'Normal Sinus',
        statusText: 'STABILIZED'
      }
    : {
        bp: '168/98 mmHg',
        hr: 112,
        rr: 24,
        spo2Num: 95,
        oxygen: 'Nasal Cannula 3 L',
        rhythm: 'Sinus Tachycardia',
        statusText: 'ACUTE HF & HT CRISIS'
      };

  return (
    <div
      className={`w-full transition-all duration-300 border-b select-none z-30 ${
        isCrisis
          ? 'bg-rose-50/95 border-rose-400 shadow-lg shadow-rose-200/50 neon-border-pulse'
          : isStabilized
          ? 'bg-emerald-50/90 border-emerald-200'
          : 'bg-white/95 backdrop-blur-md border-pink-100/90 shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs overflow-x-auto scrollbar-none">
        {/* Left: Patient Bed Info */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-[10px] sm:text-[11px] border shadow-xs ${
            isCrisis
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
              : 'bg-pink-100 text-rose-800 border-pink-200'
          }`}>
            BED 03
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-[11px] sm:text-xs">
            <User className="w-3.5 h-3.5 text-rose-500" />
            <span className="truncate max-w-[90px] sm:max-w-none">นางสมศรี (39ปี)</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="text-[10px] text-slate-500 hidden md:inline font-normal">
              ท่า High Fowler's 90°
            </span>
          </div>
        </div>

        {/* Center/Right: Live Vitals Ticker with AnimatedCounter */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-[10px] sm:text-xs">
          {/* BP */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium text-[10px]">BP:</span>
            <span className={`font-mono font-bold ${isCrisis ? 'text-rose-600' : 'text-slate-800'}`}>
              {vitals.bp}
            </span>
          </div>

          {/* HR with AnimatedCounter */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <Heart
              className={`w-3.5 h-3.5 text-rose-500 shrink-0 ${isCrisis ? 'animate-ping-slow' : 'animate-pulse'}`}
            />
            <span className="text-slate-400 font-medium text-[10px]">HR:</span>
            <AnimatedCounter
              value={vitals.hr}
              durationMs={600}
              className={`font-bold ${isCrisis ? 'text-rose-600' : 'text-slate-800'}`}
              suffix=" bpm"
            />
          </div>

          {/* RR with AnimatedCounter */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <Wind className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-slate-400 font-medium text-[10px]">RR:</span>
            <AnimatedCounter
              value={vitals.rr}
              durationMs={600}
              className={`font-bold ${isCrisis ? 'text-rose-600' : 'text-slate-800'}`}
              suffix=" /min"
            />
          </div>

          {/* SpO2 with AnimatedCounter */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
            isCrisis
              ? 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse font-bold'
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <span className="font-medium text-[10px] text-teal-700">SpO2:</span>
            <AnimatedCounter
              value={vitals.spo2Num}
              durationMs={800}
              className="font-bold"
              suffix="%"
            />
            <span className="text-[10px] text-teal-700 hidden md:inline font-mono">
              ({vitals.oxygen})
            </span>
          </div>

          {/* Rhythm PulseBadge */}
          <PulseBadge
            status={isCrisis ? 'critical' : isStabilized ? 'stable' : 'warning'}
            text={vitals.rhythm}
            pulse={isCrisis}
            icon={<Activity className="w-3 h-3" />}
            className="hidden lg:inline-flex font-mono"
          />

          {/* Hemodynamic Stability Index Gauge */}
          <HemodynamicStabilityMeter currentStage={currentStage} compact={true} />
        </div>
      </div>
    </div>
  );
};
