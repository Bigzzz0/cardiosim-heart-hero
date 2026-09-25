import React from 'react';
import { Check, ClipboardList, HeartPulse, Radio, RotateCcw } from 'lucide-react';
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
  return <div className={`result-card ${gradable?'':'result-unscored'}`}><div className="result-badge"><Check size={20}/></div><strong className="result-success">MISSION COMPLETE · {gradable?'DEMO SCORE':'PRACTICE RUN'}</strong><div className="result-vitals"><span>HR <b>{formatVital(vitals.hr)}</b></span><span>BP <b>{formatVital(vitals.bpSystolic)}/{formatVital(vitals.bpDiastolic)}</b></span><span>RR <b>{formatVital(vitals.rr)}</b></span><span>SpO₂ <b>{formatVital(vitals.spo2,'%')}</b></span></div><div className="result-case-data"><span><Radio size={13}/> ECG: {findings.some(entry=>entry.id==='ecg')?'V1–V6 placed · waveform not verified':'not recorded'}</span><span><ClipboardList size={13}/> Patient Chart: {findings.length} findings</span><span><HeartPulse size={13}/> Patient state: {patientCondition}</span></div><div className="result-metrics">{gradable&&<div><span>DEMO SCORE</span><b>{score}</b></div>}<div><span>TIME</span><b>{timeLabel}</b></div></div><div className="result-metrics compact"><div><span>ATTEMPTS</span><b>{attempts}</b></div><div><span>RETRIES</span><b>{mistakes}</b></div><div><span>HINTS</span><b>{hints}</b></div></div><small>{clinicalStatus}</small><div className="result-actions"><button className="restart-button" onClick={onRestart}><RotateCcw size={14}/> เล่นซ้ำ</button>{onPostTest&&<button className="primary result-posttest" onClick={onPostTest}>ไปทำ Post-test <span aria-hidden="true">›</span></button>}</div></div>;
}
