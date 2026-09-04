import React, { useState } from 'react';
import { Heart, Play, Activity, Sparkles, BookOpen, ShieldCheck, Stethoscope, Pill, ClipboardList, Monitor } from 'lucide-react';
import { StudentProfile } from '../../types/game';
import { CanvasEKG } from '../ekg/CanvasEKG';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { BackgroundPaths } from '../ui/BackgroundPaths';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';

interface Stage0LandingProps {
  onStartGame: (profile: StudentProfile) => void;
}

export const Stage0Landing: React.FC<Stage0LandingProps> = ({ onStartGame }) => {
  const [studentId, setStudentId] = useState('65014892');
  const [name, setName] = useState('นักศึกษาพยาบาลต้นแบบ');
  const [institution, setInstitution] = useState('คณะพยาบาลศาสตร์');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    clinicalAudio.playHeartBeep(880, 0.1);
    onStartGame({
      studentId: studentId.trim() || 'ANON-TEST',
      name: name.trim() || 'ผู้เล่นทดสอบ',
      institution: institution.trim()
    });
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30">
      {/* 21st.dev Ambient Heartbeat Vector Paths */}
      <BackgroundPaths intensity="medium" />

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center py-6 sm:py-10">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 bg-pink-100/90 text-rose-700 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm hover:scale-105 transition-transform">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          <span>ยินดีต้อนรับเข้าสู่ระบบการจำลองเสมือนจริง</span>
        </div>

        {/* Hero Title with Shimmer Sweep */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            CardioSim :
          </span>{' '}
          <span className="text-slate-800">Heart Hero Simulation</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mb-6 leading-relaxed">
          เกมจำลองสถานการณ์เสมือนจริงในการดูแลผู้ป่วยโรคหัวใจและภาวะวิกฤต
          <br className="hidden sm:inline" />
          ฝึกทักษะการตัดสินใจทางคลินิก (Clinical Judgment) ตามหลักสูตรพยาบาลศาสตร์
        </p>

        {/* Category Icons Bubble Row with 21st.dev hover lift */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-center text-rose-500 hover:scale-110 hover:shadow-md hover:border-rose-400 transition-all cursor-default">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 hover:scale-110 hover:shadow-md hover:border-pink-400 transition-all cursor-default">
            <Heart className="w-5 h-5 fill-pink-500/20" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-teal-200 shadow-sm flex items-center justify-center text-teal-600 hover:scale-110 hover:shadow-md hover:border-teal-400 transition-all cursor-default">
            <Pill className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-sky-200 shadow-sm flex items-center justify-center text-sky-600 hover:scale-110 hover:shadow-md hover:border-sky-400 transition-all cursor-default">
            <Monitor className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-purple-200 shadow-sm flex items-center justify-center text-purple-600 hover:scale-110 hover:shadow-md hover:border-purple-400 transition-all cursor-default">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        {/* Live EKG Monitor Preview with Glowing Border */}
        <div className="w-full max-w-lg mb-8 shadow-xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-950">
          <CanvasEKG rhythm="NORMAL" heartRate={75} height={95} enableAudioBeep={false} />
        </div>

        {/* Registration SpotlightCard */}
        <SpotlightCard
          className="w-full max-w-md p-6 sm:p-8 text-left shadow-xl border-pink-200/80"
          spotlightColor="rgba(244, 63, 94, 0.15)"
        >
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 text-rose-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-sm text-slate-800">ลงทะเบียนเข้าสู่บทเรียนเสมือนจริง</span>
          </div>

          <form onSubmit={handleStart} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                รหัสนักศึกษา (สำหรับบันทึกข้อมูลวิจัย) *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="เช่น 6501xxxx"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                ชื่อ - นามสกุล *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อ-นามสกุล"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                สถาบันการศึกษา / ชั้นปี
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="เช่น คณะพยาบาลศาสตร์ ชั้นปีที่ 3"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Start Game ShinyButton */}
            <div className="pt-2">
              <ShinyButton
                type="submit"
                variant="primary"
                size="lg"
                icon={<Heart className="w-5 h-5 fill-white" />}
                className="w-full"
              >
                เริ่มเกมส์ (START CLINICAL SIM)
              </ShinyButton>
            </div>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-rose-500" />
              Pre-test 10 ข้อ
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              8 ขั้นตอนทางคลินิก
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              เก็บผลวิจัยอัตโนมัติ
            </span>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};
