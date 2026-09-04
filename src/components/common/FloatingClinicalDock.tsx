import React, { useState } from 'react';
import { Stethoscope, Pill, Activity, ClipboardList, PhoneCall, X, Volume2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { GameStage } from '../../types/game';
import { CanvasEKG } from '../ekg/CanvasEKG';

interface FloatingClinicalDockProps {
  currentStage: GameStage;
}

export const FloatingClinicalDock: React.FC<FloatingClinicalDockProps> = ({ currentStage }) => {
  const [activeModal, setActiveModal] = useState<'stethoscope' | 'meds' | 'ecg' | 'callDoctor' | null>(null);

  // Show dock during clinical stages
  const clinicalStages: GameStage[] = [
    'STAGE1_HANDOVER',
    'STAGE2_ASSESSMENT',
    'STAGE3_PRIORITIZATION',
    'STAGE4_RATIONALE',
    'STAGE5_ABC_ACTION',
    'STAGE6_MEDICATION',
    'STAGE7_IO_RECORD',
    'STAGE8_CRISIS_EVENT',
    'STAGE9_DEBRIEF'
  ];

  if (!clinicalStages.includes(currentStage)) {
    return null;
  }

  const isCrisis = currentStage === 'STAGE8_CRISIS_EVENT';

  const handleToolClick = (tool: 'stethoscope' | 'meds' | 'ecg' | 'ehr' | 'callDoctor') => {
    clinicalAudio.playHeartBeep(880, 0.05);

    if (tool === 'ehr') {
      window.dispatchEvent(new CustomEvent('toggle-ehr-drawer'));
      return;
    }

    setActiveModal(tool);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* 21st.dev Style Floating Clinical Dock (Centered Bottom) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 select-none transition-all duration-300">
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-pink-100 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:border-pink-300 transition-all">
          {/* 1. Stethoscope */}
          <button
            onClick={() => handleToolClick('stethoscope')}
            className="group relative p-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 border border-transparent hover:border-rose-200"
            title="หูฟังตรวจคนไข้ (Stethoscope)"
          >
            <Stethoscope className="w-5 h-5" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              ฟังเสียงปอด/หัวใจ
            </span>
          </button>

          {/* 2. Meds Kit */}
          <button
            onClick={() => handleToolClick('meds')}
            className="group relative p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-600 transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 border border-transparent hover:border-teal-200"
            title="ชุดยาและสารน้ำ (Medications)"
          >
            <Pill className="w-5 h-5" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              ชุดยาและสารน้ำ
            </span>
          </button>

          {/* 3. ECG Monitor */}
          <button
            onClick={() => handleToolClick('ecg')}
            className="group relative p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-600 transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 border border-transparent hover:border-sky-200"
            title="คลื่นไฟฟ้าหัวใจ (ECG Monitor)"
          >
            <Activity className="w-5 h-5" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              จอคลื่นไฟฟ้าหัวใจ
            </span>
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* 4. EHR Chart */}
          <button
            onClick={() => handleToolClick('ehr')}
            className="group relative p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 border border-rose-200"
            title="แฟ้มประวัติเวชระเบียน (EHR)"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              แฟ้มประวัติ EHR
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </button>

          {/* 5. Call Doctor */}
          <button
            onClick={() => handleToolClick('callDoctor')}
            className={`group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1 hover:scale-110 active:scale-95 border ${
              isCrisis
                ? 'bg-red-500 text-white animate-pulse border-red-600 shadow-md shadow-red-300'
                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-600 border-transparent hover:border-amber-200'
            }`}
            title="รายงานแพทย์เวร (Call Attending Doctor)"
          >
            <PhoneCall className="w-5 h-5" />
            <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              รายงานแพทย์เวร
            </span>
          </button>
        </div>
      </div>

      {/* Dock Tools Modals */}
      {activeModal && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-pink-100 relative animate-in zoom-in-95 duration-200"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal: Stethoscope */}
            {activeModal === 'stethoscope' && (
              <div>
                <div className="flex items-center gap-2 text-rose-600 font-bold text-lg mb-3">
                  <Stethoscope className="w-6 h-6" />
                  <span>หูฟังตรวจคนไข้ (Clinical Auscultation)</span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  คลิกเพื่อฟังเสียงทางคลินิกที่สำคัญสำหรับการประเมินภาวะน้ำท่วมปอดและหัวใจล้มเหลว
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => clinicalAudio.playCrepitationSound()}
                    className="p-4 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-left transition-all group flex items-start gap-3"
                  >
                    <Volume2 className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-sm text-rose-900">Fine Crepitation</div>
                      <div className="text-xs text-rose-700">เสียงชายปอดบวมน้ำ (Fluid in alveoli)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => clinicalAudio.playS3GallopSound()}
                    className="p-4 rounded-2xl bg-teal-50 border border-teal-200 hover:bg-teal-100 text-left transition-all group flex items-start gap-3"
                  >
                    <Volume2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-bold text-sm text-teal-900">S3 Gallop Sound</div>
                      <div className="text-xs text-teal-700">เสียงหัวใจห้องล่างรับเลือดเกิน (Volume overload)</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Meds */}
            {activeModal === 'meds' && (
              <div>
                <div className="flex items-center gap-2 text-teal-600 font-bold text-lg mb-3">
                  <Pill className="w-6 h-6" />
                  <span>ข้อมูลยาและสารน้ำฉุกเฉิน (Emergency Meds)</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="font-bold text-sm text-teal-900">Furosemide (Lasix) 40 mg IV STAT</div>
                    <p className="text-xs text-teal-800 mt-1">
                      ยาขับปัสสาวะกลุ่ม Loop Diuretic ลดภาวะน้ำคั่งในปอด (Preload reduction)
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-rose-700 bg-rose-100/70 p-2 rounded-xl flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>ข้อควรระวัง: ฉีดช้าๆ อัตราไม่เกิน 4 มก./นาที (10 นาทีต่อ 40 มก.) เพื่อป้องกันหูดับชั่วคราว</span>
                    </div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                    <div className="font-bold text-sm text-sky-900">Oxygen Therapy</div>
                    <p className="text-xs text-sky-800 mt-1">
                      ให้ผ่าน Oxygen Cannula 3-5 LPM หรือ Mask with Reservoir Bag 10-15 LPM กรณี SpO2 &lt; 90%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Modal: ECG */}
            {activeModal === 'ecg' && (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 text-sky-600 font-bold text-lg">
                    <Activity className="w-6 h-6" />
                    <span>จอแสดงผลคลื่นไฟฟ้าหัวใจ (Lead II Telemetry)</span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 mb-3">
                  <CanvasEKG
                    rhythm={isCrisis ? 'SVT' : 'NORMAL'}
                    heartRate={isCrisis ? 148 : 78}
                    height={120}
                    enableAudioBeep={false}
                  />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600 flex justify-between items-center">
                  <span>คลื่นปัจจุบัน: <strong className="text-slate-800">{isCrisis ? 'Supraventricular Tachycardia (SVT)' : 'Normal Sinus Rhythm'}</strong></span>
                  <span className="font-mono font-bold text-rose-600">{isCrisis ? '148 bpm (Tachycardia)' : '78 bpm'}</span>
                </div>
              </div>
            )}

            {/* Modal: Call Doctor */}
            {activeModal === 'callDoctor' && (
              <div>
                <div className="flex items-center gap-2 text-amber-600 font-bold text-lg mb-3">
                  <PhoneCall className="w-6 h-6" />
                  <span>รายงานแพทย์เวรผ่านระบบ ISBAR</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 mb-3 text-xs text-amber-900 space-y-1.5">
                  <p><strong>I (Identify):</strong> พยาบาลประจำหอผู้ป่วยวิกฤต รายงานเคสนายสมชาย เตียง 4</p>
                  <p><strong>S (Situation):</strong> ผู้ป่วยมีอาการหายใจเหนื่อยหอบรุนแรง Orthopnea นอนราบไม่ได้</p>
                  <p><strong>B (Background):</strong> โรคประจำตัว ความดันโลหิตสูง และหัวใจโต ขาบวม 2 ข้าง</p>
                  <p><strong>A (Assessment):</strong> SpO2 ตกเหลือ {isCrisis ? '82%' : '88%'}, BP สูง และฟังปอดได้ Fine Crepitation ทั้ง 2 ข้าง</p>
                  <p><strong>R (Recommendation):</strong> ขอคำสั่งให้ Furosemide 40 mg IV STAT และ Oxygen Mask with bag</p>
                </div>
                <button
                  onClick={() => {
                    clinicalAudio.playHeartBeep(880, 0.1);
                    closeModal();
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm shadow-md shadow-amber-200 hover:from-amber-600 hover:to-amber-700 transition-all"
                >
                  ยืนยันการรายงานแพทย์เวร
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
