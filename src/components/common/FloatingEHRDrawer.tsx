import React, { useState, useEffect } from 'react';
import { CASE_1_EHR } from '../../data/ehrCase1Data';
import { FileText, X, ClipboardList, FlaskConical, Stethoscope, Pill, AlertTriangle, CheckCircle2, Clock, User, ShieldCheck } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { DoctorApprovedStamp, PatientBarcodeTag } from './DoctorApprovedStamp';

export const FloatingEHRDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'labs' | 'isbar' | 'mar'>('orders');

  const ehr = CASE_1_EHR;

  const handleToggle = () => {
    clinicalAudio.playHeartBeep(880, 0.05);
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    const handleToggleEvent = () => {
      setIsOpen(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-ehr-drawer', handleToggleEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-ehr-drawer', handleToggleEvent);
    };
  }, [isOpen]);

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-3 sm:px-4 sm:py-3 rounded-2xl shadow-xl shadow-rose-300 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 group mb-[env(safe-area-inset-bottom,0px)]"
        title="เปิดดูเวชระเบียนอิเล็กทรอนิกส์ (EHR)"
      >
        <ClipboardList className="w-5 h-5 text-white" />
        <span className="text-xs font-bold hidden sm:inline tracking-wide">
          เวชระเบียนอิเล็กทรอนิกส์ (EHR)
        </span>
        <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping hidden sm:inline" />
      </button>

      {/* Slide-over Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Slide-over Drawer Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-xl bg-white border-l border-pink-100 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-200">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                  Electronic Health Record (EHR)
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {ehr.patientId}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-slate-800">
                {ehr.patientName} (อายุ {ehr.age} ปี) • {ehr.bedNumber}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Sub-bar */}
        <div className="bg-slate-50 px-5 py-2 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="text-slate-600">
            <strong className="text-rose-600">Dx:</strong> {ehr.diagnosis}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            แพทย์: {ehr.attendingPhysician}
          </div>
        </div>

        {/* 4 Tabs Bar */}
        <div className="flex border-b border-slate-100 px-4 gap-1 bg-white overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>คำสั่งแพทย์ (Orders)</span>
          </button>

          <button
            onClick={() => setActiveTab('labs')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'labs'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>ผลตรวจแล็บ & CXR</span>
          </button>

          <button
            onClick={() => setActiveTab('isbar')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'isbar'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>บันทึก ISBAR</span>
          </button>

          <button
            onClick={() => setActiveTab('mar')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'mar'
                ? 'border-rose-500 text-rose-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>ชาร์ตยา (MAR)</span>
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Tab 1: Doctor Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 flex items-center justify-between">
                <span>คำสั่งการรักษาทั้งหมด ({ehr.doctorOrders.length} รายการ)</span>
                <span className="text-[10px] text-rose-600 font-mono">แพทย์ลงนามเรียบร้อย</span>
              </div>

              <div className="space-y-2.5">
                {ehr.doctorOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        ord.type === 'stat'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {ord.type.toUpperCase()}
                      </span>
                      <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ord.orderedTime}
                      </span>
                    </div>
                    <p className="font-bold text-slate-800 text-xs sm:text-sm mt-1">
                      {ord.orderText}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-200 flex justify-between">
                      <span>ลงนาม: {ord.signedBy}</span>
                      <span className="text-rose-600 font-medium">
                        {ord.status === 'completed' ? 'ดำเนินการแล้ว' : 'กำลังดำเนินการ'}
                      </span>
                    </div>
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

          {/* Tab 2: Labs & Diagnostics */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              <div className="text-xs font-semibold text-slate-500">
                ผลการตรวจทางห้องปฏิบัติการ (Lab Results)
              </div>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                {ehr.labResults.map((lab, idx) => (
                  <div key={idx} className="p-3 text-xs flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{lab.testName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold ${
                          lab.isAbnormal ? 'text-rose-600' : 'text-slate-700'
                        }`}>
                          {lab.value} {lab.unit}
                        </span>
                        {lab.isAbnormal && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                            High
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>ค่าปกติ: {lab.referenceRange} {lab.unit}</span>
                      <span className="text-slate-600 italic line-clamp-1">{lab.clinicalSignificance}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CXR Report Card */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-900 mb-1.5">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>รายงานภาพถ่ายรังสีทรวงอก: {ehr.imagingReport.modality}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium mb-2">
                  {ehr.imagingReport.findings}
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 text-rose-900 font-bold">
                  Impression: {ehr.imagingReport.impression}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: ISBAR Handover */}
          {activeTab === 'isbar' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-rose-600 font-mono">I - Identification:</strong>
                <p className="text-slate-700 mt-1">
                  ผู้ป่วยหญิง 39 ปี เตียง CCU-03 วินิจฉัย Acute Decompensated Heart Failure from Hypertensive Crisis
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-rose-600 font-mono">S - Situation:</strong>
                <p className="text-slate-700 mt-1">
                  อาการหอบเหนื่อยรุนแรง หายใจเร็ว 24 ครั้ง/นาที SpO2 95% ขณะรับ O2 Cannula 3 L/min หนุนหมอนสูง 2 ใบ
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-rose-600 font-mono">B - Background:</strong>
                <p className="text-slate-700 mt-1">
                  มีโรคประจำตัว DM, HT, Dyslipidemia ขาดยาความดันต่อเนื่อง 2 สัปดาห์ ความดันขึ้นสูง 6 ชั่วโมงก่อนมา รพ.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-rose-600 font-mono">A - Assessment:</strong>
                <p className="text-slate-700 mt-1">
                  ฟังปอดพบ Fine Crepitation ชายปอด 2 ข้าง, หัวใจเต้นเร็วพบ S3 Gallop, ขาบวม Pitting edema 1+ EKG Sinus Tachycardia 112 bpm
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <strong className="text-rose-600 font-mono">R - Recommendation:</strong>
                <p className="text-slate-700 mt-1">
                  ให้ Furosemide 40 mg IV stat, ติดตาม I/O ทุก 1 ชม., จัดท่า High Fowler's 90 องศา และเฝ้าระวังอาการเหนื่อยอย่างใกล้ชิด
                </p>
              </div>
            </div>
          )}

          {/* Tab 4: MAR */}
          {activeTab === 'mar' && (
            <div className="space-y-3 text-xs">
              <div className="text-xs font-semibold text-slate-500">
                บันทึกการบริหารยา (Medication Administration Record)
              </div>

              {ehr.marList.map((mar, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-slate-800">{mar.drugName}</span>
                    <span className="bg-pink-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {mar.schedule}
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs mt-1">
                    <span>ขนาดยา: <strong>{mar.dosage}</strong> ทาง <strong>{mar.route}</strong></span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>สถานะ: {mar.lastAdministered}</span>
                    <span>ผู้บันทึก: {mar.nurseSignature}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ข้อมูลเวชระเบียนเสมือนจริงสำหรับฝึกอบรม
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </>
  );
};
