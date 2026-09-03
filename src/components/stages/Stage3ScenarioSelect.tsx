import React from 'react';
import { Heart, Activity, AlertTriangle, ArrowRight, CheckCircle2, User, HeartPulse, Stethoscope, FileText } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage3ScenarioSelectProps {
  onSelectScenario: (scenarioId: number) => void;
}

export const Stage3ScenarioSelect: React.FC<Stage3ScenarioSelectProps> = ({ onSelectScenario }) => {
  const handleSelect = (id: number) => {
    clinicalAudio.playHeartBeep(880, 0.1);
    onSelectScenario(id);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          <span>ขั้นตอนที่ 3 / เลือกสถานการณ์</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-2">
          เลือกสถานการณ์จำลองทางคลินิก (Clinical Scenario)
        </h2>
        <p className="text-sm text-slate-500 mt-1 max-w-xl mx-auto">
          เลือกเคสผู้ป่วยโรคหัวใจเพื่อฝึกการตัดสินใจทางคลินิกเสมือนจริงในฐานะพยาบาลประจำหอผู้ป่วยกึ่งวิกฤต ศูนย์หัวใจ
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Case 1 Card (Matching PDF Page 4-5) */}
        <div className="bg-white border-2 border-rose-300 hover:border-rose-400 rounded-3xl p-6 sm:p-7 shadow-lg flex flex-col justify-between transition-all hover:shadow-xl group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                สถานการณ์ที่ 1 (เคสหลัก)
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                พร้อมให้เล่น
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                  ภาวะหัวใจล้มเหลวจากความดันโลหิตสูงวิกฤต
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  หญิงไทย 39 ปี | HT, DM, Dyslipidemia
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              ผู้ป่วยมาด้วยอาการหายใจหอบเหนื่อยรุนแรง แน่นหน้าอก และใจสั่น ตรวจพบความดันโลหิตสูงวิกฤต (BP 168/98 mmHg) ชีพจรเร็ว 112 bpm ฟังปอดพบ Fine Crepitation ชายปอดทั้งสองข้าง
            </p>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>ฝึกการฟังเสียงปอด Crepitation & ตรวจ Pitting Edema</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>การจัดลำดับการพยาบาล & บริหารยา Furosemide</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0" />
                <span>การรับมือภาวะฉุกเฉิน EKG SVT และคำนวณชาร์ต I/O</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSelect(1)}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-200 transition-all group-hover:scale-[1.01]"
          >
            <span>เริ่มเล่นสถานการณ์ที่ 1</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Case 2 Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md flex flex-col justify-between hover:border-slate-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                สถานการณ์ที่ 2 (ระดับขั้นสูง)
              </span>
              <span className="text-xs font-mono text-slate-600 font-medium bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                เคสทางเลือก
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  ภาวะวิกฤตน้ำท่วมปอดเฉียบพลันใน ADHF
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  หญิงไทย 65 ปี | Chronic Heart Failure, HT, DM
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              ผู้ป่วยโรคหัวใจล้มเหลวเรื้อรัง มีอาการเหนื่อยมากขึ้น เดินไม่กี่ก้าวก็เหนื่อย นอนราบไม่ได้ ต้องหนุนหมอน 3 ใบ มีภาวะคั่งน้ำในปอดเฉียบพลัน น้ำหนักเพิ่ม 3 กก. ใน 1 สัปดาห์
            </p>

            <div className="space-y-2 text-xs text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>การประเมิน Paroxysmal Nocturnal Dyspnea (PND)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>การแปลผล ABG, BNP 2,650 pg/mL และ LVEF 30%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>การดูแลผู้ป่วยเสมหะชมพูเป็นฟอง (Pink Frothy Sputum)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleSelect(2)}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm flex items-center justify-center gap-2 border border-slate-200 transition-all"
          >
            <span>เลือกเล่นเคสที่ 2 (เข้าสู่เนื้อหาจำลอง)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
