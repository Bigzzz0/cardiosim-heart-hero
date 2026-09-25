import React, { useEffect, useRef } from 'react';
import { Check, Droplets, Syringe } from 'lucide-react';
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
  const onTarget = Math.abs(amount - interaction.targetAmount) <= interaction.accuracyWindow;
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
        <span className="ampoule-cap"/><span className="ampoule-neck"/><span className="ampoule-body"><i/><b>AMP</b></span>
        <small>{placed ? 'แตะ ampoule แล้ว' : 'วางที่ ampoule'}</small>
      </button>
      {!placed ? <button type="button" className="syringe-tool-token" onPointerDown={event => onStartDrag(stepId, event)} onClick={() => onPlaceTool(stepId, interaction.targetId)} disabled={confirmed} aria-label="ลาก syringe ไปแตะ ampoule หรือแตะเพื่อวาง">
        <Syringe size={26}/><b>{equipmentLabel}</b><small>กดค้างแล้วลาก</small>
      </button> : <div className="syringe-instrument" aria-label="กระบอกฉีดยาสำหรับดึงยา">
        <span className="syringe-needle" aria-hidden="true"/><span className="syringe-hub" aria-hidden="true"/>
        <div className="syringe-barrel">
          <div className="syringe-liquid" style={{ width: `${Math.min(100, amount / interaction.scaleMax * 100)}%` }}/>
          <div className="syringe-ticks" aria-hidden="true">{ticks.map(tick => <span key={tick} className={tick % 1 === 0 ? 'major' : ''} style={{ left: `${tick / interaction.scaleMax * 100}%` }}>{tick % 1 === 0 ? <i>{tick.toFixed(0)}</i> : null}</span>)}</div>
          <span className="syringe-target-mark" data-syringe-target-mark="true" style={{ left: `${interaction.targetAmount / interaction.scaleMax * 100}%` }} aria-label={`เป้าหมาย ${interaction.targetAmount} ${interaction.unit}`}/>
          <input className="syringe-plunger" data-syringe-plunger="true" type="range" min="0" max={interaction.scaleMax} step="0.1" value={amount} onChange={event => onSetAmount(stepId, Number(event.currentTarget.value))} disabled={confirmed} aria-label="ลากแกน syringe เพื่อดึงยา" aria-valuetext={`${amount.toFixed(1)} ${interaction.unit}`}/>
        </div>
        <span className="syringe-thumb-rest" aria-hidden="true"/>
      </div>}
    </div>
    {placed && <div className={`syringe-readout ${onTarget ? 'on-target' : ''}`} aria-live="polite">
      <span className="syringe-volume"><Droplets size={17}/><b>{amount.toFixed(1)}</b><small>{interaction.unit}</small></span>
      <span className="syringe-volume-status">{onTarget ? <><Check size={15}/> ปริมาณตรงเป้าหมาย</> : `เป้าหมาย ${interaction.targetAmount.toFixed(1)} ${interaction.unit}`}</span>
      <button type="button" className="syringe-confirm" onClick={() => onComplete(stepId)} disabled={confirmed}><Check size={16}/> ยืนยันปริมาณยา</button>
    </div>}
  </div>;
}
