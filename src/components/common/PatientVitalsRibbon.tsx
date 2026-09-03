import React from 'react';
import { GameStage } from '../../types/game';
import { Heart, Activity, Wind, AlertOctagon, ShieldAlert, BedDouble, User } from 'lucide-react';

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
        spo2: '82%',
        oxygen: 'Non-rebreather 15 L',
        rhythm: 'SVT (Crisis)',
        statusText: 'CRITICAL DETERIORATION (ภาวะวิกฤตเฉียบพลัน)'
      }
    : isStabilized
    ? {
        bp: '140/85 mmHg',
        hr: 92,
        rr: 20,
        spo2: '96%',
        oxygen: 'Nasal Cannula 3 L',
        rhythm: 'Normal Sinus',
        statusText: 'STABILIZED (อาการคงที่และปลอดภัย)'
      }
    : {
        bp: '168/98 mmHg',
        hr: 112,
        rr: 24,
        spo2: '95%',
        oxygen: 'Nasal Cannula 3 L',
        rhythm: 'Sinus Tachycardia',
        statusText: 'ACUTE HF & HT CRISIS'
      };

  return (
    <div
      className={`w-full transition-all duration-300 border-b select-none z-30 ${
        isCrisis
          ? 'bg-rose-50 border-rose-400 shadow-md shadow-rose-200/50 animate-pulse'
          : isStabilized
          ? 'bg-emerald-50/90 border-emerald-200'
          : 'bg-white/90 backdrop-blur-md border-pink-100/90 shadow-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2 flex items-center justify-between gap-2 text-xs overflow-x-auto scrollbar-none">
        {/* Left: Patient Bed Info */}
        <div className="flex items-center gap-2 shrink-0">
          <div className={`px-2 py-0.5 rounded-lg font-mono font-bold text-[10px] sm:text-[11px] border ${
            isCrisis
              ? 'bg-rose-600 text-white border-rose-700'
              : 'bg-pink-100 text-rose-800 border-pink-200'
          }`}>
            BED 03
          </div>
          <div className="flex items-center gap-1 text-slate-700 font-semibold text-[11px] sm:text-xs">
            <User className="w-3 h-3 text-rose-500" />
            <span className="truncate max-w-[90px] sm:max-w-none">นางสมศรี (39ปี)</span>
            <span className="text-slate-400 hidden md:inline">|</span>
            <span className="text-[10px] text-slate-500 hidden md:inline font-normal">
              ท่า High Fowler's 90°
            </span>
          </div>
        </div>

        {/* Center/Right: Live Vitals Ticker */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-[10px] sm:text-xs">
          {/* BP */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <span className="text-slate-400 font-medium text-[10px]">BP:</span>
            <span className={`font-mono font-bold ${isCrisis ? 'text-rose-600' : 'text-slate-800'}`}>
              {vitals.bp}
            </span>
          </div>

          {/* HR */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <Heart className={`w-3.5 h-3.5 ${isCrisis ? 'text-rose-600 animate-pulse' : 'text-rose-500'}`} />
            <span className="text-slate-400 font-medium text-[10px]">HR:</span>
            <span className={`font-mono font-bold ${isCrisis ? 'text-rose-600 animate-pulse' : 'text-slate-800'}`}>
              {vitals.hr} <span className="text-[9px] font-normal text-slate-400">bpm</span>
            </span>
          </div>

          {/* RR */}
          <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <Wind className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-slate-400 font-medium text-[10px]">RR:</span>
            <span className={`font-mono font-bold ${isCrisis ? 'text-rose-600' : 'text-slate-800'}`}>
              {vitals.rr} <span className="text-[9px] font-normal text-slate-400">/min</span>
            </span>
          </div>

          {/* SpO2 */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border ${
            isCrisis
              ? 'bg-rose-100 border-rose-300 text-rose-900 animate-pulse font-bold'
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <span className="font-medium text-[10px] text-teal-700">SpO2:</span>
            <span className="font-mono font-bold">{vitals.spo2}</span>
            <span className="text-[10px] text-teal-700 hidden md:inline font-mono">
              ({vitals.oxygen})
            </span>
          </div>

          {/* Rhythm Badge */}
          <div className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold border hidden lg:flex items-center gap-1 ${
            isCrisis
              ? 'bg-rose-600 text-white border-rose-700 animate-bounce'
              : isStabilized
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            <Activity className="w-3 h-3" />
            <span>{vitals.rhythm}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
