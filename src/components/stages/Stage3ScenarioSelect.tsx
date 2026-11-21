import React from 'react';
import { ArrowRight, ClipboardList, HeartPulse } from 'lucide-react';
import { clinicalAudio } from '../../services/clinicalAudioEngine';
import { IllustratedButton } from '../ui/IllustratedButton';
import { ASSETS } from '../../constants/assets';
import '../../illustrated-entry.css';

interface Stage3ScenarioSelectProps { onSelectScenario: (scenarioId: string) => void; }
const scenarios = [
  { id: 'case-01', number: 1, status: 'เคสหลัก', title: 'หัวใจล้มเหลวกำเริบร่วมกับภาวะน้ำเกิน', patient: 'หญิง 65 ปี · Chronic Heart Failure, Hypertension', description: 'ผู้ป่วยเหนื่อยหอบ นอนราบไม่ได้ น้ำหนักเพิ่มและขาบวม ฝึกประเมินและดูแลเมื่ออาการเปลี่ยนแปลง', skills: 'ตรวจร่างกาย · ECG · ให้ยา · บันทึก I/O', note: 'สถานการณ์สาธิต พร้อมระบบประเมินผล' },
  { id: 'case-02', number: 2, status: 'เคสทางเลือก', title: 'AF with RVR ร่วมกับภาวะหัวใจล้มเหลวกำเริบ', patient: 'ชาย 68 ปี · Heart Failure, Hypertension', description: 'ผู้ป่วยใจสั่น เหนื่อยหอบ นอนราบไม่ได้ 2 ชั่วโมงก่อนมาโรงพยาบาล ฝึกประเมินผู้ป่วยและช่วยชีวิตเมื่อคลำชีพจรไม่ได้', skills: 'ประเมินผู้ป่วย · ความปลอดภัยของยา · I/O · CPR และ EKG', note: 'รอบฝึกบันทึกคำตอบ' },
];
export const Stage3ScenarioSelect: React.FC<Stage3ScenarioSelectProps> = ({ onSelectScenario }) => (
  <section className="illustrated-scenarios" aria-labelledby="scenario-heading">
    <div className="illustrated-case-board">
      <img className="illustrated-case-brand" src={ASSETS.ui.logo} alt="CardioSim" />
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
