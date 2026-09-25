import React from 'react';
import { Activity, Bug, Clock3, Expand, Pause, Play, ShieldAlert, Siren, Volume2, VolumeX } from 'lucide-react';
import type { MissionDefinition } from '../types';

type GameHudProps = {
  caseId: string;
  missions: readonly MissionDefinition[];
  missionIndex: number;
  missionPhase: string;
  emergency: boolean;
  elapsedLabel: string;
  mistakeCount: number;
  audioEnabled: boolean;
  paused: boolean;
  debug: boolean;
  volume: number;
  onToggleAudio: () => void;
  onVolumeChange: (volume: number) => void;
  onTogglePause: () => void;
  onFullscreen: () => void;
};

export function GameHud(props: GameHudProps) {
  const {
    caseId,
    missions,
    missionIndex,
    missionPhase,
    emergency,
    elapsedLabel,
    mistakeCount,
    audioEnabled,
    paused,
    debug,
    volume,
    onToggleAudio,
    onVolumeChange,
    onTogglePause,
    onFullscreen,
  } = props;

  return <header className={`game-hud${emergency ? ' is-emergency' : ''}`}>
    <a className="brand" href="/game.html" aria-label={`CardioSim · ${caseId}`}>
      <span className="brand-mark"><Activity size={23}/></span>
      <span className="brand-name">cardio<span>sim</span></span>
      <small>{caseId}</small>
    </a>

    <div className="header-center">
      <span className="live-dot"/>
      <span className="hud-case">PATIENT CARE</span>
      <i/>
      <span key={missionIndex} className="hud-phase phase-enter" aria-live="polite">{missionPhase}</span>
      <div
        className="hud-steps"
        role="progressbar"
        aria-label="ความคืบหน้าภารกิจ"
        aria-valuemin={1}
        aria-valuemax={missions.length}
        aria-valuenow={missionIndex + 1}
        aria-valuetext={`${missionPhase} · ขั้น ${missionIndex + 1} จาก ${missions.length}`}
      >
        {missions.map((step, index) => <span
          key={step.id}
          className={index < missionIndex ? 'complete' : index === missionIndex ? 'current' : ''}
          title={step.title.replace('\n', ' ')}
        />)}
      </div>
      <span key={`count-${missionIndex}`} className="hud-step-count step-count-enter">
        {String(missionIndex + 1).padStart(2, '0')} / {String(missions.length).padStart(2, '0')}
      </span>
    </div>

    <div className="header-actions">
      {emergency && <span className="hud-emergency" role="status" aria-label="Emergency · ภาวะฉุกเฉิน" title="ภารกิจฉุกเฉิน">
        <Siren size={15}/><b>EMERGENCY</b>
      </span>}
      <span className="hud-clock"><Clock3 size={14}/>{elapsedLabel}</span>
      <span className="mistake-chip" title="จำนวนครั้งที่ลองผิด"><ShieldAlert size={13}/>{mistakeCount}</span>
      <button onClick={onToggleAudio} aria-label={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียง'} title={audioEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}>
        {audioEnabled ? <Volume2 size={17}/> : <VolumeX size={17}/>}
      </button>
      {audioEnabled && <input
        aria-label="ระดับเสียง"
        className="volume"
        type="range"
        min="0"
        max="1"
        step=".01"
        value={volume}
        onChange={event => onVolumeChange(Number(event.target.value))}
      />}
      <button onClick={onTogglePause} aria-label={paused ? 'เล่นต่อ' : 'พักเกม'} title={paused ? 'เล่นต่อ' : 'พักเกม'}>
        {paused ? <Play size={16}/> : <Pause size={16}/>}
      </button>
      <button onClick={onFullscreen} aria-label="เต็มจอ" title="เต็มจอ"><Expand size={17}/></button>
      {debug && <span className="debug-pill"><Bug size={13}/> DEBUG</span>}
    </div>
  </header>;
}
