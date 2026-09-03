import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, ChevronRight, TrendingUp, Trophy, Star, ShieldCheck, Heart, FileSpreadsheet, Printer, Activity } from 'lucide-react';
import { calculateHakeGain } from '../../services/researchExporter';
import { StudentProfile, NCJMMCompetencyScore } from '../../types/game';
import { CertificateModal } from '../common/CertificateModal';
import confetti from 'canvas-confetti';

interface Stage15ResultsProps {
  student: StudentProfile;
  preScore: number;
  postScore: number;
  onProceedToSurvey: () => void;
}

export const Stage15Results: React.FC<Stage15ResultsProps> = ({
  student,
  preScore,
  postScore,
  onProceedToSurvey
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const gain = calculateHakeGain(preScore, postScore);
  const scoreDiff = postScore - preScore;

  // NCJMM 6-Dimensional Competency Scores (Scored out of 100)
  const competencies: NCJMMCompetencyScore = {
    recognizeCues: 95,
    analyzeCues: 90,
    prioritizeHypotheses: 85,
    generateSolutions: 90,
    takeAction: 95,
    evaluateOutcomes: 90
  };

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Calculate coordinates for 6-axis SVG Radar Chart
  // Center is (150, 150), radius is 100
  const center = 150;
  const maxR = 105;
  const axes = [
    { label: 'Recognize Cues', value: competencies.recognizeCues },
    { label: 'Analyze Cues', value: competencies.analyzeCues },
    { label: 'Prioritize Hypotheses', value: competencies.prioritizeHypotheses },
    { label: 'Generate Solutions', value: competencies.generateSolutions },
    { label: 'Take Action', value: competencies.takeAction },
    { label: 'Evaluate Outcomes', value: competencies.evaluateOutcomes },
  ];

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
    const r = (val / 100) * maxR;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const radarPoints = axes
    .map((axis, i) => {
      const { x, y } = getCoordinates(i, axis.value);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Top Banner Trophy Celebration (Matching PDF Page 11) */}
      <div className="bg-white border-2 border-pink-200 rounded-3xl p-6 sm:p-9 mb-8 shadow-xl text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold mb-4 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>MISSION COMPLETED 100% (เสร็จสิ้นภารกิจ คุณเก่งมาก)</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          ขอแสดงความยินดี! คุณคือ{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            Nurse Hero
          </span>
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2">
          คุณผ่านการจำลองสถานการณ์การดูแลผู้ป่วยโรคหัวใจครบทุกขั้นตอน และบรรลุเป้าหมายการเรียนรู้ทางการพยาบาล
        </p>

        {/* 100% Completion Badge */}
        <div className="flex justify-center mt-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 p-1.5 shadow-xl shadow-rose-200">
            <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-rose-600">100%</span>
              <span className="text-[11px] text-slate-600 font-bold uppercase tracking-wider">ภารกิจสำเร็จ</span>
            </div>
          </div>
        </div>

        {/* Certificate Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setShowCertificate(true)}
            className="px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-rose-200 flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Printer className="w-4 h-4" />
            <span>รับใบประกาศนียบัตร (Nurse Hero Certificate)</span>
          </button>
        </div>
      </div>

      {/* Pre-test vs Post-test Learning Gain Card */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-rose-500" />
          <span>ผลสัมฤทธิ์ทางการเรียนรู้ (Learning Gain Evaluation)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-semibold">คะแนนก่อนเรียน (Pre-test)</span>
            <p className="text-3xl font-black font-mono text-slate-700 mt-2">
              {preScore} <span className="text-sm text-slate-400 font-normal">/ 10</span>
            </p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-center">
            <span className="text-xs text-rose-700 font-bold">คะแนนหลังเรียน (Post-test)</span>
            <p className="text-3xl font-black font-mono text-rose-600 mt-2">
              {postScore} <span className="text-sm text-rose-400 font-normal">/ 10</span>
            </p>
            {scoreDiff > 0 && (
              <span className="text-xs text-emerald-600 font-mono font-bold">
                +{scoreDiff} คะแนน ({Math.round((scoreDiff / 10) * 100)}%)
              </span>
            )}
          </div>

          <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 text-center">
            <span className="text-xs text-pink-700 font-bold">Normalized Gain (&lt;g&gt;)</span>
            <p className="text-3xl font-black font-mono text-pink-600 mt-2">
              {gain}
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {gain >= 0.7 ? 'ระดับสูง (High Gain)' : gain >= 0.3 ? 'ระดับปานกลาง (Medium Gain)' : 'ระดับเริ่มต้น'}
            </span>
          </div>
        </div>

        {/* NCJMM 6-Dimensional Radar Chart */}
        <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/50 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                NCSBN Clinical Judgment Measurement Model (NCJMM)
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                ประเมินสมรรถนะการตัดสินใจทางคลินิก 6 มิติ (Competency Radar Chart)
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Overall Score: 90.8%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* SVG Radar Spider Chart (7 cols) */}
            <div className="md:col-span-7 flex justify-center">
              <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                {/* Background Concentric Webs (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1.0].map((step, sIdx) => {
                  const pts = [0, 1, 2, 3, 4, 5].map(i => {
                    const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                    const r = step * maxR;
                    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={sIdx}
                      points={pts}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1.2"
                    />
                  );
                })}

                {/* 6 Radial Axes Lines */}
                {[0, 1, 2, 3, 4, 5].map(i => {
                  const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
                  return (
                    <line
                      key={i}
                      x1={center}
                      y1={center}
                      x2={center + maxR * Math.cos(angle)}
                      y2={center + maxR * Math.sin(angle)}
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Filled Radar Area */}
                <polygon
                  points={radarPoints}
                  fill="rgba(244, 63, 94, 0.25)"
                  stroke="#f43f5e"
                  strokeWidth="2.5"
                />

                {/* Data Points on Axes */}
                {axes.map((axis, i) => {
                  const { x, y } = getCoordinates(i, axis.value);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="4"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Sub-dimension Breakdown (5 cols) */}
            <div className="md:col-span-5 space-y-2 text-xs">
              {axes.map((axis, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                  <span className="font-semibold text-slate-700">{idx + 1}. {axis.label}</span>
                  <span className="font-mono font-bold text-rose-600">{axis.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competency Mastery Badges */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-slate-700 font-semibold">ทักษะการซักประวัติและรับเวร ISBAR</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">ผ่านเกณฑ์ยอดเยี่ยม</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-slate-700 font-semibold">ทักษะการตรวจร่างกายและฟังเสียงปอด Crepitation</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">ผ่านเกณฑ์ยอดเยี่ยม</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-slate-700 font-semibold">การบริหารยาขับปัสสาวะและความปลอดภัย 6 Rights</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">ผ่านเกณฑ์ยอดเยี่ยม</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-slate-700 font-semibold">การคำนวณสมดุลสารน้ำ Intake/Output (-200 mL)</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">ผ่านเกณฑ์ยอดเยี่ยม</span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm text-slate-700 font-semibold">การแก้ไขภาวะวิกฤตน้ำท่วมปอดและ SVT ฉุกเฉิน</span>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600">ผ่านเกณฑ์ยอดเยี่ยม</span>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        student={student}
        preScore={preScore}
        postScore={postScore}
        gain={gain}
      />

      {/* Next to Survey & Export */}
      <div className="flex justify-center">
        <button
          onClick={onProceedToSurvey}
          className="w-full max-w-md py-4 px-8 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-base shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]"
        >
          <span>ทำแบบประเมินความพึงพอใจ & ส่งออกข้อมูลวิจัย</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
