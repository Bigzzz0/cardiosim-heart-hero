import React from 'react';
import { ASSETS } from '../../constants/assets';

/** Supplied artwork beneath live, accessible readings. */
export function MonitorHousing({ emergency }: { emergency: boolean }) {
  return <img className="monitor-housing" src={ASSETS.handover.monitorWithArm} alt="" aria-hidden="true" data-alarm={emergency} draggable={false}/>;
}
