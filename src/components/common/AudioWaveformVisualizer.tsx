import React, { useEffect, useRef, useState } from 'react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { Activity, Volume2, Sparkles } from 'lucide-react';

interface AudioWaveformVisualizerProps {
  height?: number;
  className?: string;
  activeFindingType?: 'lung' | 'heart' | null;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformVisualizerProps> = ({
  height = 90,
  className = '',
  activeFindingType = null
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animIdRef = useRef<number | null>(null);
  const [currentSoundType, setCurrentSoundType] = useState<'crepitation' | 's3' | 'idle'>('idle');

  useEffect(() => {
    const unsubscribe = clinicalAudio.onAuscultation((type) => {
      if (type === 'crepitation' || type === 's3') {
        setCurrentSoundType(type);
        setTimeout(() => {
          setCurrentSoundType('idle');
        }, 2200);
      } else {
        setCurrentSoundType('idle');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    canvas.height = height;

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    let step = 0;

    const render = () => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 25) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Waveform line
      const centerY = height / 2;
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = currentSoundType === 'crepitation'
        ? '#38bdf8' // Cyan crackles
        : currentSoundType === 's3'
        ? '#f43f5e' // Rose heart gallop
        : '#10b981'; // Resting baseline green

      for (let x = 0; x < width; x++) {
        let y = centerY;
        const normX = x / width;

        if (currentSoundType === 'crepitation') {
          // Fine Crackles: High frequency sporadic sharp spikes
          const noise = (Math.sin((x * 0.4) + step * 0.2) + Math.sin(x * 0.8)) * 3;
          const crackle = Math.random() < 0.08 ? (Math.random() - 0.5) * (height * 0.7) : 0;
          y = centerY + noise + crackle;
        } else if (currentSoundType === 's3') {
          // S3 Gallop: Lub-Dub-Ta rhythmic 3 wave envelope
          const beatPhase = (x * 0.03 - step * 0.1) % (Math.PI * 2);
          const s1 = Math.sin(beatPhase * 4) * (height * 0.28);
          const s3 = Math.sin(beatPhase * 2 + 1.2) * (height * 0.18);
          y = centerY + s1 + s3;
        } else {
          // Resting baseline gentle breathing wave
          y = centerY + Math.sin((x * 0.02) + step * 0.04) * 4;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      step++;
      animIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
    };
  }, [currentSoundType, height]);

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner ${className}`}>
      {/* Waveform Header Label */}
      <div className="absolute top-2 left-3 flex items-center gap-2 z-10 text-[10px] font-mono">
        <span className={`px-2 py-0.5 rounded-full font-bold ${
          currentSoundType === 'crepitation'
            ? 'bg-sky-500 text-white animate-pulse'
            : currentSoundType === 's3'
            ? 'bg-rose-500 text-white animate-pulse'
            : 'bg-slate-800 text-slate-300 border border-slate-700'
        }`}>
          {currentSoundType === 'crepitation' && 'FINE CREPITATION (CRACKLES)'}
          {currentSoundType === 's3' && 'S3 VENTRICULAR GALLOP'}
          {currentSoundType === 'idle' && 'AUSCULTATION OSCILLOSCOPE'}
        </span>
        <span className="text-slate-400 hidden sm:inline text-[9px]">
          {currentSoundType !== 'idle' ? 'Live Audio Waveform' : 'แตะจุดตรวจเพื่อฟังเสียงจริง'}
        </span>
      </div>

      <canvas ref={canvasRef} className="w-full block" />
    </div>
  );
};
