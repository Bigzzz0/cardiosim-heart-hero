import { Activity, BedDouble, ClipboardCheck, Hand, HeartPulse, MessageCircle, Pill, Radio, Stethoscope } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MedicalTool } from '../types';

export const toolIcons: Record<MedicalTool['icon'], LucideIcon> = {
  interview: MessageCircle,
  stethoscope: Stethoscope,
  bp: HeartPulse,
  spo2: Activity,
  hand: Hand,
};

export const decisionIcons: Record<'assessment' | 'position' | 'monitor' | 'medication' | 'care' | 'device', LucideIcon> = {
  assessment: ClipboardCheck,
  position: BedDouble,
  monitor: Activity,
  medication: Pill,
  care: HeartPulse,
  device: Radio,
};
