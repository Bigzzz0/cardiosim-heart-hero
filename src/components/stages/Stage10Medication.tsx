import React, { useState } from 'react';
import { MEDICATION_CHOICES, MEDICATION_PREPARATION_STEPS } from '../../data/medicationStepsData';
import { MedicationStep } from '../../types/game';
import { Pill, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck, ArrowDown, ArrowUp, Sparkles, FileCheck, Lightbulb } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { ClinicalHintModal } from '../common/ClinicalHintModal';
import { FurosemideSyringeVisualizer } from '../medical/FurosemideSyringeVisualizer';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';

interface Stage10MedicationProps {
  onComplete: () => void;
}

export const Stage10Medication: React.FC<Stage10MedicationProps> = ({ onComplete }) => {
  const [selectedDrugId, setSelectedDrugId] = useState<string>('furosemide');
  const [showHintModal, setShowHintModal] = useState(false);

  const [orderedSteps, setOrderedSteps] = useState<MedicationStep[]>([
    MEDICATION_PREPARATION_STEPS[2],
    MEDICATION_PREPARATION_STEPS[0],
    MEDICATION_PREPARATION_STEPS[4],
    MEDICATION_PREPARATION_STEPS[1],
    MEDICATION_PREPARATION_STEPS[6],
    MEDICATION_PREPARATION_STEPS[3],
    MEDICATION_PREPARATION_STEPS[5]
  ]);

  const moveStep = (index: number, direction: 'up' | 'down') => {
    clinicalAudio.playHeartBeep(800, 0.05);
    const newSteps = [...orderedSteps];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIdx];
    newSteps[targetIdx] = temp;
    setOrderedSteps(newSteps);
  };

  const handleAutoSort = () => {
    setOrderedSteps([...MEDICATION_PREPARATION_STEPS]);
    clinicalAudio.playSuccessChime();
  };

  const isSequenceCorrect = orderedSteps.every((step, idx) => step.stepNumber === idx + 1);

  const handleNext = () => {
    clinicalAudio.playSuccessChime();
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner with SpotlightCard */}
      <SpotlightCard
        className="p-6 mb-6 shadow-md border-pink-100/80"
        spotlightColor="rgba(244, 63, 94, 0.08)"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                ภารกิจที่ 5 / บริหารยา & เตรียมยา (NCJMM: Take Action)
              </span>
              <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
                ความคืบหน้า 40%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
              เลือกยาและเรียงลำดับ 7 ขั้นตอนการเตรียมยา (Medication Safety)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              เลือกยาตามคำสั่งแพทย์ ตรวจสอบผลข้างเคียง และเรียงลำดับขั้นตอนการบริหารยาตามหลัก 6 Rights
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              onClick={() => setShowHintModal(true)}
              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-sm active:scale-95"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>ปรึกษาหัวหน้าเวร</span>
            </button>

            <button
              onClick={handleAutoSort}
              className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-semibold active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>(เฉลยลัด) เรียง 1-7 ถูกต้อง</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      <ClinicalHintModal
        currentStage="STAGE6_MEDICATION"
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
      />

      {/* Part 1: Select Drug & Caution */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xl mb-6">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3.5 flex items-center gap-2">
          <Pill className="w-4 h-4 text-rose-500" />
          <span>ส่วนที่ 1: เลือกยาขับปัสสาวะตามคำสั่งแพทย์ (Doctor's Order)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
          {MEDICATION_CHOICES.map(drug => {
            const isSelected = selectedDrugId === drug.id;
            return (
              <button
                key={drug.id}
                onClick={() => {
                  setSelectedDrugId(drug.id);
                  clinicalAudio.playHeartBeep(880, 0.06);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-slate-800">{drug.name}</span>
                  {drug.isCorrect && (
                    <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-mono font-bold">
                      Order Stat
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{drug.indication}</p>
              </button>
            );
          })}
        </div>

        {/* Cautions Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>ผลข้างเคียงและข้อควรระวังสำคัญของ Furosemide (Lasix):</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <span className="flex items-center gap-1.5">
              • เฝ้าระวังความดันโลหิตต่ำ (Hypotension จากการขับน้ำ)
            </span>
            <span className="flex items-center gap-1.5">
              • เฝ้าระวังโพแทสเซียมต่ำ (Hypokalemia นำสู่หัวใจเต้นผิดจังหวะ)
            </span>
            <span className="flex items-center gap-1.5">
              • บันทึกปริมาณปัสสาวะอย่างใกล้ชิด (Strict Urine Output)
            </span>
            <span className="flex items-center gap-1.5">
              • ฉีดเข้าหลอดเลือดดำช้าๆ (Slow IV push 1-2 นาที ป้องกัน Ototoxicity)
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Medical Equipment: Syringe & Ampoule Simulation */}
      <FurosemideSyringeVisualizer />

      {/* Part 2: Order 7 Steps */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xl mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>ส่วนที่ 2: เรียงลำดับ 7 ขั้นตอนการเตรียมยาให้ถูกต้อง</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              ใช้ปุ่มลูกศรขึ้น/ลง เพื่อจัดเรียงลำดับ 1 ถึง 7 ตามหลัก 6 Rights และความปลอดภัย
            </p>
          </div>

          <span className={`text-xs px-3 py-1 rounded-full font-bold font-mono border flex items-center gap-1.5 ${
            isSequenceCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}>
            {isSequenceCorrect ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>เรียงถูกต้อง 7/7 สเต็ป</span>
              </>
            ) : (
              <span>ยังเรียงไม่ถูกต้อง</span>
            )}
          </span>
        </div>

        <div className="space-y-2.5">
          {orderedSteps.map((step, idx) => {
            const isCurrentPosCorrect = step.stepNumber === idx + 1;
            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isCurrentPosCorrect
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl font-mono text-xs font-bold flex items-center justify-center border ${
                    isCurrentPosCorrect
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}>
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {step.text}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 border border-slate-200 shadow-sm"
                    title="เลื่อนขึ้น"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, 'down')}
                    disabled={idx === orderedSteps.length - 1}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-30 text-slate-600 border border-slate-200 shadow-sm"
                    title="เลื่อนลง"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Next Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isSequenceCorrect ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>เตรียมยาถูกต้องเรียบร้อย สามารถไปบันทึกสารน้ำ I/O ได้</span>
            </>
          ) : (
            <span>กรุณาเรียงลำดับขั้นตอนให้ถูกต้อง</span>
          )}
        </p>

        <ShinyButton
          onClick={handleNext}
          disabled={!isSequenceCorrect}
          variant="primary"
          size="lg"
          icon={<ChevronRight className="w-4 h-4" />}
        >
          ไปสู่การบันทึกสารน้ำเข้า-ออก I/O (Next)
        </ShinyButton>
      </div>
    </div>
  );
};
