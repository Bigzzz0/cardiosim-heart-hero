import { ASSETS } from '../constants/assets';

/** Presentation-only assets selected from the user-supplied packs. */
export const suppliedArt = {
  hospitalMonitor: ASSETS.props.hospitalMonitor,
  equipmentCart: ASSETS.props.equipmentCart,
} as const;
