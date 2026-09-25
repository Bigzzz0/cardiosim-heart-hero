import type { GameCase } from '../types';
import { case02 } from './case02';
import { verticalSlice } from './verticalSlice';

export const caseRegistry: readonly GameCase[] = [verticalSlice, case02];
export const getGameCase = (caseId: string | null): GameCase => caseRegistry.find(gameCase => gameCase.scenarios.some(scenario => scenario.enabled && scenario.id === caseId)) ?? verticalSlice;
