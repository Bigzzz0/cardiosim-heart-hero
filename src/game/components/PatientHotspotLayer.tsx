import React, { useEffect, useState } from 'react';
import type { Hotspot, MedicalTool, Point } from '../types';

interface PositionedHotspot extends Hotspot { left: number; top: number; width: number; height: number }
interface PatientHotspotLayerProps {
  hotspots: readonly Hotspot[];
  active: boolean;
  dragging: boolean;
  debug: boolean;
  tutorialTargetId?: string;
  selectedTool?: MedicalTool;
  onActivate: (point: Point) => void;
}

export function PatientHotspotLayer({ hotspots, active, dragging, debug, tutorialTargetId, selectedTool, onActivate }: PatientHotspotLayerProps) {
  const [positions, setPositions] = useState<PositionedHotspot[]>([]);

  useEffect(() => {
    const stage = document.querySelector<HTMLElement>('.room-stage');
    if (!stage) return;
    let observedCanvas: HTMLCanvasElement | null = null;
    const update = () => {
      const canvas = stage.querySelector<HTMLCanvasElement>('.phaser-host canvas');
      if (canvas && canvas !== observedCanvas) {
        observedCanvas = canvas;
        resizeObserver.observe(canvas);
      }
      if (!canvas) return;
      const view = stage.dataset.worldView;
      if (!view) return;
      let world: { x: number; y: number; width: number; height: number };
      try { world = JSON.parse(view) as typeof world; }
      catch { return; }
      if (![world.x, world.y, world.width, world.height].every(Number.isFinite)) return;
      const stageBounds = stage.getBoundingClientRect();
      const canvasBounds = canvas.getBoundingClientRect();
      if (!world.width || !world.height || !canvasBounds.width || !canvasBounds.height) return;
      const scaleX = canvasBounds.width / world.width;
      const scaleY = canvasBounds.height / world.height;
      setPositions(hotspots.map(hotspot => ({
        ...hotspot,
        left: canvasBounds.left - stageBounds.left + (hotspot.x - world.x) * scaleX,
        top: canvasBounds.top - stageBounds.top + (hotspot.y - world.y) * scaleY,
      width: Math.max(44, hotspot.radius * 2 * scaleX),
      height: Math.max(44, hotspot.radius * 2 * scaleY),
      })));
    };
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(stage);
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(stage, { attributes: true, attributeFilter: ['data-world-view'], childList: true, subtree: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [hotspots]);

  if (!active) return null;
  return <div className={`hotspot-control-layer ${dragging ? 'is-dragging' : ''}`} aria-label="จุดตรวจผู้ป่วย">
    {positions.map(hotspot => <button
      key={hotspot.id}
      type="button"
      className={`hotspot-control ${tutorialTargetId === hotspot.id ? 'tutorial-target' : ''} ${debug ? 'debug-target' : ''}`}
      data-patient-hotspot={hotspot.id}
      data-label={hotspot.label}
      style={{ left: hotspot.left, top: hotspot.top, width: hotspot.width, height: hotspot.height }}
      aria-label={`${hotspot.label}${selectedTool ? ` · ใช้ ${selectedTool.name}` : ' · เลือกเครื่องมือก่อน'}`}
      title={selectedTool ? `ใช้ ${selectedTool.name} ที่ ${hotspot.label}` : `จุดตรวจ ${hotspot.label}`}
      onClick={() => onActivate({ x: hotspot.x, y: hotspot.y })}
    />)}
  </div>;
}
