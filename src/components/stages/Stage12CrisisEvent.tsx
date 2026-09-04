import React, { useState, useEffect } from 'react';
import { CASE_1_DETAILS } from '../../data/case1Data';
import { CanvasEKG } from '../ekg/CanvasEKG';
import { AlertOctagon, Bell, Siren, CheckCircle2, XCircle, ChevronRight, Activity, ShieldAlert, HeartPulse, Lightbulb } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { ClinicalHintModal } from '../common/ClinicalHintModal';
import { CrisisVignetteOverlay } from '../common/CrisisVignetteOverlay';
import { SpotlightCard } from '../ui/SpotlightCard';
import { ShinyButton } from '../ui/ShinyButton';

interface Stage12CrisisEventProps {
  onComplete: () => void;
}

export const Stage12CrisisEvent: React.FC<Stage12CrisisEventProps> = ({ onComplete }) => {
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [isResolved, setIsResolved] = useState(false);
  const [showHintModal, setShowHintModal] = useState(false);

  const crisis = CASE_1_DETAILS.crisisEvent;

  useEffect(() => {
    clinicalAudio.startAlarm();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 300]);
    }
    return () => {
      clinicalAudio.stopAlarm();
    };
  }, []);

  const interventions = [
    {
      id: 'opt_1',
      title: 'จัดท่า High Fowler\'s 90 องศา เปลี่ยนเป็น Non-rebreather mask 10-15 L/min และกดเรียกทีมแพทย์ฉุกเฉิน (Rapid Response Team) ทันที',
      isCorrect: true,
      explanation: 'ถูกต้องสูงสุด! ผู้ป่วยเกิด Acute Pulmonary Edema ร่วมกับ SVT และ SpO2 ตกเหลือ 82% การให้ออกซิเจนความเข้มข้นสูงพิเศษผ่านถุงสำรอง และเรียกทีมช่วยเหลือด่วน เป็นการกู้ชีพฉุกเฉินตามมาตรฐาน ACLS'
    },
    {
      id: 'opt_2',
      title: 'ปรับเตียงให้นอนราบลงเพื่อป้องกันการเป็นลม และให้ผู้ป่วยดื่มน้ำอุ่น',
      isCorrect: false,
      explanation: 'อันตรายถึงชีวิต! การให้นอนราบจะทำให้น้ำท่วมปอดทะลักจนหยุดหายใจ (Asphyxiation) ภายในไม่กี่นาที'
    },
    {
      id: 'opt_3',
      title: 'ฉีดยาปฏิชีวนะฆ่าเชื้อทันที และเฝ้ารอดูอาการต่อไปอีก 30 นาที',
      isCorrect: false,
      explanation: 'ไม่ถูกต้อง! ปัญหาเร่งด่วนที่สุดคือภาวะขาดออกซิเจนวิกฤตและหัวใจเต้นเร็วผิดจังหวะ ไม่ใช่การติดเชื้อ'
    }
  ];

  const handleSelectIntervention = (id: string) => {
    setSelectedIntervention(id);
    const item = interventions.find(i => i.id === id);
    if (item?.isCorrect) {
      clinicalAudio.stopAlarm();
      clinicalAudio.playSuccessChime();
      setIsResolved(true);
    } else {
      clinicalAudio.playHeartBeep(500, 0.15);
    }
  };

  const handleNext = () => {
    clinicalAudio.stopAlarm();
    clinicalAudio.playHeartBeep(880, 0.1);
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8 relative">
      {/* Emergency Pulsing Red Vignette Screen Ambience */}
      <CrisisVignetteOverlay active={!isResolved} />

      {/* Flashing Emergency Header Banner */}
      <div className={`rounded-3xl p-6 sm:p-7 mb-6 shadow-xl border-2 transition-all ${
        isResolved
          ? 'bg-emerald-50 border-emerald-400'
          : 'bg-rose-50 border-rose-500 shadow-rose-200 animate-pulse'
      }`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
            isResolved ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200' : 'bg-rose-600 text-white shadow-md shadow-rose-300 animate-bounce'
          }`}>
            {isResolved ? <CheckCircle2 className="w-9 h-9" /> : <Siren className="w-9 h-9" />}
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full border flex items-center gap-1.5 ${
                isResolved
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                  : 'bg-rose-100 border-rose-300 text-rose-800 animate-pulse'
              }`}>
                {isResolved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                    <span>พ้นวิกฤตเฉียบพลันแล้ว</span>
                  </>
                ) : (
                  <span>สัญญาณเตือนวิกฤต (NCJMM: Evaluate Outcomes)</span>
                )}
              </span>
              <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
                ความคืบหน้า 85%
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">
              {isResolved
                ? 'การตอบสนองถูกต้อง: ผู้ป่วยเริ่มคงที่ SpO2 ขยับขึ้นเป็น 94%'
                : 'ผู้ป่วยมีอาการทรุดลงเฉียบพลัน (Acute Deterioration)'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {crisis.triggerText}
            </p>
          </div>

          <button
            onClick={() => setShowHintModal(true)}
            className="text-xs bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-sm self-center"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>ปรึกษาหัวหน้าเวร</span>
          </button>
        </div>
      </div>

      <ClinicalHintModal
        currentStage="STAGE8_CRISIS_EVENT"
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
      />

      {/* Realtime Critical Monitor Viewport */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-7 shadow-xl mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Canvas EKG in SVT mode */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 animate-pulse">
                <Activity className="w-4 h-4" />
                EKG Monitor: {isResolved ? 'Sinus Rhythm 96 bpm' : crisis.ekgRhythm}
              </span>
              <span className="text-xs font-mono text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                CRITICAL ALERT
              </span>
            </div>

            <CanvasEKG
              rhythm={isResolved ? 'NORMAL' : 'SVT'}
              heartRate={isResolved ? 96 : 148}
              height={130}
              enableAudioBeep={false}
            />
          </div>

          {/* Critical Vital Signs Numbers */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-bold">BP (วิกฤต)</span>
              <p className="text-sm font-bold font-mono text-rose-700">
                {isResolved ? '145/88' : crisis.vitals.bp}
              </p>
            </div>
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-bold">PR (SVT)</span>
              <p className="text-sm font-bold font-mono text-rose-700">
                {isResolved ? '96 bpm' : `${crisis.vitals.hr} bpm`}
              </p>
            </div>
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-bold">RR</span>
              <p className="text-sm font-bold font-mono text-rose-700">
                {isResolved ? '22 /min' : `${crisis.vitals.rr} /min`}
              </p>
            </div>
            <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-center">
              <span className="text-[10px] text-rose-700 font-bold">SpO2 (วิกฤต)</span>
              <p className={`text-sm font-bold font-mono ${
                isResolved ? 'text-emerald-700' : 'text-rose-700 animate-pulse'
              }`}>
                {isResolved ? '94%' : crisis.vitals.spo2}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Interventions Selection */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3.5 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>เลือกมาตรการช่วยชีวิตฉุกเฉินทันที (Emergency Intervention)</span>
          </h3>

          <div className="space-y-3">
            {interventions.map(item => {
              const isSelected = selectedIntervention === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectIntervention(item.id)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all ${
                    isSelected
                      ? item.isCorrect
                        ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-md'
                        : 'bg-rose-50 border-rose-400 ring-2 ring-rose-300 shadow-md'
                      : 'bg-slate-50/70 border-slate-200 hover:border-pink-300'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">
                    {item.title}
                  </span>
                  {isSelected && (
                    <p className={`text-xs mt-2.5 p-3 rounded-xl border leading-relaxed font-medium ${
                      item.isCorrect
                        ? 'bg-emerald-100/70 border-emerald-200 text-emerald-900'
                        : 'bg-rose-100/70 border-rose-200 text-rose-900'
                    }`}>
                      {item.explanation}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Next Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isResolved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>ผู้ป่วยพ้นวิกฤตแล้ว สามารถเข้าสู่ขั้นตอนสรุปผลได้</span>
            </>
          ) : (
            <span>กรุณาเลือกมาตรการกู้ชีพฉุกเฉิน</span>
          )}
        </p>

        <ShinyButton
          onClick={handleNext}
          disabled={!isResolved}
          variant={isResolved ? 'success' : 'crisis'}
          size="lg"
          icon={<ChevronRight className="w-4 h-4" />}
        >
          เข้าสู่การสรุปผลการพยาบาล (Next)
        </ShinyButton>
      </div>
    </div>
  );
};
