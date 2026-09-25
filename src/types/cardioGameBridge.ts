import type { GameTelemetry, StudentProfile } from './game';

export const GAME_RETURN_KEY = 'cardiosim.game.return.v1';

export interface CardioGameReturn {
  student: StudentProfile;
  telemetry: GameTelemetry;
}

export function readGameReturn(): CardioGameReturn | null {
  try {
    const raw = sessionStorage.getItem(GAME_RETURN_KEY);
    if (!raw) return null;
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return null;
    const candidate = data as Partial<CardioGameReturn>;
    if (!candidate.student || typeof candidate.student.studentId !== 'string' || !candidate.telemetry || typeof candidate.telemetry !== 'object') return null;
    return candidate as CardioGameReturn;
  } catch {
    return null;
  }
}

export function writeGameReturn(value: CardioGameReturn): boolean {
  try {
    sessionStorage.setItem(GAME_RETURN_KEY, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
