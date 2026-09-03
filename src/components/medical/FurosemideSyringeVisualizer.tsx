import React, { useState } from 'react';
import { Syringe, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface FurosemideSyringeVisualizerProps {
  onDoseDrawn?: () => void;
}

export const FurosemideSyringeVisualizer: React.FC<FurosemideSyringeVisualizerProps> = ({ onDoseDrawn }) => {
  const [isDrawn, setIsDrawn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleDrawMedication = () => {
    if (isDrawing || isDrawn) return;
    setIsDrawing(true);
    clinicalAudio.playHeartBeep(880, 0.08);

    setTimeout(() => {
      setIsDrawing(false);
      setIsDrawn(true);
      clinicalAudio.playSuccessChime();
      if (onDoseDrawn) onDoseDrawn();
    }, 1200);
  };

  const handleReset = () => {
    setIsDrawn(false);
    setIsDrawing(false);
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-pink-50/30 rounded-3xl border border-pink-100 p-5 sm:p-6 shadow-md mb-6 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-sm">
            <Syringe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 uppercase tracking-wider">
              <span>การจำลองการเตรียมยา (Interactive Syringe & Ampoules)</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
              บริหารยา Furosemide (Lasix) 40 mg IV Stat
            </h4>
          </div>
        </div>

        {isDrawn && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-2xl animate-in fade-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>ดูดยาครบ 4.0 mL (40 mg) พร้อมฉีด IV Push ช้าๆ 2 นาที</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: 2 Amber Glass Ampoules (4 cols) */}
        <div className="md:col-span-4 flex flex-col items-center p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-700 mb-3">
            แอมพูลยาชา (2 หลอด = 40 mg)
          </span>

          <div className="flex items-end justify-center gap-6 py-2">
            {[1, 2].map((num) => (
              <div key={num} className="flex flex-col items-center group">
                {/* SVG Amber Glass Ampoule */}
                <svg width="50" height="130" viewBox="0 0 50 130">
                  <defs>
                    <linearGradient id={`ampGrad_${num}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#b45309" />
                      <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.85" />
                      <stop offset="70%" stopColor="#d97706" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                  </defs>

                  {/* Ampoule Tip */}
                  <path d="M 21 8 Q 25 2 29 8 L 30 22 L 20 22 Z" fill={`url(#ampGrad_${num})`} stroke="#78350f" strokeWidth="1" />
                  {/* Snap Ring (White line) */}
                  <rect x="18" y="24" width="14" height="3" rx="1" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.8" />
                  {/* Ampoule Neck */}
                  <rect x="20" y="27" width="10" height="12" fill={`url(#ampGrad_${num})`} stroke="#78350f" strokeWidth="1" />
                  {/* Ampoule Body */}
                  <path
                    d="M 14 39 C 14 42, 10 48, 10 58 L 10 118 C 10 126, 40 126, 40 118 L 40 58 C 40 48, 36 42, 36 39 Z"
                    fill={`url(#ampGrad_${num})`}
                    stroke="#78350f"
                    strokeWidth="1.2"
                  />
                  {/* White Medical Label */}
                  <rect x="12" y="60" width="26" height="42" rx="3" fill="#ffffff" opacity="0.95" />
                  <text x="25" y="72" fontSize="5.5" fontWeight="bold" fill="#0f172a" textAnchor="middle">FUROSEMIDE</text>
                  <text x="25" y="80" fontSize="5" fontWeight="bold" fill="#be123c" textAnchor="middle">20 mg / 2 mL</text>
                  <text x="25" y="88" fontSize="4" fill="#64748b" textAnchor="middle">(10 mg/mL)</text>
                  <text x="25" y="96" fontSize="3.5" fill="#475569" textAnchor="middle">IV/IM Sterile</text>
                  {/* Liquid meniscus inside ampoule */}
                  <path d="M 12 110 Q 25 113 38 110" stroke="#fef3c7" strokeWidth="1.5" fill="none" opacity="0.7" />
                </svg>
                <span className="text-[10px] font-mono text-slate-500 mt-1 font-semibold">
                  หลอดที่ {num} (20mg)
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-slate-500 text-center mt-2 font-mono">
            หักคอขวด 2 หลอดเพื่อดูดยาขนาน 40 mg (ปริมาตรรวม 4.0 mL)
          </p>
        </div>

        {/* Right: Interactive 5 mL Syringe (8 cols) */}
        <div className="md:col-span-8 flex flex-col justify-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-700">
              กระบอกฉีดยา 5 mL (Calibrated Luer-Lock Syringe)
            </span>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
              ระดับยา: {isDrawn ? '4.0 mL (40 mg)' : isDrawing ? 'กำลังดูดยา...' : '0.0 mL'}
            </span>
          </div>

          {/* SVG 5 mL Syringe with animated piston */}
          <div className="w-full py-4 overflow-x-auto flex justify-center">
            <svg width="420" height="90" viewBox="0 0 420 90">
              <defs>
                <linearGradient id="syringeGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.85" />
                </linearGradient>

                <linearGradient id="medLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#bae6fd" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.95" />
                </linearGradient>
              </defs>

              {/* Syringe Needle & Luer Lock (Left) */}
              <rect x="15" y="43.5" width="45" height="3" fill="#94a3b8" stroke="#64748b" strokeWidth="0.8" />
              <polygon points="15,45 22,43 22,47" fill="#64748b" />
              {/* Luer Hub */}
              <polygon points="60,37 72,39 72,51 60,53" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <rect x="72" y="41" width="10" height="8" fill="#94a3b8" />

              {/* Syringe Barrel (Length 240px representing 0 to 5 mL) */}
              {/* Barrel Outline */}
              <rect
                x="82"
                y="20"
                width="240"
                height="50"
                rx="4"
                fill="url(#syringeGlassGrad)"
                stroke="#64748b"
                strokeWidth="2"
              />

              {/* Clear Medication Fluid inside barrel (fills from x=82 up to 4 mL = 192px width) */}
              <rect
                x="82"
                y="22"
                width={isDrawn ? 192 : isDrawing ? 192 : 0}
                height="46"
                fill="url(#medLiquidGrad)"
                style={{
                  transition: 'width 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              />

              {/* Calibrated Millimeter Scale Marks (0 to 5 mL) */}
              {/* 0 mL */}
              <line x1="84" y1="20" x2="84" y2="35" stroke="#334155" strokeWidth="2" />
              <text x="84" y="16" fontSize="9" fontWeight="bold" fill="#334155" textAnchor="middle">0</text>
              {/* 1 mL */}
              <line x1="132" y1="20" x2="132" y2="32" stroke="#475569" strokeWidth="1.5" />
              <text x="132" y="16" fontSize="8" fill="#475569" textAnchor="middle">1</text>
              {/* 2 mL */}
              <line x1="180" y1="20" x2="180" y2="32" stroke="#475569" strokeWidth="1.5" />
              <text x="180" y="16" fontSize="8" fill="#475569" textAnchor="middle">2</text>
              {/* 3 mL */}
              <line x1="228" y1="20" x2="228" y2="32" stroke="#475569" strokeWidth="1.5" />
              <text x="228" y="16" fontSize="8" fill="#475569" textAnchor="middle">3</text>
              {/* 4 mL (Target Dose) */}
              <line x1="274" y1="20" x2="274" y2="35" stroke="#e11d48" strokeWidth="2.5" />
              <text x="274" y="16" fontSize="9" fontWeight="bold" fill="#e11d48" textAnchor="middle">4 mL</text>
              {/* 5 mL */}
              <line x1="320" y1="20" x2="320" y2="35" stroke="#334155" strokeWidth="2" />
              <text x="320" y="16" fontSize="9" fontWeight="bold" fill="#334155" textAnchor="middle">5</text>

              {/* Minor tick increments (0.2 mL intervals) */}
              {[...Array(25)].map((_, i) => {
                const tickX = 84 + (i * 9.6);
                if (i % 5 === 0) return null;
                return (
                  <line key={i} x1={tickX} y1="20" x2={tickX} y2="27" stroke="#94a3b8" strokeWidth="0.8" />
                );
              })}

              {/* Syringe Plunger (Piston with Black Rubber Stopper) */}
              <g
                style={{
                  transform: isDrawn ? 'translateX(192px)' : isDrawing ? 'translateX(192px)' : 'translateX(0px)',
                  transition: 'transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
              >
                {/* Black Rubber Stopper at head of plunger */}
                <rect x="80" y="21" width="14" height="48" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                <line x1="87" y1="22" x2="87" y2="68" stroke="#475569" strokeWidth="1" />
                {/* Translucent Plunger Shaft */}
                <rect x="94" y="38" width="95" height="14" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
                {/* Plunger Thumb Press Flange */}
                <rect x="189" y="23" width="8" height="44" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1.5" />
              </g>

              {/* Syringe Finger Flanges at end of barrel */}
              <rect x="322" y="10" width="8" height="70" rx="3" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Interactive Button Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              ขนาดที่แพทย์สั่ง: <strong className="text-slate-800">40 mg (ต้องใช้ยา 2 แอมพูล รวม 4.0 mL)</strong>
            </span>

            <div className="flex items-center gap-2">
              {isDrawn && (
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>รีเซ็ต</span>
                </button>
              )}

              <button
                onClick={handleDrawMedication}
                disabled={isDrawn || isDrawing}
                className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                  isDrawn
                    ? 'bg-emerald-600 text-white cursor-default'
                    : isDrawing
                    ? 'bg-rose-400 text-white cursor-wait'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white shadow-rose-200 active:scale-95'
                }`}
              >
                <Syringe className="w-4 h-4" />
                <span>{isDrawn ? 'ดูดยา 4 mL สำเร็จแล้ว' : isDrawing ? 'กำลังดูดยาเข้ากระบอกฉีด...' : 'กดดูดยา 4 mL (40 mg)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
