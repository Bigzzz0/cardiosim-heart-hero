import React, { useEffect, useRef } from 'react';
import { Check, Droplets, Minus, Plus, Syringe } from 'lucide-react';
import type { ActivityStepInteraction, ActivityStepProgress } from '../types';

interface SyringeWithdrawalMinigameProps {
  stepId: string;
  equipmentLabel: string;
  interaction: ActivityStepInteraction;
  progress?: ActivityStepProgress;
  confirmed: boolean;
  onStartDrag: (stepId: string, event: React.PointerEvent<HTMLButtonElement>) => void;
  onPlaceTool: (stepId: string, targetId: string) => void;
  onSetAmount: (stepId: string, amount: number) => void;
  onComplete: (stepId: string) => void;
}

export function SyringeWithdrawalMinigame({ stepId, equipmentLabel, interaction, progress, confirmed, onStartDrag, onPlaceTool, onSetAmount, onComplete }: SyringeWithdrawalMinigameProps) {
  const minigameRef = useRef<HTMLDivElement>(null);
  const placed = progress?.toolPlaced ?? false;
  const amount = progress?.amount ?? 0;
  const pull = useRef<{id:number;x:number;amount:number;width:number} | null>(null);
  const ratio = Math.min(1,amount / interaction.scaleMax);
  const adjust = (value:number) => onSetAmount(stepId,Math.round(Math.max(0,Math.min(interaction.scaleMax,value))*10)/10);
  const beginPull = (event:React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0 || confirmed) return;
    event.preventDefault(); event.stopPropagation();
    const width = event.currentTarget.closest('.syringe-instrument')?.getBoundingClientRect().width ?? 1;
    pull.current = {id:event.pointerId,x:event.clientX,amount,width:width*.26};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const movePull = (event:React.PointerEvent<HTMLButtonElement>) => {
    const start = pull.current;
    if (!start || start.id !== event.pointerId) return;
    event.stopPropagation(); adjust(start.amount+(event.clientX-start.x)/start.width*interaction.scaleMax);
  };
  const endPull = (event:React.PointerEvent<HTMLButtonElement>,cancel=false) => {
    const start=pull.current;if (!start || start.id!==event.pointerId) return;
    if(cancel) adjust(start.amount);
    pull.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const ticks = Array.from({ length: Math.round(interaction.scaleMax * 2) + 1 }, (_, index) => index / 2);
  useEffect(() => {
    if (window.innerWidth > 760) return;
    const element = minigameRef.current;
    if (!element) return;
    const bounds = element.getBoundingClientRect();
    if (bounds.bottom > window.innerHeight - 68 || bounds.top < 70) {
      element.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }
  }, [stepId, placed]);

  return <div ref={minigameRef} className={`syringe-minigame ${placed ? 'is-placed' : ''}`} data-syringe-step={stepId}>
    <div className="syringe-game-instruction"><span className="syringe-game-icon"><Syringe size={19}/></span><span><b>ดูดยาตาม Order</b><small>ลาก syringe ไปแตะ ampoule แล้วดึงแกนตามสเกล</small></span></div>
    <div className="syringe-workbench">
      <button type="button" className={`ampoule-drop-target ${placed ? 'contacted' : ''}`} data-syringe-ampoule-target={interaction.targetId} onClick={() => onPlaceTool(stepId, interaction.targetId)} disabled={confirmed} aria-label="วาง syringe ที่ ampoule">
        <img className="ampoule-art" src="/game/bedside/ampoule.webp" alt="" draggable="false"/>
        <small>{placed ? 'แตะ ampoule แล้ว' : 'วางที่ ampoule'}</small>
      </button>
      {!placed ? <button type="button" className="syringe-tool-token" onPointerDown={event => onStartDrag(stepId, event)} onClick={() => onPlaceTool(stepId, interaction.targetId)} disabled={confirmed} aria-label="ลาก syringe ไปแตะ ampoule หรือแตะเพื่อวาง">
        <Syringe size={26}/><b>{equipmentLabel}</b><small>กดค้างแล้วลาก</small>
      </button> : <div className="syringe-instrument" aria-label="กระบอกฉีดยาสำหรับดึงยา">
        <img className="syringe-body-art" src="/game/bedside/syringe-body.webp" alt="" draggable="false"/>
        <div className="syringe-liquid-volume" style={{width:`${ratio*26}%`}} aria-hidden="true"/>
        <img className="syringe-plunger-art" src="/game/bedside/syringe-plunger.webp" alt="" draggable="false" style={{left:`${32+ratio*26}%`}}/>
        <div className="syringe-scale" aria-hidden="true">{ticks.map(tick=><span key={tick} style={{left:`${tick/interaction.scaleMax*100}%`}}>{Number.isInteger(tick)?tick:''}</span>)}</div>
        <button type="button" role="slider" className="syringe-direct-grip" data-syringe-plunger="true" aria-label="ลากแกน syringe เพื่อดึงยา" aria-valuemin={0} aria-valuemax={interaction.scaleMax} aria-valuenow={amount} aria-valuetext={`${amount.toFixed(1)} ${interaction.unit}`} style={{left:`${72+ratio*26}%`}} onPointerDown={beginPull} onPointerMove={movePull} onPointerUp={event=>endPull(event)} onPointerCancel={event=>endPull(event,true)} onLostPointerCapture={()=>{pull.current=null;}} onKeyDown={event=>{const delta=event.key==='ArrowRight'||event.key==='ArrowUp' ? .1 : event.key==='ArrowLeft'||event.key==='ArrowDown'?-.1:0;if(delta){event.preventDefault();adjust(amount+delta);}else if(event.key==='Home'||event.key==='End'){event.preventDefault();adjust(event.key==='Home'?0:interaction.scaleMax);}}} disabled={confirmed}><span className="grip-dots" aria-hidden="true">⠿</span></button>
      </div>}
    </div>
    {placed && <div className="syringe-readout" aria-live="polite">
      <span className="syringe-volume"><Droplets size={17}/><b>{amount.toFixed(1)}</b><small>{interaction.unit}</small></span>
      <span className="syringe-volume-status">{`Order ${interaction.targetAmount.toFixed(1)} ${interaction.unit} · ยืนยันเพื่อตรวจ`}</span>
      <div className="syringe-adjust"><button type="button" aria-label="ลดปริมาณยา 0.1 mL" onClick={()=>adjust(amount-.1)} disabled={confirmed||amount<=0}><Minus size={18}/></button><span>จับแกนแล้วดึง · หรือใช้ปุ่ม</span><button type="button" aria-label="เพิ่มปริมาณยา 0.1 mL" onClick={()=>adjust(amount+.1)} disabled={confirmed||amount>=interaction.scaleMax}><Plus size={18}/></button></div>
      <button type="button" className="syringe-confirm" onClick={() => onComplete(stepId)} disabled={confirmed}><Check size={16}/> ยืนยันปริมาณยา</button>
    </div>}
  </div>;
}
