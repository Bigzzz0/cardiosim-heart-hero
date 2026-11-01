import type { Hotspot, Point, RoomPresentation } from './types';

/** All three PSD layers use this same crop; never trim them independently. */
export const suppliedPatientFrame = { left: 765, top: 354, width: 2397, height: 1806 };
const scale = 800 / suppliedPatientFrame.width;
// Register the illustrated face to the original head interaction area.
const left = 550 - (1560 - suppliedPatientFrame.left) * scale;
const top = 280 - (584 - suppliedPatientFrame.top) * scale;

export function suppliedPatientPoint(source: Point): Point {
  return { x: left + (source.x - suppliedPatientFrame.left) * scale, y: top + (source.y - suppliedPatientFrame.top) * scale };
}

export const suppliedPatientPresentation: RoomPresentation = {
  background: { x: 550, y: 410, width: 1800, height: 1012.5 },
  patient: { x: left + 400, y: top + suppliedPatientFrame.height * scale / 2, width: 800, height: suppliedPatientFrame.height * scale },
  camera: { center: { x: 600, y: 390 }, procedureCenter: { x: 600, y: 360 }, transitionCenter: { x: 600, y: 400 }, contextFocus: { point: { x: 550, y: 280 }, radius: 32 } },
};

// Source pixels in the original 3840x2160 PSD, before the shared crop.
export const suppliedPatientTargets: Record<string, Point & { radius: number }> = {
  head: { x: 1560, y: 584, radius: 32 },
  chest: { x: 1688, y: 924, radius: 32 },
  arm: { x: 1500, y: 912, radius: 24 },
  wrist: { x: 1836, y: 1132, radius: 17 },
  finger: { x: 1955, y: 1090, radius: 17 },
};

export function registerSuppliedPatientHotspots(hotspots: readonly Hotspot[]): Hotspot[] {
  return hotspots.map(hotspot => {
    const target = suppliedPatientTargets[hotspot.id];
    if (!target) throw new Error(`Missing supplied patient registration: ${hotspot.id}`);
    return { ...hotspot, ...suppliedPatientPoint(target), radius: target.radius };
  });
}
