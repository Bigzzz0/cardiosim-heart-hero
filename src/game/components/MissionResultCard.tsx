import React from 'react';
import { Check, HeartPulse, Radio, RotateCcw } from 'lucide-react';
import type { ChartEntry, PatientState, VitalSigns } from '../types';

type MissionResultCardProps = {
  gradable: boolean;
  clinicalStatus: string;
  vitals: VitalSigns;
  findings: readonly ChartEntry[];
  patientCondition: PatientState['condition'];
  score: number;
  timeLabel: string;
  attempts: number;
  mistakes: number;
  hints: number;
  onRestart: () => void;
  onPostTest?: () => void;
};

function formatVital(value: number | null, unit = '') { return value === null ? '—' : `${Math.round(value)}${unit}`; }

export function MissionResultCard(props: MissionResultCardProps) {
  const { gradable, clinicalStatus, vitals, findings, patientCondition, score, timeLabel, attempts, mistakes, hints, onRestart, onPostTest } = props;
  return <div className={`result-card ${gradable ? '' : 'result-unscored'}`}>
    <div className="result-badge"><Check size={24}/></div>
    <strong className="result-success">ภารกิจดูแลผู้ป่วยเสร็จสิ้น</strong>
    <p className="result-status">{gradable ? 'คะแนนเดโม · รอตรวจรับรองทางคลินิก' : 'รอบฝึก · ไม่ให้คะแนนทางคลินิก'}</p>
    <div className="result-metrics">
      {gradable && <div><span>คะแนนเดโม</span><b>{score}<small>/100</small></b></div>}
      <div><span>เวลาที่ใช้</span><b>{timeLabel}</b></div>
    </div>
    <details className="result-details"><summary>ทบทวนการดูแล · {findings.length} รายการที่ค้นพบ</summary>
      <div className="result-metrics compact"><div><span>ครั้งที่ลอง</span><b>{attempts}</b></div><div><span>ครั้งที่ผิด</span><b>{mistakes}</b></div><div><span>คำใบ้</span><b>{hints}</b></div></div>
      <div className="result-vitals"><span>HR <b>{formatVital(vitals.hr)}</b></span><span>BP <b>{formatVital(vitals.bpSystolic)}/{formatVital(vitals.bpDiastolic)}</b></span><span>RR <b>{formatVital(vitals.rr)}</b></span><span>SpO₂ <b>{formatVital(vitals.spo2,'%')}</b></span></div>
      <div className="result-case-data"><span><Radio size={14}/> ECG: {findings.some(entry => entry.id === 'ecg') ? 'ติด V1–V6 แล้ว · คลื่นยังไม่รับรอง' : 'ยังไม่มีข้อมูล'}</span><span><HeartPulse size={14}/> สถานะในเดโม: {patientCondition}</span></div>
      <div className="result-findings">{findings.map(entry => <article key={entry.id}><b>{entry.title}</b><p>{entry.captureVitals && entry.vitals ? `HR ${formatVital(entry.vitals.hr)} · BP ${formatVital(entry.vitals.bpSystolic)}/${formatVital(entry.vitals.bpDiastolic)} · RR ${formatVital(entry.vitals.rr)} · SpO₂ ${formatVital(entry.vitals.spo2,'%')}` : entry.text}</p></article>)}</div>
    </details>
    <small className="result-clinical-status">{clinicalStatus}</small>
    <div className="result-actions"><button className="restart-button" onClick={onRestart}><RotateCcw size={16}/> เล่นซ้ำ</button>{onPostTest && <button className="primary result-posttest" onClick={onPostTest}>ไปทำ Post-test <span aria-hidden="true">›</span></button>}</div>
  </div>;
}
