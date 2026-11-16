import React, { useState } from 'react';
import { GameTelemetry } from '../../types/game';
import { exportTelemetryToCSV, exportTelemetryToJSON } from '../../services/researchExporter';
import {
  ALL_SURVEY_ITEMS,
  SURVEY_DOMAINS,
  SURVEY_INSTRUCTION,
  SURVEY_SCALE_OPTIONS,
  SURVEY_SUBTITLE,
  SURVEY_TITLE,
  computeSurveySummary,
} from '../../data/surveyData';
import {
  Heart,
  Download,
  FileSpreadsheet,
  Send,
  CheckCircle2,
  RotateCcw,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage16SurveyProps {
  telemetry: GameTelemetry;
  onRestart: () => void;
}

export const Stage16Survey: React.FC<Stage16SurveyProps> = ({ telemetry, onRestart }) => {
  const [ratings, setRatings] = useState<Record<string, number>>(() => ({
    ...telemetry.surveyScores,
  }));
  const [feedback, setFeedback] = useState(telemetry.feedbackText || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | undefined>(telemetry.completedAt);

  const summary = computeSurveySummary(ratings);
  const isComplete = summary.answeredCount === summary.totalItems;

  const buildCurrentTelemetry = (): GameTelemetry => ({
    ...telemetry,
    surveyScores: ratings,
    feedbackText: feedback,
    completedAt: submittedAt || new Date().toISOString(),
  });

  const handleSetRating = (id: string, score: number) => {
    clinicalAudio.playHeartBeep(880, 0.04);
    setRatings((prev) => ({
      ...prev,
      [id]: score,
    }));
    if (isSubmitted) {
      setIsSubmitted(false);
    }
  };

  const handleExportCSV = () => {
    exportTelemetryToCSV(buildCurrentTelemetry());
  };

  const handleExportJSON = () => {
    exportTelemetryToJSON(buildCurrentTelemetry());
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    setSubmittedAt(new Date().toISOString());
    clinicalAudio.playSuccessChime();
    setIsSubmitted(true);
  };

  const remainingCount = summary.totalItems - summary.answeredCount;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Thank you card */}
      <div className="bg-white border-2 border-pink-100 rounded-3xl p-6 sm:p-9 mb-8 shadow-xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3.5 shadow-sm">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          ขอบคุณที่ให้ความร่วมมือ!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          หวังว่าผู้เรียนทุกคนจะได้รับความรู้จากการเรียนรู้ผ่าน Simulation นี้ และพร้อมก้าวสู่การเป็นส่วนหนึ่งในการดูแลผู้ป่วยโรคหัวใจ
        </p>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleExportCSV}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-teal-200 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>ดาวน์โหลดข้อมูลวิจัย (SPSS .CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportJSON}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center gap-2 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>ดาวน์โหลด Raw Data (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Satisfaction Survey Form */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <MessageSquare className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">{SURVEY_TITLE}</h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{SURVEY_SUBTITLE}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
              isComplete
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-pink-50 text-rose-700 border border-pink-200'
            }`}
          >
            ตอบแล้ว {summary.answeredCount} / {ALL_SURVEY_ITEMS.length} ข้อ
          </span>
        </div>

        {/* Instruction & 5-level Likert Scale Key */}
        <div className="mb-6 p-4 rounded-2xl bg-pink-50/60 border border-pink-100">
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
            <span className="font-bold text-slate-800">คำชี้แจง :</span> {SURVEY_INSTRUCTION}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
            {SURVEY_SCALE_OPTIONS.map((opt) => (
              <div
                key={opt.score}
                className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0.5 px-2.5 py-1.5 rounded-xl bg-white border border-pink-100"
              >
                <span className="font-mono font-bold text-rose-600">{opt.score} หมายถึง</span>
                <span className="text-slate-600">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmitSurvey} className="space-y-7">
          {SURVEY_DOMAINS.map((domain) => (
            <div key={domain.id} className="space-y-3">
              <div className="px-4 py-2.5 rounded-xl bg-pink-100/80 border border-pink-200 text-slate-800 font-bold text-xs sm:text-sm">
                {domain.title}
              </div>

              <div className="space-y-3">
                {domain.items.map((item) => {
                  const currentScore = ratings[item.id];
                  const isMissing = showValidationError && currentScore === undefined;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-colors ${
                        isMissing
                          ? 'bg-rose-50/70 border-rose-300'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <p className="text-xs sm:text-sm text-slate-800 mb-3 font-semibold leading-relaxed">
                        {item.text}
                      </p>
                      <div className="grid grid-cols-5 gap-2 max-w-lg">
                        {SURVEY_SCALE_OPTIONS.map((opt) => {
                          const isSelected = currentScore === opt.score;
                          return (
                            <button
                              key={opt.score}
                              type="button"
                              onClick={() => handleSetRating(item.id, opt.score)}
                              aria-pressed={isSelected}
                              className={`py-2 px-1.5 rounded-xl transition-all border flex flex-col items-center justify-center gap-0.5 ${
                                isSelected
                                  ? 'bg-rose-500 text-white border-rose-400 shadow-md ring-2 ring-rose-200'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-rose-300 hover:text-rose-600'
                              }`}
                            >
                              <span className="font-bold font-mono text-sm leading-none">
                                {opt.score}
                              </span>
                              <span
                                className={`text-[10px] leading-tight text-center ${
                                  isSelected ? 'text-rose-50' : 'text-slate-400'
                                }`}
                              >
                                {opt.shortLabel}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนานวัตกรรม CardioSim ในอนาคต (ถ้ามี)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="แสดงความคิดเห็นหรือข้อเสนอแนะ..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-800 focus:ring-2 focus:ring-rose-400 focus:bg-white focus:outline-none"
            />
          </div>

          {showValidationError && !isComplete && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                กรุณาประเมินให้ครบทั้ง {summary.totalItems} ข้อก่อนส่งแบบประเมิน (ยังขาดอีก {remainingCount} ข้อ)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onRestart}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 border border-slate-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>เริ่มเล่นใหม่ตั้งแต่ต้น (Restart)</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitted}
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-50"
            >
              {isSubmitted ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              <span>{isSubmitted ? 'ส่งแบบประเมินเรียบร้อย' : 'ส่งแบบประเมิน'}</span>
            </button>
          </div>
        </form>

        {isSubmitted && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                บันทึกแบบประเมินเรียบร้อยแล้ว (ค่าเฉลี่ยรวม {summary.overallMean?.toFixed(2)} / 5.00)
                — กดปุ่ม &quot;ดาวน์โหลดข้อมูลวิจัย (SPSS .CSV)&quot; ด้านบนเพื่อนำผลไปวิเคราะห์สถิติได้ทันที
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-emerald-800">
              <div className="bg-white/70 rounded-xl px-3 py-1.5 border border-emerald-200">
                ด้านที่ 1 (ความชัดเจน): <span className="font-mono font-bold">{summary.domainMeans.domain1?.toFixed(2)}</span>
              </div>
              <div className="bg-white/70 rounded-xl px-3 py-1.5 border border-emerald-200">
                ด้านที่ 2 (ลดความกังวล): <span className="font-mono font-bold">{summary.domainMeans.domain2?.toFixed(2)}</span>
              </div>
              <div className="bg-white/70 rounded-xl px-3 py-1.5 border border-emerald-200">
                ด้านที่ 3 (พึงพอใจรวม): <span className="font-mono font-bold">{summary.domainMeans.domain3?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
