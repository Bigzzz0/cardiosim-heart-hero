import React from 'react';
import { Activity, FileQuestion, Monitor, ShieldAlert } from 'lucide-react';
import type { ActivityConfig } from '../types';
import { ActivityFields } from './ActivityFields';

interface ECGReviewConsoleProps {
  activity: ActivityConfig;
  responses: Readonly<Record<string, string>>;
  confirmed: boolean;
  onSetResponse: (id: string, value: string) => void;
}

export function ECGReviewConsole({ activity, responses, confirmed, onSetResponse }: ECGReviewConsoleProps) {
  const missing = activity.dataStatus === 'missing';
  return <section className={`activity-card ecg-review-console ${missing ? 'ecg-data-missing' : ''}`}>
    <div className="activity-head"><span>{activity.eyebrow}</span><b>{activity.title}</b></div>
    {activity.notice && <div className="activity-notice"><ShieldAlert size={15}/>{activity.notice}</div>}
    <div className="ecg-console-display" aria-label={missing ? 'ไม่มี ECG strip ในข้อมูล Case' : 'ข้อมูลจาก Patient Monitor'}>
      <div className="ecg-console-bezel"><Monitor size={17}/><span>ROOM MONITOR · REVIEW</span><i/></div>
      <div className="ecg-console-screen">
        {missing
          ? <div className="ecg-no-strip"><FileQuestion size={25}/><b>ไม่มี ECG strip ใน Case 2</b><span>ช่องนี้จะแสดงเฉพาะข้อมูลที่มีต้นทาง</span></div>
          : activity.rows?.map(row => <div className="ecg-readout" key={row.label}><span>{row.label}</span><b><Activity size={15}/>{row.value}</b></div>)}
      </div>
    </div>
    <div className="ecg-review-record"><b>บันทึกการทบทวน</b><ActivityFields activity={activity} responses={responses} confirmed={confirmed} onSetResponse={onSetResponse}/></div>
  </section>;
}
