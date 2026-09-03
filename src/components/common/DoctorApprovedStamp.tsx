import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface DoctorApprovedStampProps {
  doctorName?: string;
  timestamp?: string;
  className?: string;
}

export const DoctorApprovedStamp: React.FC<DoctorApprovedStampProps> = ({
  doctorName = 'นพ. อายุรแพทย์โรคหัวใจ (ว. 48921)',
  timestamp = '08:30 น. STAT',
  className = ''
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-2.5 px-4 rounded-2xl border-2 border-rose-600/80 bg-rose-50/40 text-rose-700 shadow-sm select-none transform -rotate-3 hover:rotate-0 transition-transform ${className}`}
      style={{
        outline: '1.5px dashed rgba(225, 29, 72, 0.4)',
        outlineOffset: '2px'
      }}
    >
      <div className="flex items-center gap-1.5 text-[9px] font-mono font-extrabold uppercase tracking-widest text-rose-600">
        <ShieldCheck className="w-3 h-3" />
        <span>CCU HEART CENTER KKU</span>
      </div>

      <div className="text-xs font-black tracking-wider text-rose-800 uppercase py-0.5 border-y border-rose-300 my-0.5 w-full text-center">
        DOCTOR APPROVED • STAT
      </div>

      <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-rose-600 w-full">
        <span>{doctorName}</span>
        <span className="font-bold">{timestamp}</span>
      </div>
    </div>
  );
};

export const PatientBarcodeTag: React.FC<{ hn?: string; patientName?: string }> = ({
  hn = 'HN 65-098231',
  patientName = 'นางสมศรี มีสุข (อายุ 39 ปี)'
}) => {
  return (
    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 px-3 rounded-xl select-none">
      {/* SVG Code 128 Barcode Simulation */}
      <svg width="70" height="24" viewBox="0 0 70 24" className="shrink-0">
        <rect x="0" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="4" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="7" y="2" width="3" height="20" fill="#0f172a" />
        <rect x="12" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="15" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="19" y="2" width="4" height="20" fill="#0f172a" />
        <rect x="25" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="28" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="32" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="35" y="2" width="3" height="20" fill="#0f172a" />
        <rect x="40" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="44" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="47" y="2" width="3" height="20" fill="#0f172a" />
        <rect x="52" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="56" y="2" width="1" height="20" fill="#0f172a" />
        <rect x="59" y="2" width="4" height="20" fill="#0f172a" />
        <rect x="65" y="2" width="2" height="20" fill="#0f172a" />
        <rect x="68" y="2" width="2" height="20" fill="#0f172a" />
      </svg>

      <div className="text-[10px] leading-tight">
        <div className="font-mono font-bold text-slate-800">{hn}</div>
        <div className="text-slate-500 font-medium truncate max-w-[120px]">{patientName}</div>
      </div>
    </div>
  );
};
