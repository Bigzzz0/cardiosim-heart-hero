import React from 'react';
import { Stethoscope, Activity, Droplets, Wind, Sparkles } from 'lucide-react';
import { ClinicalHotspot } from '../../types/game';

interface InteractivePatientBedSVGProps {
  hotspots: ClinicalHotspot[];
  onTapHotspot: (hotspot: ClinicalHotspot) => void;
  activeHotspotId?: string;
  heartRate?: number;
}

export const InteractivePatientBedSVG: React.FC<InteractivePatientBedSVGProps> = ({
  hotspots,
  onTapHotspot,
  activeHotspotId,
  heartRate = 112
}) => {
  const pulseDuration = `${(60 / heartRate).toFixed(2)}s`;

  return (
    <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-slate-50/80 via-white to-rose-50/30 rounded-3xl border-2 border-pink-100/90 shadow-inner overflow-hidden select-none">
      {/* Top Clinical Status Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap gap-2 pointer-events-none">
        <span className="bg-white/90 backdrop-blur-md border border-rose-200 text-rose-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          ท่า High Fowler's (90 องศา) หนุนหมอนสูง 2 ใบ
        </span>
        <span className="bg-white/90 backdrop-blur-md border border-sky-200 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
          <Wind className="w-3 h-3 text-sky-500" />
          O2 Nasal Cannula 3 L/min
        </span>
      </div>

      {/* Main Responsive SVG Vector */}
      <svg
        viewBox="0 0 800 620"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.04))' }}
      >
        <defs>
          {/* Gradients for Hospital Bed and Linens */}
          <linearGradient id="bedFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>

          <linearGradient id="bedMattressGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>

          <linearGradient id="pillowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>

          <linearGradient id="patientSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fdba74" />
          </linearGradient>

          <linearGradient id="hospitalGownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="50%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>

          <linearGradient id="lungGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#f472b6" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.75" />
          </linearGradient>

          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Pulse Glow Filters */}
          <filter id="glowPulse" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Hospital Bed Structure in High Fowler's 90° */}
        {/* Bed Base & Wheels */}
        <rect x="140" y="530" width="520" height="24" rx="6" fill="url(#bedFrameGrad)" stroke="#94a3b8" strokeWidth="1.5" />
        <circle cx="200" cy="564" r="14" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <circle cx="200" cy="564" r="5" fill="#f8fafc" />
        <circle cx="600" cy="564" r="14" fill="#64748b" stroke="#334155" strokeWidth="2" />
        <circle cx="600" cy="564" r="5" fill="#f8fafc" />

        {/* Bed Backrest (Vertical 90° for High Fowler's) */}
        <rect x="250" y="90" width="300" height="360" rx="16" fill="url(#bedFrameGrad)" stroke="#94a3b8" strokeWidth="2" />
        
        {/* Double Hospital Pillows behind Back & Neck */}
        <rect x="270" y="110" width="260" height="90" rx="20" fill="url(#pillowGrad)" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M 285 155 Q 400 165 515 155" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />
        <rect x="280" y="170" width="240" height="110" rx="22" fill="url(#pillowGrad)" stroke="#e2e8f0" strokeWidth="2" />
        <path d="M 295 225 Q 400 235 505 225" stroke="#cbd5e1" strokeWidth="1.5" fill="none" />

        {/* Horizontal Bed Mattress (Lower body) */}
        <rect x="160" y="440" width="480" height="95" rx="12" fill="url(#bedMattressGrad)" stroke="#cbd5e1" strokeWidth="2" />
        <path d="M 160 485 L 640 485" stroke="#e2e8f0" strokeWidth="1" />

        {/* Safety Bed Railings (Padded Foldable Side Rails) */}
        <g stroke="#94a3b8" strokeWidth="3" fill="none">
          <path d="M 180 380 L 250 380 L 250 450" />
          <path d="M 195 380 L 195 445" />
          <path d="M 220 380 L 220 445" />
          <path d="M 550 380 L 620 380 L 620 450" />
          <path d="M 575 380 L 575 445" />
          <path d="M 600 380 L 600 445" />
        </g>

        {/* 2. Patient Body (High Fowler's Upright Seated) */}
        {/* Head and Neck */}
        <rect x="382" y="150" width="36" height="40" rx="8" fill="url(#patientSkinGrad)" />
        <circle cx="400" cy="125" r="42" fill="url(#patientSkinGrad)" stroke="#fb923c" strokeWidth="1.5" />

        {/* Patient Hair */}
        <path
          d="M 360 120 C 360 80, 440 80, 440 120 C 440 98, 420 86, 400 86 C 380 86, 360 98, 360 120 Z"
          fill="#334155"
        />

        {/* Nasal Cannula Tubing (Across cheeks to nostrils) */}
        <path
          d="M 360 132 Q 380 138 400 134 Q 420 138 440 132"
          stroke="#38bdf8"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="396" cy="132" r="2" fill="#0284c7" />
        <circle cx="404" cy="132" r="2" fill="#0284c7" />
        <path d="M 360 132 C 340 145, 320 200, 290 230" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="4 2" />

        {/* Patient Torso in Hospital Gown */}
        <path
          d="M 320 190 C 340 180, 460 180, 480 190 L 505 380 C 505 400, 295 400, 295 380 Z"
          fill="url(#hospitalGownGrad)"
          stroke="#38bdf8"
          strokeWidth="2"
        />
        {/* Gown V-neck opening for auscultation access */}
        <path d="M 370 190 L 400 240 L 430 190" stroke="#0284c7" strokeWidth="2" fill="#ffffff" opacity="0.6" />

        {/* Arms Resting on Bed */}
        <path d="M 315 210 Q 275 280 270 380" stroke="#bae6fd" strokeWidth="22" strokeLinecap="round" fill="none" />
        <path d="M 485 210 Q 525 280 530 380" stroke="#bae6fd" strokeWidth="22" strokeLinecap="round" fill="none" />

        {/* Lower Body & Blanket with Pretibial Legs */}
        <path
          d="M 280 400 L 520 400 L 540 500 C 540 515, 260 515, 260 500 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="2"
        />
        {/* Legs exposed for Pitting Edema assessment */}
        <g opacity="0.95">
          {/* Right Leg */}
          <rect x="340" y="430" width="45" height="75" rx="14" fill="url(#patientSkinGrad)" stroke="#fb923c" strokeWidth="1" />
          {/* Left Leg */}
          <rect x="415" y="430" width="45" height="75" rx="14" fill="url(#patientSkinGrad)" stroke="#fb923c" strokeWidth="1" />
          {/* Pretibial Area Edema Indicator (Indentation Rings) */}
          <ellipse cx="362" cy="465" rx="14" ry="8" fill="#fdba74" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" />
          <ellipse cx="438" cy="465" rx="14" ry="8" fill="#fdba74" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3 2" />
        </g>

        {/* 3. Anatomical Overlay (Lungs & Heart on Chest) */}
        <g id="anatomicalLayers">
          {/* Trachea and Bronchial Bifurcation */}
          <path d="M 400 220 L 400 250 M 400 250 L 375 270 M 400 250 L 425 270" stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* Right Lung (3 Lobes) */}
          <path
            d="M 382 245 C 340 240, 335 290, 335 320 C 335 345, 360 355, 385 345 C 385 300, 385 260, 382 245 Z"
            fill="url(#lungGradient)"
            stroke="#ec4899"
            strokeWidth="1.5"
          />
          {/* Right Lung Base Fluid Transudation Ripples (Fine Crepitation Area) */}
          <g opacity="0.8">
            <ellipse cx="360" cy="335" rx="16" ry="6" fill="none" stroke="#0284c7" strokeWidth="1.5" className="animate-pulse" />
            <ellipse cx="360" cy="335" rx="10" ry="4" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="355" cy="330" r="1.5" fill="#0284c7" />
            <circle cx="366" cy="334" r="1.5" fill="#0284c7" />
            <circle cx="358" cy="338" r="1.5" fill="#0284c7" />
          </g>

          {/* Left Lung (2 Lobes with Cardiac Notch) */}
          <path
            d="M 418 245 C 460 240, 465 290, 465 320 C 465 345, 440 355, 415 345 C 418 310, 422 280, 418 245 Z"
            fill="url(#lungGradient)"
            stroke="#ec4899"
            strokeWidth="1.5"
          />
          {/* Left Lung Base Fluid Transudation Ripples */}
          <g opacity="0.8">
            <ellipse cx="440" cy="335" rx="16" ry="6" fill="none" stroke="#0284c7" strokeWidth="1.5" className="animate-pulse" />
            <ellipse cx="440" cy="335" rx="10" ry="4" fill="none" stroke="#38bdf8" strokeWidth="1" />
            <circle cx="435" cy="330" r="1.5" fill="#0284c7" />
            <circle cx="446" cy="334" r="1.5" fill="#0284c7" />
            <circle cx="438" cy="338" r="1.5" fill="#0284c7" />
          </g>

          {/* Left Ventricle Heart Apex (Synchronized Heart Pulse) */}
          <g
            id="pulsingHeart"
            style={{
              transformOrigin: '416px 305px',
              animation: `cardiacBeep ${pulseDuration} ease-in-out infinite`
            }}
          >
            <path
              d="M 405 285 C 390 280, 390 305, 415 325 C 440 305, 440 280, 425 285 C 415 290, 415 290, 405 285 Z"
              fill="url(#heartGradient)"
              stroke="#ffffff"
              strokeWidth="1.5"
              filter="url(#glowPulse)"
            />
            {/* S3 Gallop Sound Acoustic Wave Rings */}
            <circle cx="415" cy="315" r="12" fill="none" stroke="#fda4af" strokeWidth="1.5" opacity="0.6" className="animate-ping" />
          </g>
        </g>

        {/* 4. Peripheral Clinical Equipment In-Scene */}
        {/* IV Stand Pole (Left) */}
        <g opacity="0.85">
          <line x1="110" y1="80" x2="110" y2="550" stroke="#94a3b8" strokeWidth="4" />
          <path d="M 90 90 L 110 80 L 130 90" stroke="#64748b" strokeWidth="3" fill="none" />
          {/* IV Bag with Normal Saline */}
          <rect x="96" y="95" width="28" height="50" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
          <path d="M 102 110 L 118 110 M 110 104 L 110 116" stroke="#0284c7" strokeWidth="1.5" />
          {/* IV Infusion Drip Line */}
          <path d="M 110 145 C 110 240, 230 300, 275 360" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="5 3" />
        </g>

        {/* Bedside Heart Monitor Screen (Right) */}
        <g opacity="0.9">
          <rect x="670" y="140" width="105" height="85" rx="10" fill="#0f172a" stroke="#475569" strokeWidth="2" />
          <rect x="675" y="145" width="95" height="75" rx="6" fill="#020617" />
          {/* Live Mini EKG Trace Line */}
          <path
            d="M 680 180 L 700 180 L 705 170 L 710 195 L 715 160 L 720 185 L 725 180 L 760 180"
            stroke="#22c55e"
            strokeWidth="1.8"
            fill="none"
          />
          <text x="682" y="160" fill="#22c55e" fontSize="11" fontFamily="monospace" fontWeight="bold">HR 112</text>
          <text x="732" y="160" fill="#38bdf8" fontSize="10" fontFamily="monospace">95%</text>
          <text x="682" y="210" fill="#f43f5e" fontSize="9" fontFamily="monospace">BP 168/98</text>
        </g>
      </svg>

      {/* 5. Interactive Hotspots Overlay (Positioned precisely over SVG coordinates) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {hotspots.map(h => {
          const isDiscovered = h.discovered;
          const isActive = activeHotspotId === h.id;

          return (
            <button
              key={h.id}
              onClick={() => onTapHotspot(h)}
              style={{ top: `${h.y}%`, left: `${h.x}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto w-11 h-11 flex items-center justify-center rounded-full border-2 transition-all transform hover:scale-125 active:scale-95 group shadow-lg ${
                isActive
                  ? 'bg-rose-600 border-white text-white ring-4 ring-rose-300 scale-125 z-40 shadow-rose-400'
                  : isDiscovered
                  ? 'bg-rose-500 border-white text-white shadow-rose-300 ring-2 ring-rose-200'
                  : 'bg-gradient-to-tr from-pink-500 to-rose-500 border-white text-white animate-pulse ring-4 ring-pink-200/90 hover:animate-none'
              }`}
              title={h.title}
            >
              <Stethoscope className="w-5 h-5 text-white" />

              {/* Ping Ring for undiscovered */}
              {!isDiscovered && (
                <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-60 pointer-events-none" />
              )}

              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                <div className="bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap shadow-xl border border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isDiscovered ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    <span>{h.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 font-normal mt-0.5">
                    {isDiscovered ? 'ตรวจแล้ว (แตะเพื่อดูซ้ำ)' : 'แตะเพื่อฟังเสียงและตรวจร่างกาย'}
                  </div>
                </div>
                <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Subtle Bottom Instruction Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 pointer-events-none flex justify-between items-center bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-pink-100 shadow-sm">
        <span className="text-xs text-slate-700 font-medium flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-rose-500" />
          <span>แตะที่จุดตรวจ (Stethoscope) บนตัวผู้ป่วยเพื่อฟังเสียงปอด เสียงหัวใจ และตรวจร่างกาย</span>
        </span>
        <span className="text-[11px] font-mono text-rose-600 font-bold hidden sm:inline">
          ตรวจพบ: {hotspots.filter(h => h.discovered).length} / {hotspots.length} จุด
        </span>
      </div>

      {/* Global CSS for Heartbeat Keyframes */}
      <style>{`
        @keyframes cardiacBeep {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.16); }
          30% { transform: scale(1.02); }
          45% { transform: scale(1.10); }
          60% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
