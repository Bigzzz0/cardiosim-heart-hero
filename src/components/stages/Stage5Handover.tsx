import React, { useState } from 'react';
import { CASE_1_DETAILS } from '../../data/case1Data';
import { Volume2, VolumeX, Play, Pause, FileText, Stethoscope, ChevronRight, User, AlertCircle, Clock, HeartPulse, ClipboardCheck } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { DoctorApprovedStamp, PatientBarcodeTag } from '../common/DoctorApprovedStamp';

interface Stage5HandoverProps {
  onComplete: () => void;
}

export const Stage5Handover: React.FC<Stage5HandoverProps> = ({ onComplete }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'isbar'>('profile');

  const patient = CASE_1_DETAILS.patient;

  const handleToggleAudio = () => {
    if (!isPlayingAudio) {
      clinicalAudio.playHeartBeep(800, 0.08);
      setIsPlayingAudio(true);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const handleNext = () => {
    setIsPlayingAudio(false);
    clinicalAudio.playHeartBeep(880, 0.1);
    onComplete();
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 7) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              ภารกิจที่ 1 / รับข้อมูลผู้ป่วย
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 10%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            รับส่งเวรทางการพยาบาล (ISBAR Handover)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            รับฟังรายงานส่งเวรจากพยาบาลเวรเช้า และทบทวนประวัติการเจ็บป่วยร่วมกับคำสั่งการรักษา
          </p>
        </div>

        {/* Patient Barcode Tag & Audio Voiceover Simulated Bar */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          <PatientBarcodeTag hn="HN 65-098231" patientName={patient.name} />

          <div className="flex items-center gap-3 bg-rose-50/80 border border-rose-100 px-4 py-2.5 rounded-2xl">
            <button
              onClick={handleToggleAudio}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isPlayingAudio
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm'
              }`}
            >
              {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-rose-500" />
                <span>เสียงบรรยายสรุปเคส</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {isPlayingAudio ? 'กำลังเล่นเสียงรายงานเวร...' : 'กดเพื่อฟังเสียงรายงานเคส'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabbed Chart Card */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-100 mb-6 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>ข้อมูลและประวัติผู้ป่วย</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>คำสั่งแพทย์ (Doctor's Orders)</span>
          </button>

          <button
            onClick={() => setActiveTab('isbar')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'isbar'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>รายงานส่งเวรตามหลัก ISBAR</span>
          </button>
        </div>

        {/* Tab 1: Profile & History */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">ข้อมูลผู้ป่วย</span>
                <p className="text-base font-bold text-slate-800 mt-1">{patient.name}</p>
                <p className="text-xs text-slate-500 font-mono">อายุ {patient.age} ปี | เพศ {patient.gender}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">โรคประจำตัว (Underlying)</span>
                <p className="text-sm font-bold text-rose-600 mt-1">{patient.underlying}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">สัญญาณชีพแรกรับ (Vital Signs)</span>
                <p className="text-sm font-mono font-bold text-teal-700 mt-1">
                  BP {patient.admissionVitals.bp} | HR {patient.admissionVitals.hr}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  RR {patient.admissionVitals.rr}/min | SpO2 {patient.admissionVitals.spo2}
                </p>
              </div>
            </div>

            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  อาการสำคัญที่มาโรงพยาบาล (Chief Complaint)
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {patient.chiefComplaint}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  ประวัติการเจ็บป่วยปัจจุบัน (Present Illness)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {patient.presentIllness}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <h4 className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                  สภาพทั่วไปแรกรับ (General Appearance)
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {patient.admissionVitals.general}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Doctor Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>พยาบาลต้องตรวจสอบคำสั่งแพทย์และปฏิบัติการพยาบาลตามลำดับความสำคัญอย่างเคร่งครัด</span>
            </div>

            <div className="bg-slate-50 rounded-2xl border border-slate-200 divide-y divide-slate-200">
              {CASE_1_DETAILS.doctorOrders.map((order, idx) => (
                <div key={idx} className="p-3.5 flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{order}</span>
                </div>
              ))}
            </div>

            {/* Official Physician Verification Stamp */}
            <div className="flex justify-end pt-3">
              <DoctorApprovedStamp
                doctorName="นพ. ธีระศักดิ์ (ว. 48921)"
                timestamp="08:30 น. STAT VERIFIED"
              />
            </div>
          </div>
        )}

        {/* Tab 3: ISBAR Report */}
        {activeTab === 'isbar' && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold font-mono text-rose-600">I - Identification (ระบุตัวตน)</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                พยาบาลเวรเช้าส่งเวร: ผู้ป่วยหญิง 39 ปี เตียง 3 วินิจฉัย Acute Heart Failure from Hypertensive Crisis
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold font-mono text-rose-600">S - Situation (สถานการณ์)</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                ผู้ป่วยยังมีอาการเหนื่อยเล็กน้อยขณะพัก หนุนหมอนสูง 2 ใบ ได้รับ O2 cannula 3 L/min SpO2 อยู่ที่ 95%
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold font-mono text-rose-600">B - Background (ประวัติความเป็นมา)</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                มีโรคประจำตัว DM, HT, DLP ขาดยาต่อเนื่อง ความดันขึ้นสูง 6 ชั่วโมงก่อนมาโรงพยาบาล
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold font-mono text-rose-600">A - Assessment (การประเมิน)</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                ฟังปอดมี Crepitation ชายปอดทั้งสองข้าง ขาบวม Pitting edema 1+ EKG เป็น Sinus Tachycardia 112 bpm
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold font-mono text-rose-600">R - Recommendation (ข้อเสนอแนะ)</span>
              <p className="text-sm text-slate-700 mt-1 font-medium">
                ต้องให้ Furosemide 40 mg IV stat, ติดตาม Urine Output ทุกชั่วโมง และเฝ้าระวังอาการเหนื่อยอย่างใกล้ชิด
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Next Action */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all"
        >
          <span>รับข้อมูลครบถ้วน & ไปสู่การตรวจร่างกาย (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
