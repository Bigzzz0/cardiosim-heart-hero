import React from 'react';
import { Droplet, ArrowDown, Activity, Sparkles, CheckCircle2, TrendingDown } from 'lucide-react';

interface FluidBalanceVisualizerProps {
  intakeTotal?: number;
  outputTotal?: number;
}

export const FluidBalanceVisualizer: React.FC<FluidBalanceVisualizerProps> = ({
  intakeTotal = 150,
  outputTotal = 350
}) => {
  const netBalance = intakeTotal - outputTotal;

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-sky-50/30 rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-md mb-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center shadow-sm">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600 uppercase tracking-wider">
              <span>การจำลองระบบสารน้ำทางการแพทย์ (Clinical Fluid Dynamics)</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
              ระบบให้สารน้ำทางหลอดเลือด (IV Drip) และถุงระบายปัสสาวะ (Foley Bag)
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-2xl">
          <TrendingDown className="w-4 h-4 text-rose-600" />
          <span>สมดุลสารน้ำสุทธิ: <strong className="font-mono text-rose-700">{netBalance} mL (ติดลบ = น้ำลด)</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: IV Infusion System (5 cols) */}
        <div className="md:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>สารน้ำเข้า (Total Intake)</span>
            </span>
            <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
              {intakeTotal} mL
            </span>
          </div>

          {/* SVG IV Infusion Pole & Drip Chamber */}
          <div className="py-2 flex justify-center">
            <svg width="180" height="200" viewBox="0 0 180 200">
              <defs>
                <linearGradient id="ivBagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#e0f2fe" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.9" />
                </linearGradient>

                <linearGradient id="ivLiquidLevel" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.7" />
                </linearGradient>
              </defs>

              {/* Stainless IV Pole Stand */}
              <line x1="90" y1="5" x2="90" y2="195" stroke="#94a3b8" strokeWidth="3" />
              <path d="M 65 18 L 90 8 L 115 18" stroke="#64748b" strokeWidth="2.5" fill="none" />

              {/* IV Bag Hanging Ring & Hanger */}
              <ellipse cx="90" cy="22" rx="6" ry="3" fill="none" stroke="#64748b" strokeWidth="1.5" />

              {/* 500 mL IV Fluid Bag (0.9% NSS) */}
              <path
                d="M 60 26 C 60 24, 120 24, 120 26 L 122 100 C 122 110, 58 110, 58 100 Z"
                fill="url(#ivBagGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              {/* Liquid inside IV Bag */}
              <path
                d="M 61 50 L 119 50 L 121 98 C 121 106, 59 106, 59 98 Z"
                fill="url(#ivLiquidLevel)"
              />
              {/* Bag Label */}
              <rect x="68" y="55" width="44" height="32" rx="3" fill="#ffffff" opacity="0.95" />
              <text x="90" y="65" fontSize="6" fontWeight="bold" fill="#0369a1" textAnchor="middle">0.9% NaCl</text>
              <text x="90" y="73" fontSize="5" fill="#64748b" textAnchor="middle">500 mL IV</text>
              <text x="90" y="81" fontSize="4.5" fontWeight="bold" fill="#be123c" textAnchor="middle">KVO 100 mL</text>

              {/* Drip Chamber Spike & Chamber */}
              <rect x="85" y="108" width="10" height="8" fill="#cbd5e1" stroke="#94a3b8" />
              {/* Transparent Drip Chamber */}
              <rect x="82" y="116" width="16" height="38" rx="4" fill="#f8fafc" stroke="#38bdf8" strokeWidth="1.2" opacity="0.9" />
              {/* Meniscus in Drip Chamber */}
              <rect x="83" y="138" width="14" height="15" rx="2" fill="#7dd3fc" opacity="0.8" />

              {/* Animated Falling Drip Droplet */}
              <circle cx="90" cy="126" r="2.5" fill="#0284c7" className="animate-bounce" />

              {/* Roller Clamp Controller */}
              <rect x="84" y="162" width="12" height="16" rx="2" fill="#f43f5e" stroke="#be123c" strokeWidth="0.8" />
              <circle cx="90" cy="170" r="3" fill="#ffffff" />

              {/* Infusion Tubing leading to patient cannula */}
              <path d="M 90 154 L 90 162 M 90 178 Q 90 195 140 195" stroke="#38bdf8" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="text-[11px] text-slate-500 bg-sky-50/70 p-2 rounded-xl border border-sky-100 text-center w-full">
            IV Fluid 100 mL + ยาฉีดและน้ำจิบ 50 mL
          </div>
        </div>

        {/* Center: Fluid Net Equation Column (2 cols) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center py-2">
          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-mono font-extrabold text-slate-700 text-lg shadow-inner mb-2">
            -
          </div>
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 text-center">
            Intake ลบ Output
          </span>
          <div className="w-px h-12 bg-slate-200 my-2 hidden md:block" />
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 font-mono font-bold text-sm shadow-sm">
            =
          </div>
        </div>

        {/* Right: Foley Catheter Urine Bag (5 cols) */}
        <div className="md:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>สารน้ำออก (Total Output)</span>
            </span>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              {outputTotal} mL
            </span>
          </div>

          {/* SVG Foley Drainage Bag */}
          <div className="py-2 flex justify-center">
            <svg width="180" height="200" viewBox="0 0 180 200">
              <defs>
                <linearGradient id="foleyBagGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.8" />
                </linearGradient>

                <linearGradient id="urineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
                  <stop offset="50%" stopColor="#fde047" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#eab308" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Inflow Drainage Tube from Patient Catheter */}
              <path d="M 40 10 Q 75 10 90 35" stroke="#fde047" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 40 10 Q 75 10 90 35" stroke="#ca8a04" strokeWidth="1" fill="none" strokeDasharray="4 2" />

              {/* Bag Bed Hanger Hooks */}
              <path d="M 70 30 L 70 20 Q 70 12 78 12 Q 86 12 86 20" stroke="#64748b" strokeWidth="2.5" fill="none" />
              <path d="M 94 30 L 94 20 Q 94 12 102 12 Q 110 12 110 20" stroke="#64748b" strokeWidth="2.5" fill="none" />

              {/* Anti-reflux Valve Chamber */}
              <rect x="80" y="32" width="20" height="14" rx="3" fill="#cbd5e1" stroke="#94a3b8" />

              {/* Foley Drainage Bag Body (1000 mL capacity) */}
              <path
                d="M 45 46 C 45 42, 135 42, 135 46 L 140 155 C 140 168, 40 168, 40 155 Z"
                fill="url(#foleyBagGrad)"
                stroke="#94a3b8"
                strokeWidth="1.5"
              />

              {/* Calibrated Graduations (100, 200, 300, 400, 500 mL) */}
              <line x1="50" y1="145" x2="65" y2="145" stroke="#64748b" strokeWidth="1" />
              <text x="70" y="148" fontSize="7" fill="#64748b" fontFamily="monospace">100</text>
              <line x1="50" y1="130" x2="65" y2="130" stroke="#64748b" strokeWidth="1" />
              <text x="70" y="133" fontSize="7" fill="#64748b" fontFamily="monospace">200</text>
              <line x1="50" y1="115" x2="70" y2="115" stroke="#64748b" strokeWidth="1.2" />
              <text x="75" y="118" fontSize="7" fontWeight="bold" fill="#64748b" fontFamily="monospace">300</text>
              <line x1="50" y1="100" x2="65" y2="100" stroke="#64748b" strokeWidth="1" />
              <text x="70" y="103" fontSize="7" fill="#64748b" fontFamily="monospace">400</text>
              <line x1="50" y1="85" x2="70" y2="85" stroke="#64748b" strokeWidth="1.2" />
              <text x="75" y="88" fontSize="7" fill="#64748b" fontFamily="monospace">500</text>

              {/* Realistic Amber Urine Liquid filled to 350 mL mark (y=108) */}
              <path
                d="M 43 108 C 50 106, 130 106, 137 108 L 139 154 C 139 166, 41 166, 41 154 Z"
                fill="url(#urineGrad)"
                stroke="#ca8a04"
                strokeWidth="1"
              />
              {/* Highlight line on liquid surface */}
              <path d="M 45 108 Q 90 111 135 108" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8" />

              {/* 350 mL Mark Target Indicator */}
              <line x1="130" y1="108" x2="152" y2="108" stroke="#d97706" strokeWidth="1.8" strokeDasharray="3 1" />
              <rect x="146" y="100" width="30" height="15" rx="3" fill="#fef3c7" stroke="#d97706" strokeWidth="0.8" />
              <text x="161" y="111" fontSize="7.5" fontWeight="bold" fill="#b45309" textAnchor="middle">350 mL</text>

              {/* Drainage Outlet Valve at bottom */}
              <rect x="85" y="166" width="10" height="14" fill="#94a3b8" rx="2" />
              <rect x="82" y="180" width="16" height="6" rx="2" fill="#0284c7" />
            </svg>
          </div>

          <div className="text-[11px] text-slate-500 bg-amber-50/70 p-2 rounded-xl border border-amber-100 text-center w-full">
            ปัสสาวะสีเหลืองฟางข้าวใส (Clear Amber) 350 mL
          </div>
        </div>
      </div>
    </div>
  );
};
