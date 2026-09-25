import React from 'react';
import type { MedicalTool } from '../types';
import { toolIcons } from './gameIcons';

type MedicalToolTrayProps = {
  tools: readonly MedicalTool[];
  selectedId: string | null;
  dragging: boolean;
  interactive: boolean;
  tutorial?: { toolId: string; toolName: string; targetName: string };
  onPointerDown: (tool: MedicalTool, event: React.PointerEvent<HTMLButtonElement>) => void;
  onClick: (tool: MedicalTool, event: React.MouseEvent<HTMLButtonElement>) => void;
};

export function MedicalToolTray({ tools, selectedId, dragging, interactive, tutorial, onPointerDown, onClick }: MedicalToolTrayProps) {
  if (!tools.length) return null;
  return <div className={`toolbar tool-count-${tools.length} ${tutorial ? 'tutorial-active' : ''}`} role="group" aria-label="ถาดอุปกรณ์สำหรับตรวจผู้ป่วย">
    <div className="toolbar-guide"><b>ถาดอุปกรณ์</b><span>กดค้างเพื่อหยิบ · ลากไปยังผู้ป่วย</span></div>
    {tutorial && <div className="tool-tutorial-tip" id="tool-drag-tutorial" role="status" aria-live="polite">
      <b>ภารกิจแรก · ลองลงมือ</b>
      <span>กดค้าง “{tutorial.toolName}” แล้วลากไปที่ “{tutorial.targetName}”</span>
      <small>บนจอสัมผัส แตะเครื่องมือแล้วแตะจุดตรวจได้</small>
    </div>}
    {tools.map((tool,index)=>{const Icon=toolIcons[tool.icon];const active=selectedId===tool.id;const guided=tutorial?.toolId===tool.id;return <button key={tool.id} className={`${active?'selected':''} ${guided?'tutorial-tool':''}`} onPointerDown={event=>onPointerDown(tool,event)} onClick={event=>onClick(tool,event)} disabled={!interactive} aria-pressed={active} aria-describedby={guided&&tutorial?'tool-drag-tutorial':undefined} aria-label={`ลาก ${tool.name} ไปยังผู้ป่วย หรือแตะเลือกแล้วแตะจุดตรวจ`} title={`ลาก ${tool.name} ไปยังผู้ป่วย หรือแตะเลือกแล้วแตะจุดตรวจ`}>{tool.sprite?<img className="tool-art" src={tool.sprite} alt="" draggable="false"/>:<Icon size={24}/>}<span>{tool.name}</span><kbd>{index+1}</kbd>{dragging&&active&&<span className="tool-held-label">ถืออยู่</span>}</button>;})}
  </div>;
}
