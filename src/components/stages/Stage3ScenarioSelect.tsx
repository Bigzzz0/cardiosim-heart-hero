import React from 'react';
import { Heart, Activity, AlertTriangle, ArrowRight, CheckCircle2, User, HeartPulse, Stethoscope, FileText, Sparkles } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';
import { PulseBadge } from '../ui/PulseBadge';

interface Stage3ScenarioSelectProps {
  onSelectScenario: (scenarioId: string) => void;
}

export const Stage3ScenarioSelect: React.FC<Stage3ScenarioSelectProps> = ({ onSelectScenario }) => {
  const handleSelect = (id: string) => {
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
        {/* Case 1 SpotlightCard */}
        <SpotlightCard
          spotlightColor="rgba(244, 63, 94, 0.15)"
          className="p-6 sm:p-7 shadow-lg flex flex-col justify-between border-rose-300 hover:border-rose-400 group transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                สถานการณ์ที่ 1 (เคสหลัก)
              </span>
              <PulseBadge status="stable" text="พร้อมเข้าสู่เคส" />
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-200 shrink-0 group-hover:scale-105 transition-transform">
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

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
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

          <ShinyButton
            onClick={() => handleSelect('case-01')}
            variant="primary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            เริ่มเล่นสถานการณ์ที่ 1
          </ShinyButton>
        </SpotlightCard>

        {/* Case 2 SpotlightCard */}
        <SpotlightCard
          spotlightColor="rgba(147, 51, 234, 0.12)"
          className="p-6 sm:p-7 shadow-md flex flex-col justify-between border-purple-200 hover:border-purple-300 group transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-purple-500" />
                สถานการณ์ที่ 2 (ระดับขั้นสูง)
              </span>
              <span className="text-xs font-mono text-purple-600 font-medium bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                เคสทางเลือก
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                  ภาวะวิกฤตน้ำท่วมปอดเฉียบพลันใน ADHF
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  หญิงไทย 65 ปี | Chronic Heart Failure, HT, DM
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
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

          <ShinyButton
            onClick={() => handleSelect('case-02')}
            variant="secondary"
            size="lg"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            เลือกเล่นเคสที่ 2 (เข้าสู่เนื้อหาจำลอง)
          </ShinyButton>
        </SpotlightCard>
      </div>
    </div>
  );
};
