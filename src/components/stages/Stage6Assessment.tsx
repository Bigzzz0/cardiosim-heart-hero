import React, { useState } from 'react';
import { CASE_1_HOTSPOTS } from '../../data/case1Data';
import { ClinicalHotspot } from '../../types/game';
import { CanvasEKG } from '../ekg/CanvasEKG';
import { AudioWaveformVisualizer } from '../common/AudioWaveformVisualizer';
import { InteractivePatientBedSVG } from '../medical/InteractivePatientBedSVG';
import { Stethoscope, CheckCircle2, ChevronRight, Activity, X, Volume2, Eye, User, Heart, Monitor, FileText, Sparkles, Wind, Droplet } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';

interface Stage6AssessmentProps {
  onComplete: (discoveredHotspots: string[]) => void;
}

export const Stage6Assessment: React.FC<Stage6AssessmentProps> = ({ onComplete }) => {
  const [hotspots, setHotspots] = useState<ClinicalHotspot[]>(CASE_1_HOTSPOTS);
  const [activeModalHotspot, setActiveModalHotspot] = useState<ClinicalHotspot | null>(null);

  const discoveredCount = hotspots.filter(h => h.discovered).length;
  const isAllDiscovered = discoveredCount === hotspots.length;

  const handleTapHotspot = (hotspot: ClinicalHotspot) => {
    if (hotspot.audioSound === 'crepitation') {
      clinicalAudio.playCrepitationSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([40, 50, 40]);
    } else if (hotspot.audioSound === 's3_gallop') {
      clinicalAudio.playS3GallopSound();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([80, 50, 80]);
    } else if (hotspot.audioSound === 'heart_beep') {
      clinicalAudio.playHeartBeep(880, 0.08);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
    } else {
      clinicalAudio.playHeartBeep(750, 0.06);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
    }

    setHotspots(prev => prev.map(h => h.id === hotspot.id ? { ...h, discovered: true } : h));
    setActiveModalHotspot(hotspot);
  };

  const handleReplaySound = (sound?: 'crepitation' | 's3_gallop' | 'heart_beep') => {
    if (sound === 'crepitation') {
      clinicalAudio.playCrepitationSound();
    } else if (sound === 's3_gallop') {
      clinicalAudio.playS3GallopSound();
    } else if (sound === 'heart_beep') {
      clinicalAudio.playHeartBeep(880, 0.08);
    }
  };

  const handleNext = () => {
    clinicalAudio.playSuccessChime();
    onComplete(hotspots.filter(h => h.discovered).map(h => h.id));
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Top Banner with SpotlightCard */}
      <SpotlightCard
        className="p-6 mb-6 shadow-md border-pink-100/80"
        spotlightColor="rgba(244, 63, 94, 0.08)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                ภารกิจที่ 2 / ตรวจร่างกายผู้ป่วย (NCJMM: Recognize Cues)
              </span>
              <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
                ความคืบหน้า 20%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              ประเมินอาการและตรวจร่างกายทางกายภาพ (Physical Examination & Auscultation)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              แตะที่ปุ่ม Stethoscope บนเตียงผู้ป่วยเพื่อฟังเสียงปอด Crepitation, เสียงหัวใจ S3 และตรวจ Pitting Edema
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center bg-rose-50/70 px-4 py-2.5 rounded-2xl border border-rose-100">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">สำรวจแล้ว</div>
              <div className="text-base font-bold font-mono text-rose-600">
                {discoveredCount} / {hotspots.length} จุด
              </div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
              isAllDiscovered ? 'bg-rose-500 text-white shadow-sm shadow-rose-300 animate-pulse' : 'bg-white text-rose-500 border border-rose-200'
            }`}>
              {isAllDiscovered ? <CheckCircle2 className="w-4 h-4" /> : `${discoveredCount}`}
            </div>
          </div>
        </div>
      </SpotlightCard>

      {/* Main Simulation Viewport */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xl mb-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Bed & Patient Interactive SVG Vector Canvas (7 cols) */}
          <div className="lg:col-span-7">
            <InteractivePatientBedSVG
              hotspots={hotspots}
              onTapHotspot={handleTapHotspot}
              activeHotspotId={activeModalHotspot?.id}
              heartRate={112}
            />
          </div>

          {/* Right: Auscultation Waveform & Realtime Monitor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* Live Audio Waveform Visualizer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-sky-600" />
                  <span>กราฟคลื่นเสียงการฟังตรวจ (Auscultation Waveform)</span>
                </span>
              </div>
              <AudioWaveformVisualizer height={80} />
            </div>

            {/* Live Bedside Monitor Widget */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>จอมอนิเตอร์สัญญาณชีพข้างเตียง</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  BED 03
                </span>
              </div>
              <CanvasEKG rhythm="SINUS_TACHY" heartRate={112} height={85} enableAudioBeep={false} />

              <div className="grid grid-cols-3 gap-2 mt-2.5 text-center">
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold">BP</span>
                  <p className="text-xs font-bold font-mono text-slate-800 mt-0.5">168/98</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold">HR</span>
                  <p className="text-xs font-bold font-mono text-rose-600 mt-0.5">112 bpm</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] text-slate-400 font-semibold">SpO2</span>
                  <p className="text-xs font-bold font-mono text-teal-600 mt-0.5">95%</p>
                </div>
              </div>
            </div>

            {/* Discovered Findings List */}
            <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200 flex-1">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-rose-500" />
                <span>บันทึกผลการตรวจ ({discoveredCount}/{hotspots.length})</span>
              </h4>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {hotspots.map(h => (
                  <div
                    key={h.id}
                    onClick={() => handleTapHotspot(h)}
                    className={`p-2 rounded-xl text-xs border cursor-pointer transition-all flex items-center justify-between ${
                      h.discovered
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-white border-slate-200 text-slate-400 hover:border-pink-200'
                    }`}
                  >
                    <span className="font-semibold">{h.title}</span>
                    <span className="text-[10px] font-mono font-medium">
                      {h.discovered ? 'ตรวจแล้ว' : 'แตะเพื่อตรวจ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotspot Popup Modal */}
      {activeModalHotspot && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-pink-200 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModalHotspot(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                  ผลการตรวจร่างกายทางคลินิก
                </span>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeModalHotspot.title}
                </h3>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-4 space-y-2">
              <div className="text-xs font-bold text-rose-600">
                ผลที่ตรวจพบ:
              </div>
              <p className="text-sm font-bold text-slate-800">
                {activeModalHotspot.finding}
              </p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-200">
                {activeModalHotspot.detail}
              </p>
            </div>

            {activeModalHotspot.audioSound && (
              <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-2xl mb-5">
                <div className="flex items-center gap-2 text-xs text-rose-700">
                  <Volume2 className="w-4 h-4 text-rose-600 shrink-0 animate-pulse" />
                  <span>กำลังสังเคราะห์เสียงตรวจทางคลินิก (Web Audio)</span>
                </div>
                <button
                  onClick={() => handleReplaySound(activeModalHotspot.audioSound)}
                  className="px-3 py-1 bg-white border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  ฟังซ้ำ
                </button>
              </div>
            )}

            <button
              onClick={() => setActiveModalHotspot(null)}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-rose-200 transition-all"
            >
              รับทราบผลตรวจ & บันทึก
            </button>
          </div>
        </div>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <ShinyButton
          onClick={handleNext}
          variant="primary"
          size="lg"
          icon={<ChevronRight className="w-4 h-4" />}
        >
          ตรวจร่างกายเสร็จสิ้น & จัดลำดับความสำคัญของปัญหา (Next)
        </ShinyButton>
      </div>
    </div>
  );
};
