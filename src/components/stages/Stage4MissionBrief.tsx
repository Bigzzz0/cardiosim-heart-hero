import React from 'react';
import { ShieldCheck, Heart, User, CheckCircle2, ChevronRight, Stethoscope, ClipboardList, Pill, Droplet, AlertOctagon, Award, HeartPulse } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';
import { DoctorApprovedStamp } from '../common/DoctorApprovedStamp';

interface Stage4MissionBriefProps {
  onAcceptMission: () => void;
}

export const Stage4MissionBrief: React.FC<Stage4MissionBriefProps> = ({ onAcceptMission }) => {
  const missions = [
    { num: 1, title: 'รับข้อมูลผู้ป่วย', desc: 'รวบรวมประวัติ อาการสำคัญ และรับเวร ISBAR', icon: ClipboardList, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { num: 2, title: 'ประเมินอาการ & Lab', desc: 'ฟังเสียงปอด เสียงหัวใจ ตรวจบวม และดูผลเลือด/X-Ray', icon: Stethoscope, color: 'text-sky-600 bg-sky-50 border-sky-200' },
    { num: 3, title: 'วิเคราะห์กำหนดปัญหา', desc: 'จัดกลุ่มอาการและข้อวินิจฉัยทางการพยาบาล', icon: User, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { num: 4, title: 'จัดลำดับแผนการพยาบาล', desc: 'ลำดับความสำคัญของปัญหา 1-4 ตามหลัก ABC', icon: CheckCircle2, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { num: 5, title: 'ปฏิบัติการให้ยาขับปัสสาวะ', desc: 'บริหาร Furosemide 40 mg IV และเรียง 7 สเต็ปความปลอดภัย', icon: Pill, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { num: 6, title: 'บันทึกสารน้ำเข้า-ออก (I/O)', desc: 'ลงชาร์ต Intake/Output คำนวณ Fluid Balance', icon: Droplet, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { num: 7, title: 'รับมือภาวะวิกฤตฉุกเฉิน', desc: 'แก้ไขอาการทรุดลงเฉียบพลันและคลื่นไฟฟ้าหัวใจ SVT', icon: AlertOctagon, color: 'text-red-600 bg-red-50 border-red-200' },
    { num: 8, title: 'สรุปผลและสะท้อนคิด', desc: 'Debriefing สรุปผลการพยาบาลและทำแบบประเมิน', icon: Award, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' }
  ];

  const handleStart = () => {
    clinicalAudio.playSuccessChime();
    onAcceptMission();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Role Intro SpotlightCard */}
      <SpotlightCard
        className="p-6 sm:p-8 mb-8 shadow-xl border-pink-200/80"
        spotlightColor="rgba(244, 63, 94, 0.12)"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 p-1 shadow-lg shadow-rose-200 shrink-0">
            <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-rose-500">
              <Stethoscope className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>บทบาทของคุณในเวรนี้</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              คุณคือพยาบาลประจำหอผู้ป่วยกึ่งวิกฤต ศูนย์หัวใจ
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              ที่ต้องทำภารกิจในการดูแลผู้ป่วยและให้การพยาบาลตลอดทั้งเวร ฝึกการคิดวิเคราะห์และการตัดสินใจทางคลินิก (Clinical Judgment ตามกรอบ NCJMM) ในการดูแลผู้ป่วยโรคหัวใจ เพื่อให้ผู้ป่วยปลอดภัยจากภาวะวิกฤต
            </p>
          </div>

          <div className="shrink-0 hidden md:block">
            <DoctorApprovedStamp />
          </div>
        </div>
      </SpotlightCard>

      {/* 8-Step Roadmap */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            <span>ภารกิจการตัดสินใจทางคลินิก (8 ขั้นตอนหลักในการดูแลผู้ป่วย)</span>
          </h3>
          <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
            8 ภารกิจ (NCJMM)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {missions.map(m => {
            const Icon = m.icon;
            return (
              <SpotlightCard
                key={m.num}
                spotlightColor="rgba(244, 63, 94, 0.08)"
                className="p-4 flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${m.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                      STEP {m.num}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{m.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </div>

      {/* Accept Mission ShinyButton */}
      <div className="flex justify-center">
        <ShinyButton
          onClick={handleStart}
          variant="primary"
          size="xl"
          icon={<ChevronRight className="w-5 h-5" />}
          className="w-full max-w-md"
        >
          รับทราบภารกิจ & เริ่มต้นเวรพยาบาล
        </ShinyButton>
      </div>
    </div>
  );
};
