import React from 'react';
import { Activity } from 'lucide-react';
import { CanvasEKG } from '../../components/ekg/CanvasEKG';
import type { GameCase, PatientState, VitalSigns } from '../types';

type PatientMonitorProps = {
  emergency: boolean;
  gradable: boolean;
  trace: NonNullable<GameCase['monitorTraces']>[PatientState['condition']] | undefined;
  vitals: VitalSigns;
};

function formatVital(value: number | null, unit = '') { return value === null ? '—' : `${Math.round(value)}${unit}`; }

export function PatientMonitor({ emergency, gradable, trace, vitals }: PatientMonitorProps) {
  return <div className={`monitor ${emergency?'monitor-alarm':''}`} aria-label="Patient Monitor"><div className="monitor-title"><Activity size={14}/> PATIENT MONITOR <span>{emergency?'ALARM':'LIVE'}</span></div><div className="wave-label">ECG · ภาพประกอบ</div>{trace?<CanvasEKG rhythm={trace.rhythm} heartRate={trace.heartRate} height={60} enableAudioBeep={false} className="monitor-trace"/>:<div className="monitor-no-trace">ECG · ไม่มี rhythm data ในเรื่องย่อ</div>}<div className="vital-large"><span>HR <small>bpm</small></span><b>{formatVital(vitals.hr)}</b></div><div className="vital-large oxygen"><span>SpO₂ <small>%</small></span><b>{formatVital(vitals.spo2, '%')}</b></div><div className="vital-small"><div><span>NIBP <small>mmHg</small></span><b>{formatVital(vitals.bpSystolic)}/{formatVital(vitals.bpDiastolic)}</b></div><div><span>RR <small>/min</small></span><b>{formatVital(vitals.rr)}</b></div></div><div className="monitor-footer">{gradable?'● ECG/vitals เป็น Case 1 demo':'● Case 2 ไม่มีค่าตัวเลขหรือ ECG strip'}</div></div>;
}
