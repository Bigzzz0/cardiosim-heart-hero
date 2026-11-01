import React, { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { StudentProfile } from '../../types/game';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { IllustratedButton } from '../ui/IllustratedButton';
import { ASSETS } from '../../constants/assets';
import '../../illustrated-entry.css';

interface Stage0LandingProps { onStartGame: (profile: StudentProfile) => void; }

export const Stage0Landing: React.FC<Stage0LandingProps> = ({ onStartGame }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const start = useRef<HTMLDivElement>(null);
  const openLogin = () => {
    clinicalAudio.playHeartBeep(880, 0.1);
    setShowLogin(true);
    requestAnimationFrame(() => heading.current?.focus());
  };
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!studentId.trim() || !name.trim()) return;
    clinicalAudio.playHeartBeep(880, 0.1);
    onStartGame({ studentId: studentId.trim(), name: name.trim(), institution: institution.trim() });
  };
  return (
    <section className="illustrated-entry" aria-label="CardioSim Heart Hero">
      {!showLogin ? (
        <div className="illustrated-cover">
          <h1 className="sr-only">CardioSim: Heart Hero Simulation</h1>
          <div className="illustrated-cover-scene">
            <img className="illustrated-cover-art" src={ASSETS.ui.cover} alt="CardioSim เกมจำลองการพยาบาลผู้ป่วยโรคหัวใจ" fetchPriority="high" />
            <div className="illustrated-cover-start" ref={start}>
              <IllustratedButton artwork="start" onClick={openLogin}>เริ่มเกม START</IllustratedButton>
            </div>
          </div>
          <p className="illustrated-cover-caption">ฝึกคิด ตัดสินใจ และดูแลผู้ป่วยในสถานการณ์จำลอง</p>
        </div>
      ) : (
        <div className="illustrated-login">
          <button className="illustrated-back" type="button" onClick={() => {
            setShowLogin(false);
            requestAnimationFrame(() => start.current?.querySelector('button')?.focus());
          }}><ArrowLeft size={18} aria-hidden="true" /> กลับหน้าปก</button>
          <div className="illustrated-login-art" aria-hidden="true" />
          <form className="illustrated-login-form" onSubmit={submit}>
            <span className="illustrated-eyebrow">พร้อมรับภารกิจหรือยัง?</span>
            <h1 ref={heading} tabIndex={-1}>เข้าสู่บทเรียน</h1>
            <p>กรอกข้อมูลผู้เรียนเพื่อบันทึกผลการเล่น</p>
            <label htmlFor="entry-student-id">รหัสนักศึกษา <span aria-hidden="true">*</span></label>
            <input id="entry-student-id" name="studentId" autoComplete="username" required maxLength={80} pattern=".*\S.*" value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="กรอกรหัสนักศึกษา" />
            <label htmlFor="entry-name">ชื่อ–นามสกุล <span aria-hidden="true">*</span></label>
            <input id="entry-name" name="name" autoComplete="name" required maxLength={160} pattern=".*\S.*" value={name} onChange={e => setName(e.target.value)} placeholder="กรอกชื่อ–นามสกุล" />
            <label htmlFor="entry-institution">สถาบันการศึกษา / ชั้นปี</label>
            <input id="entry-institution" name="institution" autoComplete="organization" maxLength={200} value={institution} onChange={e => setInstitution(e.target.value)} placeholder="เช่น คณะพยาบาลศาสตร์ ชั้นปีที่ 3" />
            <IllustratedButton type="submit">เข้าสู่บทเรียน</IllustratedButton>
            <small>เริ่มด้วยแบบทดสอบก่อนเรียน แล้วเลือกเคสผู้ป่วย</small>
          </form>
        </div>
      )}
    </section>
  );
};
