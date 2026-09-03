import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, Activity, ShieldAlert, Heart, HeartPulse, Lightbulb } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { ClinicalHintModal } from '../common/ClinicalHintModal';

interface Stage9ActionABCProps {
  onComplete: () => void;
}

export const Stage9ActionABC: React.FC<Stage9ActionABCProps> = ({ onComplete }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showHintModal, setShowHintModal] = useState(false);

  const actions = [
    {
      id: 'A',
      title: 'จัดท่านอนราบ และส่งผู้ป่วยไปเจาะเลือดทันที',
      isCorrect: false,
      reason: 'การจัดท่านอนราบในผู้ป่วยน้ำท่วมปอดจะทำให้ Venous return ไหลกลับเข้าปอดมากขึ้น อาการหอบเหนื่อยจะทรุดลงอย่างรวดเร็วและเป็นอันตรายถึงชีวิต'
    },
    {
      id: 'B',
      title: 'จัดท่า High Fowler\'s (ศีรษะสูง 90 องศา) และให้ออกซิเจนความเข้มข้นสูงทันที',
      isCorrect: true,
      reason: 'ถูกต้องอย่างยิ่ง! การจัดท่า High Fowler\'s ช่วยให้กระบังลมเคลื่อนต่ำ ปอดขยายได้เต็มที่ และลดปริมาณเลือดดำไหลกลับหัวใจ ร่วมกับการให้ออกซิเจนเพื่อแก้ไขภาวะ Hypoxemia เร่งด่วนตามหลัก ABC'
    },
    {
      id: 'C',
      title: 'ให้ผู้ป่วยดื่มน้ำ 500 mL เพื่อบรรเทาอาการคอแห้งและกระหายน้ำ',
      isCorrect: false,
      reason: 'ผิด! ผู้ป่วยมีภาวะสารน้ำเกินและน้ำท่วมปอด การให้ดื่มน้ำเพิ่มจะทำให้ภาวะน้ำคั่งทวีความรุนแรงยิ่งขึ้น'
    },
    {
      id: 'D',
      title: 'รอพบแพทย์เวรเพื่อให้แพทย์มาตรวจประเมินก่อนลงมือปฏิบัติ',
      isCorrect: false,
      reason: 'ผิด! ในภาวะวิกฤตพยาบาลสามารถปฏิบัติการพยาบาลเบื้องต้นตามหน้าที่ เช่น จัดท่าศีรษะสูงและให้ออกซิเจนได้ทันทีโดยไม่ต้องรอ เพื่อป้องกันภาวะขาดออกซิเจนวิกฤต'
    }
  ];

  const handleSelect = (id: string) => {
    setSelectedAction(id);
    const act = actions.find(a => a.id === id);
    if (act?.isCorrect) {
      clinicalAudio.playSuccessChime();
    } else {
      clinicalAudio.playHeartBeep(600, 0.1);
    }
  };

  const handleNext = () => {
    clinicalAudio.playHeartBeep(880, 0.1);
    onComplete();
  };

  const selectedItem = actions.find(a => a.id === selectedAction);

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 9) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              ภารกิจที่ 4 / เลือกการพยาบาลแรกรับ (NCJMM: Generate Solutions)
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 30%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            เลือกการปฏิบัติการพยาบาลที่เหมาะสมเป็นอันดับแรก (Priority Action)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            เมื่อประเมินพบผู้ป่วยมีอาการหอบเหนื่อยรุนแรงและปอดมีเสียง Crepitation การพยาบาลข้อใดต้องทำทันท่วงที
          </p>
        </div>

        <button
          onClick={() => setShowHintModal(true)}
          className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-sm self-start md:self-center"
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>ปรึกษาหัวหน้าเวร</span>
        </button>
      </div>

      <ClinicalHintModal
        currentStage="STAGE5_ABC_ACTION"
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
      />

      {/* Action Options Cards */}
      <div className="space-y-3.5 mb-6">
        {actions.map(act => {
          const isSelected = selectedAction === act.id;
          return (
            <button
              key={act.id}
              onClick={() => handleSelect(act.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                isSelected
                  ? act.isCorrect
                    ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                    : 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-md'
                  : 'bg-white border-slate-200 hover:border-pink-300 hover:bg-slate-50/70 shadow-sm'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl font-mono text-sm font-bold flex items-center justify-center shrink-0 border ${
                  isSelected
                    ? act.isCorrect
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-rose-500 text-white border-rose-600'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {act.id}
              </div>
              <div className="flex-1">
                <span className="text-sm sm:text-base font-bold text-slate-800 block">
                  {act.title}
                </span>
                {isSelected && (
                  <p
                    className={`text-xs sm:text-sm mt-2.5 p-3 rounded-xl leading-relaxed border font-medium ${
                      act.isCorrect
                        ? 'bg-emerald-100/70 border-emerald-200 text-emerald-900'
                        : 'bg-rose-100/70 border-rose-200 text-rose-900'
                    }`}
                  >
                    {act.reason}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Next Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {selectedItem?.isCorrect ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>เลือกการพยาบาลที่ถูกต้องแล้ว สามารถไปขั้นตอนต่อไปได้</span>
            </>
          ) : (
            <span>กรุณาเลือกตัวเลือกที่เหมาะสม</span>
          )}
        </p>

        <button
          onClick={handleNext}
          disabled={!selectedItem?.isCorrect}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>ไปสู่การวางแผนให้ยาขับปัสสาวะ (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
