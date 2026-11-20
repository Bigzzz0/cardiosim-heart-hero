import React, { useEffect, useState } from 'react';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  ClipboardCheck,
  HelpCircle,
  Info,
  Printer,
  RotateCcw,
  Star,
  TrendingUp,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { calculateHakeGain } from '../../services/researchExporter';
import { GameTelemetry, StudentProfile } from '../../types/game';
import { buildResultsSummary } from '../../data/resultsSummary';
import { CertificateModal } from '../common/CertificateModal';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { PulseBadge } from '../ui/PulseBadge';
import confetti from 'canvas-confetti';

interface Stage15ResultsProps {
  student: StudentProfile;
  preScore: number;
  postScore: number;
  telemetry?: GameTelemetry;
  onProceedToSurvey: () => void;
}

export const Stage15Results: React.FC<Stage15ResultsProps> = ({
  student,
  preScore,
  postScore,
  telemetry,
  onProceedToSurvey,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const gain = calculateHakeGain(preScore, postScore);
  const scoreDiff = postScore - preScore;
  const gameResult = telemetry?.gameResult;
  const summary = buildResultsSummary(gameResult);

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 85,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore in headless/no-canvas environments
    }
  }, []);

  const badgeValue = summary.hasGameResult
    ? `${summary.completedStepsCount}/${summary.totalStepsCount}`
    : `${postScore}/10`;
  const badgeCaption = summary.hasGameResult ? 'ขั้นที่บันทึกแล้ว' : 'คะแนน Post-test';

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Top Banner Summary */}
      <SpotlightCard
        className="p-6 sm:p-9 mb-6 shadow-xl text-center border-pink-200"
        spotlightColor="rgba(244, 63, 94, 0.15)"
      >
        <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200 px-4 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>
            {summary.caseCode} · {summary.statusBadgeText}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
          สรุปผลการฝึกสถานการณ์{' '}
          <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
            Nurse Hero
          </span>
        </h2>
        <p className="text-sm font-semibold text-slate-700 mt-2">{summary.caseTitle}</p>
        <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1 leading-relaxed">
          {summary.clinicalStatusNote}
        </p>

        {/* Completion Ring */}
        <div className="flex justify-center mt-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 p-1.5 shadow-xl shadow-rose-200 animate-pulse-subtle">
            <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-rose-600">{badgeValue}</span>
              <span className="text-[11px] text-slate-600 font-bold tracking-wide">
                {badgeCaption}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Button */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <ShinyButton
            onClick={() => setShowCertificate(true)}
            variant="primary"
            size="lg"
            icon={<Printer className="w-4 h-4" />}
          >
            รับใบประกาศนียบัตร (Nurse Hero Certificate)
          </ShinyButton>
          <p className="text-[11px] text-slate-500">
            ตัวอย่างใบประกาศนียบัตรสำหรับทดลองพิมพ์ (เกณฑ์การผ่านอย่างเป็นทางการรอทีมผู้เชี่ยวชาญยืนยัน)
          </p>
        </div>
      </SpotlightCard>

      {/* Pre-test vs Post-test Learning Gain Card */}
      <SpotlightCard
        className="p-6 sm:p-8 shadow-xl mb-6 border-pink-100"
        spotlightColor="rgba(20, 184, 166, 0.12)"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-rose-500" />
            <span>ผลสัมฤทธิ์ทางการเรียนรู้ (Pre-test / Post-test)</span>
          </h3>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
            เฉลยข้อสอบ 20 ข้ออยู่ระหว่างรอผู้เชี่ยวชาญรับรอง
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-semibold">คะแนนก่อนเรียน (Pre-test)</span>
            <p className="text-3xl font-black font-mono text-slate-700 mt-2">
              <AnimatedCounter value={preScore} durationMs={800} />{' '}
              <span className="text-sm text-slate-400 font-normal">/ 10</span>
            </p>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-200 text-center">
            <span className="text-xs text-rose-700 font-bold">คะแนนหลังเรียน (Post-test)</span>
            <p className="text-3xl font-black font-mono text-rose-600 mt-2">
              <AnimatedCounter value={postScore} durationMs={1000} />{' '}
              <span className="text-sm text-rose-400 font-normal">/ 10</span>
            </p>
            <span
              className={`text-xs font-mono font-bold ${
                scoreDiff > 0
                  ? 'text-emerald-600'
                  : scoreDiff < 0
                    ? 'text-amber-600'
                    : 'text-slate-500'
              }`}
            >
              {scoreDiff > 0
                ? `+${scoreDiff} คะแนน (+${Math.round((scoreDiff / 10) * 100)}%)`
                : scoreDiff < 0
                  ? `${scoreDiff} คะแนน`
                  : 'คงที่ (0 คะแนน)'}
            </span>
          </div>

          <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200 text-center">
            <span className="text-xs text-pink-700 font-bold">Normalized Gain (&lt;g&gt;)</span>
            <p className="text-3xl font-black font-mono text-pink-600 mt-2">
              <AnimatedCounter
                value={gain}
                durationMs={1200}
                formatter={(val) => val.toFixed(2)}
              />
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {gain >= 0.7
                ? 'ระดับสูง (High Gain)'
                : gain >= 0.3
                  ? 'ระดับปานกลาง (Medium Gain)'
                  : 'ระดับเริ่มต้น'}
            </span>
          </div>
        </div>

        {/* Real Simulation Session Metrics (Replacing Hardcoded NCJMM Placeholder) */}
        <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/70 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                SIMULATION TELEMETRY · {summary.caseCode}
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                บันทึกผลการปฏิบัติในห้องผู้ป่วยจำลอง
              </h4>
            </div>
            <PulseBadge
              status={summary.isUnscored ? 'warning' : 'stable'}
              text={
                !summary.hasGameResult
                  ? 'ยังไม่มีผลจากห้องผู้ป่วย'
                  : summary.isUnscored
                    ? 'รอบฝึก · ไม่คิดคะแนน'
                    : `คะแนนเดโม: ${gameResult?.demoScore ?? '—'}/100`
              }
            />
          </div>

          {summary.hasGameResult && gameResult ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <Clock className="w-3.5 h-3.5 text-rose-500" />
                  <span>เวลาที่ใช้ในเกม</span>
                </div>
                <p className="text-lg font-extrabold font-mono text-slate-800">
                  {summary.durationLabel}
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <RotateCcw className="w-3.5 h-3.5 text-sky-500" />
                  <span>จำนวนครั้งที่ลอง</span>
                </div>
                <p className="text-lg font-extrabold font-mono text-slate-800">
                  {gameResult.attempts} <span className="text-xs font-normal text-slate-500">ครั้ง</span>
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <span>ตอบผิด / คำใบ้</span>
                </div>
                <p className="text-lg font-extrabold font-mono text-slate-800">
                  {gameResult.mistakes}{' '}
                  <span className="text-xs font-normal text-slate-400">/</span>{' '}
                  <span className="inline-flex items-center gap-0.5 text-slate-600">
                    {gameResult.hints}
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>บันทึกใน Chart</span>
                </div>
                <p className="text-lg font-extrabold font-mono text-slate-800">
                  {gameResult.findings.length}{' '}
                  <span className="text-xs font-normal text-slate-500">รายการ</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <span>
                ไม่พบบันทึกผลจากการเล่นในห้องผู้ป่วยจำลองสำหรับรอบนี้ (อาจเกิดจากการเปิดหน้าสรุปโดยตรง)
                — ระบบจะบันทึกเฉพาะคะแนน Pre-test, Post-test และแบบประเมินความพึงพอใจโดยไม่สร้างคะแนนจำลองปลอม
              </span>
            </div>
          )}
        </div>

        {/* Case-Specific Milestones List */}
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>ขั้นตอนการฝึกที่บันทึกไว้ ({summary.caseCode})</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {summary.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200"
            >
              <div className="flex items-start gap-2.5">
                {milestone.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <Star className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-snug">
                    {milestone.title}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {milestone.detail}
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <PulseBadge
                  status={milestone.completed ? 'stable' : 'warning'}
                  text={milestone.badgeText}
                />
              </div>
            </div>
          ))}
        </div>
      </SpotlightCard>

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
        <ShinyButton
          onClick={onProceedToSurvey}
          variant="primary"
          size="xl"
          icon={<ChevronRight className="w-5 h-5" />}
          className="w-full max-w-md"
        >
          ทำแบบประเมินความพึงพอใจ 10 ข้อ & ส่งออกข้อมูลวิจัย
        </ShinyButton>
      </div>
    </div>
  );
};
