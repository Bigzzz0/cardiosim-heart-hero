import React from 'react';
import { Award, Printer, X, Heart, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { StudentProfile } from '../../types/game';
import { ShinyButton } from '../ui/ShinyButton';
import { PulseBadge } from '../ui/PulseBadge';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  preScore: number;
  postScore: number;
  gain: number;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  student,
  preScore,
  postScore,
  gain
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border-2 border-pink-200 rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl relative my-8 holographic-card animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 print:hidden transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Canvas */}
        <div className="border-4 border-double border-pink-300/90 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-rose-50/40 via-white to-pink-50/30 text-center relative overflow-hidden shadow-inner">
          {/* Header Seal with 21st.dev Glow */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-300/80">
            <Award className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-mono font-bold tracking-widest text-rose-600 uppercase">
            CERTIFICATE OF CLINICAL SIMULATION EXCELLENCE
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1 mb-1">
            ใบประกาศนียบัตรสมรรถนะการตัดสินใจทางคลินิก
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            CardioSim: Heart Hero Simulation • การพยาบาลผู้ป่วยโรคหัวใจและภาวะวิกฤต
          </p>

          <div className="text-sm text-slate-600 mb-2 font-medium">ขอมอบใบประกาศนียบัตรฉบับนี้เพื่อแสดงว่า</div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-rose-700 mb-1">
            {student.name || 'นักศึกษาพยาบาลต้นแบบ'}
          </h3>
          <p className="text-xs font-mono text-slate-500 mb-6">
            รหัสนักศึกษา: {student.studentId || '65014892'} • {student.institution || 'คณะพยาบาลศาสตร์'}
          </p>

          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            ได้ผ่านการจำลองสถานการณ์เสมือนจริงในการดูแลผู้ป่วยโรคหัวใจล้มเหลวเฉียบพลันตามเกณฑ์สมรรถนะ
            <strong> NCSBN Clinical Judgment Measurement Model (NCJMM)</strong> ครบทั้ง 6 มิติทางคลินิก
          </p>

          {/* Score Snapshot Badge */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-8 text-xs flex-wrap">
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <span className="text-slate-400 text-[10px] block">Post-test Score</span>
              <span className="text-base font-bold font-mono text-rose-600">{postScore} / 10</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
              <span className="text-slate-400 text-[10px] block">Learning Gain (&lt;g&gt;)</span>
              <span className="text-base font-bold font-mono text-emerald-600">{gain}</span>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm flex flex-col justify-center items-center">
              <span className="text-slate-400 text-[10px] block mb-0.5">สถานะผลการฝึก</span>
              <PulseBadge status="stable" text="ผ่านเกณฑ์ยอดเยี่ยม" />
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 text-xs text-slate-600">
            <div>
              <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">อาจารย์ผู้รับผิดชอบรายวิชา</p>
              <p className="text-[11px] text-slate-400">คณะพยาบาลศาสตร์</p>
            </div>
            <div>
              <div className="w-32 border-b border-slate-400 mx-auto mb-1"></div>
              <p className="font-bold text-slate-800">วันที่สำเร็จการฝึกอบรม</p>
              <p className="text-[11px] text-slate-400 font-mono">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            ปิดหน้าต่าง
          </button>

          <ShinyButton
            onClick={handlePrint}
            variant="primary"
            size="md"
            icon={<Printer className="w-4 h-4" />}
          >
            พิมพ์ใบประกาศนียบัตร (Print / PDF)
          </ShinyButton>
        </div>
      </div>
    </div>
  );
};
