import React, { useEffect, useRef } from 'react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { Activity, Heart, AlertTriangle } from 'lucide-react';

export type EKGRhythmType = 'NORMAL' | 'SINUS_TACHY' | 'SVT' | 'VT';

interface CanvasEKGProps {
  rhythm?: EKGRhythmType;
  heartRate?: number;
  height?: number;
  enableAudioBeep?: boolean;
  className?: string;
}

export const CanvasEKG: React.FC<CanvasEKGProps> = ({
  rhythm = 'SINUS_TACHY',
  heartRate = 112,
  height = 130,
  enableAudioBeep = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastBeepTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    canvas.height = height;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let x = 0;
    const speed = 2.4;
    const sweepClearAhead = 24;
    let phase = 0;
    let lastY = height / 2;

    const render = () => {
      // Clear a small strip ahead of the sweep cursor
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(x, 0, sweepClearAhead, height);

      // Re-draw subtle medical grid lines
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = Math.floor(x / 20) * 20; gx < x + sweepClearAhead; gx += 20) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = 0; gy < height; gy += 20) {
        ctx.moveTo(x, gy);
        ctx.lineTo(x + sweepClearAhead, gy);
      }
      ctx.stroke();

      const baselineY = height * 0.55;
      let y = baselineY;

      const framesPerBeat = (3600 / heartRate);
      const beatProgress = (phase % framesPerBeat) / framesPerBeat;

      if (rhythm === 'NORMAL') {
        if (beatProgress > 0.1 && beatProgress < 0.2) {
          y -= Math.sin((beatProgress - 0.1) * 10 * Math.PI) * 8;
        } else if (beatProgress >= 0.26 && beatProgress < 0.28) {
          y += 6;
        } else if (beatProgress >= 0.28 && beatProgress < 0.34) {
          const rProg = (beatProgress - 0.28) / 0.06;
          y -= Math.sin(rProg * Math.PI) * (height * 0.42);

          if (rProg > 0.4 && rProg < 0.6 && enableAudioBeep) {
            const now = Date.now();
            if (now - lastBeepTimeRef.current > 400) {
              clinicalAudio.playHeartBeep(880, 0.07);
              lastBeepTimeRef.current = now;
            }
          }
        } else if (beatProgress >= 0.34 && beatProgress < 0.38) {
          y += 12;
        } else if (beatProgress >= 0.5 && beatProgress < 0.7) {
          y -= Math.sin((beatProgress - 0.5) * 5 * Math.PI) * 14;
        }
      } else if (rhythm === 'SINUS_TACHY') {
        if (beatProgress > 0.08 && beatProgress < 0.18) {
          y -= Math.sin((beatProgress - 0.08) * 10 * Math.PI) * 7;
        } else if (beatProgress >= 0.24 && beatProgress < 0.26) {
          y += 5;
        } else if (beatProgress >= 0.26 && beatProgress < 0.32) {
          const r = Math.sin(((beatProgress - 0.26) / 0.06) * Math.PI);
          y -= r * (height * 0.40);

          if (enableAudioBeep) {
            const now = Date.now();
            if (now - lastBeepTimeRef.current > 300) {
              clinicalAudio.playHeartBeep(920, 0.06);
              lastBeepTimeRef.current = now;
            }
          }
        } else if (beatProgress >= 0.32 && beatProgress < 0.36) {
          y += 10;
        } else if (beatProgress >= 0.45 && beatProgress < 0.65) {
          y -= Math.sin((beatProgress - 0.45) * 5 * Math.PI) * 12;
        }
      } else if (rhythm === 'SVT') {
        if (beatProgress >= 0.15 && beatProgress < 0.30) {
          y -= Math.sin(((beatProgress - 0.15) / 0.15) * Math.PI) * (height * 0.44);

          if (enableAudioBeep) {
            const now = Date.now();
            if (now - lastBeepTimeRef.current > 200) {
              clinicalAudio.playHeartBeep(1040, 0.05);
              lastBeepTimeRef.current = now;
            }
          }
        } else if (beatProgress >= 0.30 && beatProgress < 0.38) {
          y += 14;
        } else if (beatProgress >= 0.45 && beatProgress < 0.7) {
          y -= Math.sin((beatProgress - 0.45) * 4 * Math.PI) * 10;
        }
      } else if (rhythm === 'VT') {
        const vtWave = Math.sin(beatProgress * 2 * Math.PI);
        y -= Math.sin(beatProgress * Math.PI) * (height * 0.38) - (vtWave * 4);

        if (beatProgress > 0.4 && beatProgress < 0.6 && enableAudioBeep) {
          const now = Date.now();
          if (now - lastBeepTimeRef.current > 250) {
            clinicalAudio.playHeartBeep(700, 0.09);
            lastBeepTimeRef.current = now;
          }
        }
      }

      y += (Math.random() - 0.5) * 1.5;

      ctx.strokeStyle = rhythm === 'VT' || rhythm === 'SVT' ? '#f43f5e' : '#10b981';
      ctx.lineWidth = 2.4;
      ctx.shadowColor = rhythm === 'VT' || rhythm === 'SVT' ? '#f43f5e' : '#10b981';
      ctx.shadowBlur = 6;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(x === 0 ? 0 : x - speed, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      lastY = y;
      phase++;
      x += speed;

      if (x >= width) {
        x = 0;
        lastY = baselineY;
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [rhythm, heartRate, height, enableAudioBeep]);

  return (
    <div className={`relative bg-[#0a0f1d] rounded-2xl overflow-hidden border-2 border-slate-200/80 shadow-md ${className}`}>
      {/* Lead & Mode Overlay */}
      <div className="absolute top-2.5 left-3 flex items-center gap-2.5 z-10 text-xs font-mono select-none">
        <span className="bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
          LEAD II
        </span>
        <span className="text-slate-400 text-[11px]">1.0 mV/cm</span>
      </div>

      <div className="absolute top-2.5 right-3 flex items-center gap-2 z-10 select-none">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono shadow-sm ${
          rhythm === 'VT' || rhythm === 'SVT' 
            ? 'bg-rose-500 text-white animate-pulse'
            : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
        }`}>
          {rhythm === 'NORMAL' && 'NSR Normal'}
          {rhythm === 'SINUS_TACHY' && 'Sinus Tachycardia'}
          {rhythm === 'SVT' && 'SVT (Critical)'}
          {rhythm === 'VT' && 'VT (Arrhythmia)'}
        </span>
        <div className="flex items-center bg-slate-900/95 border border-slate-700 px-2.5 py-0.5 rounded-lg shadow-sm">
          <Heart className="w-3.5 h-3.5 text-rose-500 mr-1 animate-pulse" />
          <span className="text-xs text-slate-400 mr-1 font-mono">HR:</span>
          <span className={`text-sm font-bold font-mono ${
            heartRate > 120 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
          }`}>
            {heartRate}
          </span>
          <span className="text-[10px] text-slate-400 ml-1">bpm</span>
        </div>
      </div>

      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
