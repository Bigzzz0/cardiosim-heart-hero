import { ASSETS } from '../constants/assets';
import source from './suppliedECGArt.json';
import type { ECGBoardLayout, ECGTarget } from './types';

/** Source-drawn positions, mapped onto an aspect-correct torso with no answer labels. */
export const suppliedECGLayout: ECGBoardLayout = {
  board: { x: 310, y: 105, width: 530, height: 420 },
  image: { x: 423, y: 150, width: 355, height: 355 * source.size[1] / source.size[0] },
  tray: { x: 432, y: 490, spacing: 57 },
};

const mobileLabels = [{ x: .1, y: .18 }, { x: .9, y: .18 }, { x: .1, y: .5 }, { x: .9, y: .5 }, { x: .1, y: .82 }, { x: .9, y: .82 }];
export const suppliedECGTargets: ECGTarget[] = ASSETS.ecg.chestLeads.map((lead, index, leads) => {
  const image = suppliedECGLayout.image;
  const closest = Math.min(...leads.filter(other => other.id !== lead.id).map(other => Math.hypot((lead.x - other.x) * image.width, (lead.y - other.y) * image.height)));
  return { id: lead.id, label: lead.id, x: image.x + lead.x * image.width, y: image.y + lead.y * image.height,
    snapRadius: Math.min(19, closest * .45), mobileLabel: mobileLabels[index],
    hint: 'ตำแหน่งจากภาพต้นฉบับเวชนิทัศน์ · รอผู้เชี่ยวชาญตรวจรับรอง', art: { electrode: lead.electrode, cable: lead.cable, color: lead.color } };
});

export const ecgPreparationArt = [
  { id: 'cotton', label: 'สำลี', sprite: ASSETS.ecg.tray.cottonJar },
  { id: 'alcohol', label: 'แอลกอฮอล์', sprite: ASSETS.ecg.tray.alcoholCleanser },
  { id: 'gel', label: 'เจล', sprite: ASSETS.ecg.tray.electrodeGel },
  { id: 'kit', label: 'ชุดอุปกรณ์', sprite: ASSETS.ecg.tray.firstAidBox },
] as const;
