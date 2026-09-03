import React from 'react';
import { Award, CheckCircle2, ChevronRight, Activity, Heart, ShieldCheck, FileCheck, HeartPulse } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage13DebriefProps {
  onComplete: () => void;
}

export const Stage13Debrief: React.FC<Stage13DebriefProps> = ({ onComplete }) => {
  const handleNext = () => {
    clinicalAudio.playSuccessChime();
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 10) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              ภารกิจที่ 8 / สรุปผลการพยาบาล
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 90%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            สรุปผลการพยาบาลและสะท้อนคิดทางคลินิก (Clinical Debriefing)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ประเมินผลลัพธ์ทางการพยาบาลเมื่อสิ้นสุดเวร ผู้ป่วยพ้นวิกฤตและสัญญาณชีพกลับสู่ภาวะคงที่
          </p>
        </div>
      </div>

      {/* Main Outcomes Card */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              สถานะผู้ป่วยหลังได้รับการดูแล
            </span>
            <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">
              ผู้ป่วยอาการคงที่และปลอดภัย (Stabilized)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              อาการหอบเหนื่อยทุเลาลง นอนหนุนหมอนสูง 2 ใบได้อย่างสบาย ไม่ไอเสมหะฟองชมพู
            </p>
          </div>
        </div>

        {/* Vital Signs Comparison Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium">ความดันโลหิต (BP)</span>
            <p className="text-sm sm:text-base font-bold font-mono text-slate-800 mt-1">140/85 mmHg</p>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">ลดลงจาก 220/130</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium">ชีพจร (PR)</span>
            <p className="text-sm sm:text-base font-bold font-mono text-slate-800 mt-1">92 bpm</p>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">Sinus Rhythm</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium">การหายใจ (RR)</span>
            <p className="text-sm sm:text-base font-bold font-mono text-slate-800 mt-1">20 ครั้ง/นาที</p>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">หายใจสม่ำเสมอ</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] text-slate-500 font-medium">ระดับออกซิเจน (SpO2)</span>
            <p className="text-sm sm:text-base font-bold font-mono text-emerald-600 mt-1">96%</p>
            <span className="text-[10px] text-emerald-600 font-mono font-semibold">ฟื้นจาก 82%</span>
          </div>
        </div>

        {/* Clinical Competency Checklist */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5 mb-6">
          <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" />
            <span>สมรรถนะทางการพยาบาลที่คุณได้ปฏิบัติผ่านเกณฑ์:</span>
          </h4>

          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>การสังเกตและประเมินภาวะวิกฤต (Noticing: Crackles, S3 sound, Pitting Edema)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>การจัดลำดับข้อวินิจฉัยทางการพยาบาลตามหลัก ABC (Interpreting & Prioritizing)</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>การบริหารยาขับปัสสาวะ Furosemide อย่างปลอดภัยตามหลัก 6 Rights</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>การคำนวณและบันทึกสมดุลสารน้ำ Intake/Output ได้ถูกต้อง</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>การกู้ชีพฉุกเฉินเมื่อเกิดภาวะน้ำท่วมปอดและ SVT ได้อย่างทันท่วงที</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Next: Post-test */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all"
        >
          <span>เข้าสู่การทำแบบทดสอบหลังเรียน (Post-test 10 ข้อ)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
