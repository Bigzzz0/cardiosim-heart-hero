import React, { useState } from 'react';
import { Heart, Volume2, VolumeX, UserCheck, RotateCcw, Activity } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { GameStage, StudentProfile } from '../../types/game';

interface HeaderProps {
  currentStage: GameStage;
  progressPercent: number;
  student: StudentProfile;
  onResetToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStage,
  progressPercent,
  student,
  onResetToLanding
}) => {
  const [isMuted, setIsMuted] = useState(clinicalAudio.getIsMuted());
  const [volume, setVolumeState] = useState(clinicalAudio.getVolume());
  const [showVolumePopup, setShowVolumePopup] = useState(false);

  const handleToggleSound = () => {
    const muted = clinicalAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolumeState(newVol);
    clinicalAudio.setVolume(newVol);
    if (isMuted && newVol > 0) {
      clinicalAudio.setMuted(false);
      setIsMuted(false);
    }
  };

  const getStageTitle = (stage: GameStage): string => {
    switch (stage) {
      case 'LANDING': return 'หน้าหลัก';
      case 'PRETEST': return 'แบบทดสอบก่อนเรียน (Pre-test)';
      case 'LEARNING_HUB': return 'คลังความรู้ก่อนเริ่มสถานการณ์';
      case 'SCENARIO_SELECT': return 'เลือกสถานการณ์ทางคลินิก';
      case 'MISSION_BRIEF': return 'บรีฟภารกิจการพยาบาล';
      case 'STAGE1_HANDOVER': return 'ภารกิจ 1: ข้อมูลผู้ป่วย & ISBAR';
      case 'STAGE2_ASSESSMENT': return 'ภารกิจ 2: ประเมินอาการ & ตรวจร่างกาย';
      case 'STAGE3_PRIORITIZATION': return 'ภารกิจ 3: จัดลำดับข้อวินิจฉัย';
      case 'STAGE4_RATIONALE': return 'ภารกิจ 4: สรุปเหตุผลทางคลินิก';
      case 'STAGE5_ABC_ACTION': return 'ภารกิจ 5: ปฏิบัติการพยาบาล ABC';
      case 'STAGE6_MEDICATION': return 'ภารกิจ 6: การบริหารยาขับปัสสาวะ';
      case 'STAGE7_IO_RECORD': return 'ภารกิจ 7: บันทึกสมดุลสารน้ำ I/O';
      case 'STAGE8_CRISIS_EVENT': return 'ภารกิจ 8: ภาวะวิกฤตฉุกเฉิน!';
      case 'STAGE9_DEBRIEF': return 'สรุปผลการพยาบาล (Debrief)';
      case 'POSTTEST': return 'แบบทดสอบหลังเรียน (Post-test)';
      case 'RESULTS_DASHBOARD': return 'สรุปผลการเรียนรู้ & เหรียญรางวัล';
      case 'SURVEY': return 'แบบประเมินความพึงพอใจ & สถิติวิจัย';
      default: return 'CardioSim';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100/80 px-4 py-3 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand (Matching PDF mockup with cute pink heart) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-rose-400 flex items-center justify-center shadow-md shadow-rose-200">
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
                CardioSim:
              </span>
              <span className="text-xs bg-pink-100 text-rose-700 border border-pink-200 px-2.5 py-0.5 rounded-full font-bold">
                Heart Hero
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              เกมจำลองสถานการณ์เสมือนจริงในการดูแลผู้ป่วยโรคหัวใจ
            </p>
          </div>
        </div>

        {/* Center: Stage title & Progress Bar (Desktop / Tablet) */}
        {currentStage !== 'LANDING' && (
          <div className="flex-1 max-w-md mx-2 hidden md:block">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="text-slate-700 font-semibold truncate">{getStageTitle(currentStage)}</span>
              <span className="font-bold font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/80 relative">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 transition-all duration-500 ease-out rounded-full relative shadow-xs"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-3 bg-white/70 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Right: Sound, Student ID, Restart */}
        <div className="flex items-center gap-2">
          {student.studentId && (
            <div className="hidden lg:flex items-center gap-1.5 bg-rose-50/80 border border-rose-100 px-3 py-1.5 rounded-xl text-xs text-rose-800">
              <UserCheck className="w-3.5 h-3.5 text-rose-600" />
              <span className="font-mono font-bold text-rose-700">{student.studentId}</span>
              <span className="text-slate-500 truncate max-w-[120px]">({student.name})</span>
            </div>
          )}

          {/* Volume Control with Popover Slider */}
          <div className="relative">
            <button
              onClick={() => setShowVolumePopup(prev => !prev)}
              title={isMuted ? 'เปิดเสียง' : 'ระดับเสียง'}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                  : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {showVolumePopup && (
              <div className="absolute top-full right-0 mt-2 p-3.5 bg-white border border-pink-100 rounded-2xl shadow-xl z-50 w-44">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-2">
                  <span>ระดับเสียง</span>
                  <span className="font-mono text-rose-600 font-bold">
                    {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-100 rounded-lg"
                />
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={handleToggleSound}
                    className="text-[10px] font-bold text-slate-500 hover:text-rose-600"
                  >
                    {isMuted ? 'เปิดเสียง' : 'ปิดเสียงทั้งหมด'}
                  </button>
                  <button
                    onClick={() => setShowVolumePopup(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-700"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            )}
          </div>

          {currentStage !== 'LANDING' && (
            <button
              onClick={onResetToLanding}
              title="กลับหน้าหลัก"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Slim Progress Bar */}
      {currentStage !== 'LANDING' && (
        <div className="w-full bg-slate-100 h-1 md:hidden mt-2 -mb-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-rose-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </header>
  );
};
