import React from 'react';
import {ClipboardList,Lightbulb} from 'lucide-react';
import type { MedicalTool } from '../types';
import { toolIcons } from './gameIcons';
const compactLabels: Record<string,string> = {interview:'ซักประวัติ',stethoscope:'หัวฟัง',bp:'ความดัน',spo2:'SpO₂',hand:'ประเมิน'};

type MedicalToolTrayProps = {
  onOpenChart: () => void;
  onHint: () => void;
  findingsCount: number;
  tools: readonly MedicalTool[];
  selectedId: string | null;
  dragging: boolean;
  interactive: boolean;
  tutorial?: { toolId: string; toolName: string; targetName: string };
  onPointerDown: (tool: MedicalTool, event: React.PointerEvent<HTMLButtonElement>) => void;
  onClick: (tool: MedicalTool, event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function MedicalToolTray({ tools, selectedId, dragging, interactive, tutorial, onPointerDown, onClick, onOpenChart, onHint, findingsCount }: MedicalToolTrayProps) {
  const emptySlots = Math.max(0, 6 - tools.length - 2);
  return <div className={`toolbar tool-count-${tools.length} ${tutorial ? 'tutorial-active' : ''}`} role="group" aria-label="ถาดอุปกรณ์สำหรับตรวจผู้ป่วย">
    <div className="toolbar-guide"><b>ถาดอุปกรณ์</b><span>กดค้างเพื่อหยิบ · ลากไปยังผู้ป่วย</span></div>
    {tutorial && <div className="tool-tutorial-tip" id="tool-drag-tutorial" role="status" aria-live="polite">
      <b>ภารกิจแรก · ลองลงมือ</b>
      <span>กดค้าง “{tutorial.toolName}” แล้วลากไปที่ “{tutorial.targetName}”</span>
      <small>บนจอสัมผัส แตะเครื่องมือแล้วแตะจุดตรวจได้</small>
    </div>}
    {tools.map((tool,index)=>{const Icon=toolIcons[tool.icon];const active=selectedId===tool.id;const guided=tutorial?.toolId===tool.id;return <button key={tool.id} className={`${active?'selected':''} ${guided?'tutorial-tool':''}`} onPointerDown={event=>onPointerDown(tool,event)} onClick={event=>onClick(tool,event)} disabled={!interactive} aria-pressed={active} aria-describedby={guided&&tutorial?'tool-drag-tutorial':undefined} aria-label={`ลาก ${tool.name} ไปยังผู้ป่วย หรือแตะเลือกแล้วแตะจุดตรวจ`} title={`ลาก ${tool.name} ไปยังผู้ป่วย หรือแตะเลือกแล้วแตะจุดตรวจ`}><span className="tool-pad">{tool.sprite?<img className="tool-art" src={tool.sprite} alt="" draggable="false"/>:<Icon size={32}/>}</span><span className="tool-slot-label"><span className="tool-name-full">{tool.name}</span><span className="tool-name-compact">{compactLabels[tool.id]??tool.name}</span></span><kbd>{index+1}</kbd>{dragging&&active&&<span className="tool-held-label">ถืออยู่</span>}</button>;})}
    {Array.from({length:emptySlots},(_,index)=><div key={`empty-${index}`} className="empty-tool-slot" aria-hidden="true"><span className="tool-pad"/></div>)}
    <button type="button" className="tray-utility" onClick={onOpenChart} aria-label="เปิดแฟ้มผู้ป่วย"><span className="tool-pad"><ClipboardList size={32}/>{findingsCount>0&&<i className="tray-count">{findingsCount}</i>}</span><span className="tool-slot-label"><span className="tool-name-full">แฟ้มผู้ป่วย</span><span className="tool-name-compact">แฟ้ม</span></span></button>
    <button type="button" className="tray-utility" onClick={onHint} aria-label="ขอคำแนะนำ"><span className="tool-pad"><Lightbulb size={32}/></span><span className="tool-slot-label"><span className="tool-name-full">คำแนะนำ</span><span className="tool-name-compact">คำใบ้</span></span></button>
  </div>;
}
