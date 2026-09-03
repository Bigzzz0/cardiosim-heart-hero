import React, { useState } from 'react';
import { Heart, Play, Activity, Sparkles, BookOpen, ShieldCheck, Stethoscope, Pill, ClipboardList, Monitor } from 'lucide-react';
import { StudentProfile } from '../../types/game';
import { CanvasEKG } from '../ekg/CanvasEKG';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

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
    <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-rose-50/60 via-white to-pink-50/40">
      {/* Decorative Pastel Glows */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center">
        {/* Top Badge (Similar to PDF Page 1) */}
        <div className="inline-flex items-center gap-2 bg-pink-100 text-rose-700 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm">
          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          <span>ยินดีต้อนรับเข้าสู่ระบบการจำลองเสมือนจริง</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-2">
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

        {/* Category Icons Bubble Row (Matching PDF Page 1 bottom circles) */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-white border border-rose-200 shadow-sm flex items-center justify-center text-rose-500 hover:scale-105 transition-transform">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-pink-500/20" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-teal-200 shadow-sm flex items-center justify-center text-teal-600 hover:scale-105 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-sky-200 shadow-sm flex items-center justify-center text-sky-600 hover:scale-105 transition-transform">
            <Monitor className="w-5 h-5" />
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white border border-purple-200 shadow-sm flex items-center justify-center text-purple-600 hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        {/* Live EKG Monitor Preview */}
        <div className="w-full max-w-lg mb-8 shadow-lg rounded-2xl overflow-hidden border border-slate-200">
          <CanvasEKG rhythm="NORMAL" heartRate={75} height={95} enableAudioBeep={false} />
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-md bg-white border border-pink-100 p-6 sm:p-7 rounded-3xl shadow-xl text-left">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 text-rose-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-bold text-sm text-slate-800">ลงทะเบียนเข้าสู่บทเรียนเสมือนจริง</span>
          </div>

          <form onSubmit={handleStart} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                รหัสนักศึกษา (สำหรับบันทึกข้อมูลวิจัย) *
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="เช่น 6501xxxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ชื่อ - นามสกุล *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ระบุชื่อ-นามสกุล"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                สถาบันการศึกษา / ชั้นปี
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="เช่น คณะพยาบาลศาสตร์ ชั้นปีที่ 3"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
              />
            </div>

            {/* Start Game Button (Matching PDF Page 1 pink button) */}
            <button
              type="submit"
              className="w-full mt-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.98]"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span className="text-base tracking-wide">เริ่มเกมส์ (START)</span>
            </button>
          </form>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
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
        </div>
      </div>
    </div>
  );
};
