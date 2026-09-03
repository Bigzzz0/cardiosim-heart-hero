import React, { useState } from 'react';
import { Droplet, CheckCircle2, XCircle, ChevronRight, Calculator, AlertCircle, Sparkles, FileSpreadsheet, Lightbulb, ArrowDown, TrendingDown } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { ClinicalHintModal } from '../common/ClinicalHintModal';

interface Stage11IORecordProps {
  onComplete: (errors: number) => void;
}

export const Stage11IORecord: React.FC<Stage11IORecordProps> = ({ onComplete }) => {
  const [totalIntakeInput, setTotalIntakeInput] = useState('');
  const [totalOutputInput, setTotalOutputInput] = useState('');
  const [balanceInput, setBalanceInput] = useState('');
  const [showHintModal, setShowHintModal] = useState(false);

  const [hasChecked, setHasChecked] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  const correctIntake = 150;
  const correctOutput = 350;
  const correctBalance = -200;

  const handleCheckCalculation = () => {
    clinicalAudio.playHeartBeep(880, 0.08);
    let err = 0;
    if (parseInt(totalIntakeInput) !== correctIntake) err++;
    if (parseInt(totalOutputInput) !== correctOutput) err++;
    if (parseInt(balanceInput) !== correctBalance) err++;

    setErrorCount(err);
    setHasChecked(true);

    if (err === 0) {
      clinicalAudio.playSuccessChime();
    } else {
      clinicalAudio.playHeartBeep(600, 0.1);
    }
  };

  const handleAutoFill = () => {
    setTotalIntakeInput('150');
    setTotalOutputInput('350');
    setBalanceInput('-200');
    setErrorCount(0);
    setHasChecked(true);
    clinicalAudio.playSuccessChime();
  };

  const isAllCorrect = hasChecked && errorCount === 0;

  const handleNext = () => {
    clinicalAudio.playHeartBeep(880, 0.1);
    onComplete(errorCount);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 py-8">
      {/* Top Banner (Matching PDF Page 9) */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 mb-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full uppercase tracking-wider">
              ภารกิจที่ 6 / บันทึกชาร์ตสารน้ำ (NCJMM: Take Action)
            </span>
            <span className="text-xs font-mono text-rose-600 font-bold bg-pink-100 px-2.5 py-0.5 rounded-full">
              ความคืบหน้า 50%
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-1">
            บันทึกปริมาณสารน้ำเข้า-ออก (Intake & Output Balance)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            รวบรวมข้อมูลสารน้ำเข้าและสารน้ำออกหลังให้ยา Furosemide 1 ชั่วโมง พร้อมคำนวณสมดุลสารน้ำสุทธิ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            onClick={() => setShowHintModal(true)}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold shadow-sm"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>ปรึกษาหัวหน้าเวร</span>
          </button>

          <button
            onClick={handleAutoFill}
            className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>(เฉลยลัด) กรอกตัวเลขถูกต้อง</span>
          </button>
        </div>
      </div>

      <ClinicalHintModal
        currentStage="STAGE7_IO_RECORD"
        isOpen={showHintModal}
        onClose={() => setShowHintModal(false)}
      />

      {/* Main Clinical Table & Form */}
      <div className="bg-white border border-pink-100 rounded-3xl p-6 sm:p-8 shadow-xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left: Raw Clinical Data Box */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Droplet className="w-4 h-4 text-sky-600" />
              <span>ข้อมูลสารน้ำที่บันทึกได้ในเวร 1 ชั่วโมงแรก</span>
            </h3>

            {/* Intake Card */}
            <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">
                สารน้ำเข้า (Intake)
              </span>
              <div className="flex justify-between items-center text-sm py-1 border-b border-sky-100 font-medium">
                <span className="text-slate-700">• สารน้ำทางหลอดเลือดดำ (IV Fluid)</span>
                <span className="font-mono font-bold text-sky-900">100 mL</span>
              </div>
              <div className="flex justify-between items-center text-sm py-1 font-medium">
                <span className="text-slate-700">• น้ำดื่ม (Oral Fluid)</span>
                <span className="font-mono font-bold text-sky-900">50 mL</span>
              </div>
            </div>

            {/* Output Card */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                สารน้ำออก (Output)
              </span>
              <div className="flex justify-between items-center text-sm py-1 font-medium">
                <span className="text-slate-700">• ปัสสาวะ (Urine via Foley catheter)</span>
                <span className="font-mono font-bold text-amber-900">350 mL</span>
              </div>
            </div>

            {/* Fluid Balance Visual Gauge */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                <span>สมดุลสารน้ำเปรียบเทียบ (Visual Balance Ratio)</span>
                <span className="font-mono text-rose-600 font-bold">150 vs 350 mL</span>
              </div>
              <div className="flex h-4 rounded-full overflow-hidden bg-slate-200 border border-slate-300">
                <div style={{ width: '30%' }} className="bg-sky-500" title="Intake 150 mL" />
                <div style={{ width: '70%' }} className="bg-amber-500" title="Output 350 mL" />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5">
                <span className="flex items-center gap-1 text-sky-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Intake 30%
                </span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Output 70% (ขับน้ำสำเร็จ)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Student Calculation Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-rose-500" />
                <span>คำนวณและกรอกตัวเลขลงชาร์ต</span>
              </h3>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    1. ปริมาณสารน้ำเข้ารวม (Total Intake) [mL]
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={totalIntakeInput}
                    onChange={(e) => setTotalIntakeInput(e.target.value)}
                    placeholder="เช่น 150"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    2. ปริมาณสารน้ำออกรวม (Total Output) [mL]
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={totalOutputInput}
                    onChange={(e) => setTotalOutputInput(e.target.value)}
                    placeholder="เช่น 350"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    3. สมดุลสารน้ำสุทธิ (Fluid Balance = Intake - Output) [mL]
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={balanceInput}
                    onChange={(e) => setBalanceInput(e.target.value)}
                    placeholder="เช่น -200 (หากติดลบให้ใส่เครื่องหมายลบ)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono text-rose-600 font-bold focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckCalculation}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm"
            >
              ตรวจสอบการคำนวณ
            </button>
          </div>
        </div>

        {/* Evaluation Banner */}
        {hasChecked && (
          <div className={`p-4 rounded-2xl border ${
            isAllCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {isAllCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
              <span>{isAllCorrect ? 'คำนวณถูกต้องสมบูรณ์!' : 'ตัวเลขยังไม่ถูกต้อง'}</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {isAllCorrect ? (
                'Intake 150 mL - Output 350 mL = สมดุลสารน้ำเป็นลบ (Negative Balance) -200 mL บ่งชี้ว่าผู้ป่วยตอบสนองต่อยาขับปัสสาวะได้ดี สามารถขับน้ำส่วนเกินออกจากระบบไหลเวียนโลหิตได้ตามเป้าหมาย'
              ) : (
                'กรุณาตรวจสอบการบวก-ลบ: Total Intake = 100 + 50 = 150 mL, Total Output = 350 mL และ Balance = 150 - 350 = -200 mL'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Footer Next Button */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
          {isAllCorrect ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
              <span>บันทึก I/O ถูกต้องเรียบร้อย สามารถไปสู่ภารกิจถัดไปได้</span>
            </>
          ) : (
            <span>กรุณาคำนวณและตรวจสอบให้ถูกต้อง</span>
          )}
        </p>

        <button
          onClick={handleNext}
          disabled={!isAllCorrect}
          className="py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-rose-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>ติดตามอาการผู้ป่วยต่อเนื่อง (Next)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
