import React from 'react';
import { ArrowRight, ClipboardList, HeartPulse } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { IllustratedButton } from '../ui/IllustratedButton';
import '../../illustrated-entry.css';

interface Stage3ScenarioSelectProps { onSelectScenario: (scenarioId: string) => void; }
const scenarios = [
  { id: 'case-01', number: 1, status: 'เคสหลัก', title: 'หัวใจล้มเหลวจากความดันโลหิตสูงวิกฤต', patient: 'หญิงไทย 39 ปี · HT, DM, Dyslipidemia', description: 'ผู้ป่วยหอบเหนื่อย แน่นหน้าอก และใจสั่น ฝึกประเมินอาการ จัดลำดับการพยาบาล และรับมือภาวะวิกฤต', skills: 'ตรวจร่างกาย · ECG · ให้ยา · บันทึก I/O', note: 'สถานการณ์สาธิต พร้อมระบบประเมินผล' },
  { id: 'case-02', number: 2, status: 'เคสทางเลือก', title: 'หัวใจล้มเหลวกำเริบและน้ำคั่งในปอด', patient: 'หญิงไทย 65 ปี · Chronic Heart Failure, HT, DM', description: 'ผู้ป่วยเหนื่อยมากขึ้น นอนราบไม่ได้ และน้ำหนักเพิ่ม ฝึกสำรวจข้อมูลและการดูแลผู้ป่วยจากเรื่องย่อเคส', skills: 'สำรวจผู้ป่วย · ฝึกใช้อุปกรณ์ · บันทึกข้อมูล', note: 'โหมดฝึกสำรวจ ไม่ให้คะแนนทางคลินิก' },
];
export const Stage3ScenarioSelect: React.FC<Stage3ScenarioSelectProps> = ({ onSelectScenario }) => (
  <section className="illustrated-scenarios" aria-labelledby="scenario-heading">
    <div className="illustrated-case-board">
      <img className="illustrated-case-brand" src="/game/medical-illustration/logo.webp" alt="CardioSim" />
      <h1 id="scenario-heading">เลือกเคสผู้ป่วย</h1>
      <div className="illustrated-case-grid">
        {scenarios.map(scenario => (
          <article key={scenario.id} className="illustrated-case-card">
            <div className="illustrated-case-meta"><span>CASE 0{scenario.number}</span><span>{scenario.status}</span></div>
            <HeartPulse className="illustrated-case-icon" size={36} aria-hidden="true" />
            <h2>{scenario.title}</h2>
            <p className="illustrated-case-patient">{scenario.patient}</p>
            <p>{scenario.description}</p>
            <p className="illustrated-case-skills"><ClipboardList size={18} aria-hidden="true" />{scenario.skills}</p>
            <small>{scenario.note}</small>
            <IllustratedButton onClick={() => { clinicalAudio.playHeartBeep(880, 0.1); onSelectScenario(scenario.id); }}>
              เริ่มเล่นสถานการณ์ที่ {scenario.number} <ArrowRight size={18} aria-hidden="true" />
            </IllustratedButton>
          </article>
        ))}
      </div>
    </div>
  </section>
);
