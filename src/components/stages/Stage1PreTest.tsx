import React, { useState } from 'react';
import { PRETEST_QUESTIONS } from '../../data/preTestData';
import { CheckCircle2, ChevronRight, ChevronLeft, HelpCircle, Send, FileQuestion, UserCheck } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';

interface Stage1PreTestProps {
  onComplete: (score: number, answers: Record<number, string>) => void;
}

export const Stage1PreTest: React.FC<Stage1PreTestProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const question = PRETEST_QUESTIONS[currentIdx];
  const totalQuestions = PRETEST_QUESTIONS.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (key: string) => {
    clinicalAudio.playHeartBeep(880, 0.05);
    setAnswers(prev => ({
      ...prev,
      [question.id]: key
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    let score = 0;
    PRETEST_QUESTIONS.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        score++;
      }
    });
    clinicalAudio.playSuccessChime();
    onComplete(score, answers);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 1 Pre-Test banner) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center shadow-md shadow-rose-200 shrink-0">
              <FileQuestion className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
                  ขั้นตอนที่ 1 / ประเมินความรู้เดิม
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
                Pre-Test (แบบทดสอบก่อนเรียน 10 ข้อ)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                เรื่องการพยาบาลผู้ป่วยที่มีภาวะ Congestive Heart Failure ก่อนเข้าสู่สถานการณ์เสมือนจริง
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center bg-rose-50/70 border border-rose-100 px-4 py-2 rounded-2xl">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">ตอบแล้ว</div>
              <div className="text-base font-bold font-mono text-rose-600">
                {answeredCount} / {totalQuestions}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border-4 border-rose-100 border-t-rose-500 flex items-center justify-center font-bold text-xs text-rose-600 font-mono">
              {Math.round((answeredCount / totalQuestions) * 100)}%
            </div>
          </div>
        </div>

        {/* Question Pills Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-slate-100">
          {PRETEST_QUESTIONS.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-200 scale-105'
                    : isAnswered
                    ? 'bg-pink-100/90 text-rose-700 border border-pink-200'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {q.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-pink-100 text-rose-600 font-bold font-mono flex items-center justify-center shrink-0 border border-pink-200">
            {question.id}
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
              {question.question}
            </h3>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {question.options.map(opt => {
            const isSelected = answers[question.id] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt.key)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-2xl border transition-all flex items-start gap-3.5 group ${
                  isSelected
                    ? 'bg-rose-50/90 border-rose-400 text-rose-950 shadow-sm ring-1 ring-rose-300'
                    : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-white text-slate-500 border border-slate-200 group-hover:border-slate-300'
                  }`}
                >
                  {opt.key}
                </div>
                <div className="text-sm sm:text-base leading-relaxed flex-1 font-medium">
                  {opt.text}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold flex items-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ข้อก่อนหน้า</span>
          </button>

          {currentIdx < totalQuestions - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-sm font-bold flex items-center gap-1.5 shadow-md shadow-rose-200 transition-all"
            >
              <span>ข้อถัดไป</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount < totalQuestions}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold flex items-center gap-2 shadow-md shadow-teal-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>ส่งแบบทดสอบ & ไปต่อ</span>
            </button>
          )}
        </div>

        {answeredCount < totalQuestions && currentIdx === totalQuestions - 1 && (
          <p className="text-center text-xs text-amber-600 mt-3 flex items-center justify-center gap-1.5 font-medium">
            <HelpCircle className="w-4 h-4" />
            กรุณาตอบคำถามให้ครบทั้ง 10 ข้อก่อนกดยืนยันส่งแบบทดสอบ
          </p>
        )}
      </div>
    </div>
  );
};
