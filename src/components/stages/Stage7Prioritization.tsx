import React, { useState } from 'react';
import { NURSING_DIAGNOSES, CLINICAL_CUES } from '../../data/nursingDiagnosesData';
import { NursingDiagnosisCard, ClinicalCue } from '../../types/game';
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DraggableCard } from '../dnd/DraggableCard';
import { DroppableSlot } from '../dnd/DroppableSlot';
import { ClinicalHintModal } from '../common/ClinicalHintModal';
import { CheckCircle2, ChevronRight, AlertCircle, GripVertical, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage7PrioritizationProps {
  onComplete: (userRanking: string[], errorCount: number) => void;
}

export const Stage7Prioritization: React.FC<Stage7PrioritizationProps> = ({ onComplete }) => {
  const [slots, setSlots] = useState<{ [slotId: string]: string | null }>({
    slot_1: null,
    slot_2: null,
    slot_3: null,
    slot_4: null
  });

  const [availableDiagnoses, setAvailableDiagnoses] = useState<NursingDiagnosisCard[]>(NURSING_DIAGNOSES);
  const [errorCount, setErrorCount] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);
  const [selectedDiagId, setSelectedDiagId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  const handleCardTap = (diagId: string) => {
    clinicalAudio.playHeartBeep(880, 0.05);
    setSelectedDiagId(prev => (prev === diagId ? null : diagId));
  };

  const handleSlotTap = (slotKey: string) => {
    if (!selectedDiagId) return;
    clinicalAudio.playHeartBeep(880, 0.08);
    setSlots(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(s => {
        if (next[s] === selectedDiagId) next[s] = null;
      });
      next[slotKey] = selectedDiagId;
      return next;
    });
    setSelectedDiagId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const diagId = active.id as string;
    const targetSlotId = over.id as string;

    clinicalAudio.playHeartBeep(880, 0.06);

    if (['slot_1', 'slot_2', 'slot_3', 'slot_4'].includes(targetSlotId)) {
      setSlots(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(s => {
          if (next[s] === diagId) next[s] = null;
        });
        next[targetSlotId] = diagId;
        return next;
      });
      setSelectedDiagId(null);
    }
  };

  const handleRemoveFromSlot = (slotId: string) => {
    clinicalAudio.playHeartBeep(700, 0.05);
    setSlots(prev => ({
      ...prev,
      [slotId]: null
    }));
  };

  const handleAutoFillCorrect = () => {
    setSlots({
      slot_1: 'diag_1',
      slot_2: 'diag_2',
      slot_3: 'diag_3',
      slot_4: 'diag_4'
    });
    clinicalAudio.playSuccessChime();
  };

  const isAllFilled = slots.slot_1 && slots.slot_2 && slots.slot_3 && slots.slot_4;

  const handleConfirm = () => {
    let errors = 0;
    if (slots.slot_1 !== 'diag_1') errors++;
    if (slots.slot_2 !== 'diag_2') errors++;
    if (slots.slot_3 !== 'diag_3') errors++;
    if (slots.slot_4 !== 'diag_4') errors++;

    setErrorCount(errors);
    clinicalAudio.playSuccessChime();
    onComplete([slots.slot_1!, slots.slot_2!, slots.slot_3!, slots.slot_4!], errors);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 8) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              ภารกิจที่ 3 / จัดลำดับความสำคัญของปัญหา (NCJMM: Prioritize Hypotheses)
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 25%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            จัดลำดับข้อวินิจฉัยทางการพยาบาล (Prioritize Nursing Diagnoses)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ลากการ์ดข้อวินิจฉัยทางการพยาบาลไปวางในช่อง Priority 1 ถึง 4 ตามหลักความเร่งด่วน ABC
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowHintModal(true)}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>ปรึกษาหัวหน้าเวร</span>
          </button>

          <button
            onClick={handleAutoFillCorrect}
            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>(เฉลยลัด) จัดลำดับถูกต้อง</span>
          </button>
        </div>
      </div>

      <ClinicalHintModal
        currentStage="STAGE3_PRIORITIZATION"
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Left: 4 Available Diagnoses pool (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>รายการข้อวินิจฉัย (ลาก หรือ แตะเพื่อเลือก)</span>
              <GripVertical className="w-4 h-4 text-slate-400" />
            </h3>

            {selectedDiagId && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold animate-pulse flex items-center justify-between">
                <span>แตะที่ช่อง Priority 1-4 เพื่อวางการ์ด</span>
                <button
                  onClick={() => setSelectedDiagId(null)}
                  className="text-[10px] text-rose-600 underline"
                >
                  ยกเลิก
                </button>
              </div>
            )}

            <div className="space-y-3">
              {availableDiagnoses.map(diag => {
                const holdingSlot = Object.keys(slots).find(s => slots[s] === diag.id);
                const isSelected = selectedDiagId === diag.id;
                return (
                  <div
                    key={diag.id}
                    onClick={() => !holdingSlot && handleCardTap(diag.id)}
                    className="cursor-pointer"
                  >
                    <DraggableCard
                      id={diag.id}
                      className={`bg-white border rounded-2xl p-4 transition-all shadow-sm ${
                        isSelected
                          ? 'ring-2 ring-rose-500 border-rose-400 bg-rose-50/60 shadow-md'
                          : holdingSlot
                          ? 'opacity-40 border-slate-200'
                          : 'border-slate-200 hover:border-rose-400 active:scale-[0.98]'
                      }`}
                    >
                      <div className="pr-6">
                        <h4 className="font-bold text-sm text-slate-800 mb-1">{diag.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{diag.description}</p>
                        {holdingSlot ? (
                          <span className="inline-block mt-2 text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-mono font-semibold">
                            อยู่ในช่อง Priority {holdingSlot.replace('slot_', '')}
                          </span>
                        ) : isSelected ? (
                          <span className="inline-block mt-2 text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                            เลือกอยู่ (แตะช่องที่ต้องการวาง)
                          </span>
                        ) : null}
                      </div>
                    </DraggableCard>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: 4 Target Priority Slots (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-700">
              ช่องลำดับความสำคัญ (Priority Slots 1 - 4)
            </h3>

            <div className="space-y-3">
              {[1, 2, 3, 4].map(num => {
                const slotKey = `slot_${num}`;
                const diagId = slots[slotKey];
                const diag = availableDiagnoses.find(d => d.id === diagId);

                return (
                  <div
                    key={slotKey}
                    onClick={() => !diag && handleSlotTap(slotKey)}
                    className={selectedDiagId && !diag ? 'ring-2 ring-dashed ring-rose-400 rounded-2xl cursor-pointer' : ''}
                  >
                    <DroppableSlot
                      id={slotKey}
                      priorityNumber={num}
                      title={`ความสำคัญลำดับที่ ${num} ${num === 1 ? '(วิกฤตสูงสุดตามหลัก ABC)' : ''}`}
                      isFilled={!!diag}
                    >
                      {diag ? (
                        <div className="flex items-center justify-between bg-rose-50/70 border border-rose-200 p-3 rounded-xl">
                          <div>
                            <h5 className="text-sm font-bold text-rose-900">{diag.title}</h5>
                            <p className="text-xs text-slate-600">{diag.description}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromSlot(slotKey);
                            }}
                            className="text-xs text-rose-700 hover:text-rose-900 bg-white border border-rose-200 px-2.5 py-1 rounded-lg shrink-0 ml-3 shadow-sm font-medium"
                          >
                            ลบออก
                          </button>
                        </div>
                      ) : null}
                    </DroppableSlot>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DndContext>

      {/* Action footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isAllFilled ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>ลากวางครบทั้ง 4 ลำดับแล้ว สามารถกดตรวจคำตอบได้</span>
            </>
          ) : (
            <span>กรุณาลากข้อวินิจฉัยใส่ให้ครบทั้ง 4 ช่อง</span>
          )}
        </p>

        <button
          onClick={handleConfirm}
          disabled={!isAllFilled}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>ตรวจสอบผลและดูเหตุผลทางคลินิก (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
