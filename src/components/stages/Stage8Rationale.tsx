import React from 'react';
import { NURSING_DIAGNOSES } from '../../data/nursingDiagnosesData';
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, BookOpen, ShieldCheck } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage8RationaleProps {
  userRanking: string[];
  errorCount: number;
  onNext: () => void;
}

export const Stage8Rationale: React.FC<Stage8RationaleProps> = ({
  userRanking,
  errorCount,
  onNext
}) => {
  const isPerfect = errorCount === 0;

  const handleProceed = () => {
    clinicalAudio.playHeartBeep(880, 0.1);
    onNext();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner Result Status (Matching PDF Page 8-9) */}
      <div className={`border-2 rounded-3xl p-6 sm:p-7 mb-6 shadow-lg flex flex-col sm:flex-row items-center gap-5 ${
        isPerfect
          ? 'bg-emerald-50/90 border-emerald-300'
          : 'bg-rose-50/90 border-rose-300'
      }`}>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${
          isPerfect ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-rose-500 text-white shadow-md shadow-rose-200'
        }`}>
          {isPerfect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
        </div>

        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border ${
              isPerfect ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-rose-100 border-rose-300 text-rose-800'
            }`}>
              {isPerfect ? 'ยอดเยี่ยม! จัดเรียงได้ถูกต้องสมบูรณ์' : 'มีข้อวินิจฉัยที่จัดเรียงไม่ถูกต้อง'}
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 25%
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {isPerfect ? 'การคิดวิเคราะห์ทางคลินิกตรงตามหลัก ABC' : 'เรียนรู้จากข้อผิดพลาดตามหลักเหตุผลทางคลินิก'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {isPerfect
              ? 'คุณสามารถจัดลำดับปัญหาได้อย่างถูกต้องตามความเร่งด่วนที่คุกคามต่อชีวิตของผู้ป่วย'
              : `คุณจัดลำดับคลาดเคลื่อน ${errorCount} ตำแหน่ง กรุณาอ่านคำอธิบายทางคลินิกด้านล่างเพื่อเสริมความเข้าใจ`}
          </p>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-500" />
          <span>เฉลยการจัดลำดับข้อวินิจฉัยทางการพยาบาลพร้อมเหตุผลทางคลินิก</span>
        </h3>

        <div className="space-y-4">
          {NURSING_DIAGNOSES.map((diag) => {
            const userPlacedDiagId = userRanking[diag.correctRank - 1];
            const isUserMatch = userPlacedDiagId === diag.id;

            return (
              <div
                key={diag.id}
                className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 sm:p-5 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-rose-100 text-rose-700 font-mono text-xs font-bold flex items-center justify-center border border-rose-200">
                      #{diag.correctRank}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800">{diag.title}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {isUserMatch ? (
                      <span className="text-xs text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> คุณเลือกถูกต้อง
                      </span>
                    ) : (
                      <span className="text-xs text-rose-700 bg-rose-100 border border-rose-200 px-3 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" /> คุณจัดลำดับไม่ตรง
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong className="text-rose-600">คำอธิบายเหตุผลทางคลินิก (Clinical Rationale):</strong>{' '}
                  {diag.correctRank === 1 && (
                    'การแลกเปลี่ยนก๊าซบกพร่อง (Impaired Gas Exchange) ต้องเป็นอันดับที่ 1 เสมอตามหลัก Airway & Breathing เนื่องจากภาวะ Hypoxemia และน้ำท่วมปอดสามารถทำให้ผู้ป่วยเสียชีวิตได้ในเวลาอันรวดเร็ว'
                  )}
                  {diag.correctRank === 2 && (
                    'ปริมาณเลือดออกจากหัวใจลดลง (Decreased Cardiac Output) เป็นอันดับที่ 2 ตามหลัก Circulation เนื่องจากหัวใจบีบตัวลดลงร่วมกับความดันโลหิตสูง ทำให้เนื้อเยื่อขาดออกซิเจนและหัวใจทำงานหนักขึ้น'
                  )}
                  {diag.correctRank === 3 && (
                    'ภาวะสารน้ำเกิน (Excess Fluid Volume) เป็นอันดับที่ 3 ซึ่งเป็นต้นเหตุที่นำไปสู่ภาวะน้ำท่วมปอด ต้องแก้ไขด้วยการจำกัดสารน้ำและให้ยาขับปัสสาวะ'
                  )}
                  {diag.correctRank === 4 && (
                    'ความไม่ทนต่อกิจกรรม (Activity Intolerance) เป็นอันดับที่ 4 ซึ่งเป็นผลลัพธ์ที่ตามมาจากภาวะหัวใจล้มเหลว สามารถฟื้นฟูได้หลังจากแก้ไขภาวะวิกฤตเฉียบพลันแล้ว'
                  )}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Next */}
      <div className="flex justify-end">
        <button
          onClick={handleProceed}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all"
        >
          <span>เข้าใจเหตุผลแล้ว & ไปสู่การเลือกการพยาบาลแรกรับ (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
