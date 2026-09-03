import React, { useState } from 'react';
import { Lightbulb, X, HelpCircle, ShieldCheck, UserCheck, Sparkles, BookOpen } from 'lucide-react';
import { CLINICAL_HINTS } from '../../data/clinicalHintsData';
import { GameStage } from '../../types/game';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface ClinicalHintModalProps {
  currentStage: GameStage;
  isOpen: boolean;
  onClose: () => void;
  onHintUsed?: () => void;
}

export const ClinicalHintModal: React.FC<ClinicalHintModalProps> = ({
  currentStage,
  isOpen,
  onClose,
  onHintUsed
}) => {
  const [revealedLevel, setRevealedLevel] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const hint = CLINICAL_HINTS[currentStage] || {
    stage: currentStage,
    observationHint: 'ทบทวนข้อมูลสัญญาณชีพและประวัติการเจ็บป่วยของผู้ป่วย เพื่อประกอบการตัดสินใจตามหลักการพยาบาล',
    pathophysiologyHint: 'คำนึงถึงความปลอดภัยของผู้ป่วยตามลำดับความเร่งด่วน Airway > Breathing > Circulation'
  };

  const handleRevealLevel2 = () => {
    clinicalAudio.playHeartBeep(880, 0.08);
    setRevealedLevel(2);
    if (onHintUsed) onHintUsed();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-pink-100 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Advisor Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-400 text-white flex items-center justify-center shadow-md shadow-amber-200 shrink-0">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>ปรึกษาพี่พยาบาลหัวหน้าเวร (In-charge Consultation)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              คำแนะนำและแนวทางคิดทางคลินิก
            </h3>
          </div>
        </div>

        {/* Level 1 Hint: Observation */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>ระดับที่ 1: จุดสังเกตทางคลินิก (Clinical Observation)</span>
            </span>
            <span className="text-[10px] font-mono text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded-full">
              Level 1
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {hint.observationHint}
          </p>
        </div>

        {/* Level 2 Hint: Pathophysiology */}
        {revealedLevel === 2 ? (
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 mb-5 animate-in fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                <span>ระดับที่ 2: กลไกทางพยาธิสรีรวิทยา (Pathophysiology)</span>
              </span>
              <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                Level 2
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {hint.pathophysiologyHint}
            </p>
          </div>
        ) : (
          <button
            onClick={handleRevealLevel2}
            className="w-full py-2.5 px-4 mb-5 rounded-2xl border border-dashed border-rose-300 text-rose-600 bg-rose-50/50 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-rose-500" />
            <span>ต้องการคำใบ้เชิงลึกเพิ่มเติม (เปิดกลไกพยาธิสรีรวิทยา)</span>
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all"
        >
          เข้าใจแนวทางแล้ว & ปิดหน้าต่าง
        </button>
      </div>
    </div>
  );
};
