import React from 'react';
import { ASSETS } from '../../constants/assets';
import './supplied-documents.css';

/** Supplied blank stationery; all content and controls remain HTML. */
export function DocumentArt({ kind = 'worksheet' }: { kind?: 'worksheet' | 'order' }) {
  return <img className={`document-art document-art-${kind}`} src={kind === 'order' ? ASSETS.handover.ehrRecordFolder : ASSETS.handover.clipboardWithPen} alt="" aria-hidden="true" draggable={false}/>;
}
