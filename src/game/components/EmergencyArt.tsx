import React from 'react';
import { ASSETS } from '../../constants/assets';

/** Source illustration is decorative; the adjacent text announces the state. */
export function EmergencyArt() {
  return <span className="supplied-emergency-art" aria-hidden="true"><img src={ASSETS.handover.crisisAlertScene} alt="" draggable={false}/></span>;
}
