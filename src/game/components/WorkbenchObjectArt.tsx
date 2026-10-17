import React from 'react';
import type { WorkbenchObject } from '../types';

/** Small reusable prop drawings; labels and clinical data are supplied by config. */
export function WorkbenchObjectArt({visual}:{visual:NonNullable<WorkbenchObject['visual']>}) {
 return <svg className="workbench-prop-art" viewBox="0 0 120 64" aria-hidden="true">
  {visual==='needle' && <><path d="M10 33h65" stroke="#7a97a9" strokeWidth="3"/><path d="M11 32h62" stroke="#edf8ff"/><path d="M72 24h25v17H72z" fill="#b8dde0" stroke="#6a9baf" strokeWidth="2"/><rect x="94" y="19" width="13" height="27" rx="4" fill="#81b9cc" stroke="#54849c" strokeWidth="2"/><path d="M78 27v11m7-11v11" stroke="#e9faff" strokeWidth="2"/></>}
  {visual==='pad' && <><path d="M27 8l65 5-4 43-66-5z" fill="#fffdf7" stroke="#85a8bd" strokeWidth="2"/><path d="M30 15l54 4m-57 25 54 4" stroke="#bdd8e8" strokeWidth="3"/><path d="M53 22h15v18H53z" fill="#dcecf6"/><path d="M57 26l7 7-7 5" fill="none" stroke="#7ba6be" strokeWidth="2"/></>}
  {visual==='wristband' && <><path d="M12 21h94v23H12z" fill="#e1f0f7" stroke="#88adbf" strokeWidth="2"/><rect x="35" y="16" width="49" height="32" rx="5" fill="#fffdf7" stroke="#88adbf" strokeWidth="2"/><path d="M43 25h30m-30 6h23m-23 7h28" stroke="#a2bbc9" strokeWidth="2"/>{[16,23,30,91,98].map(x=><circle key={x} cx={x} cy="32" r="1.5" fill="#7e9db0"/>)}</>}
  {visual==='label' && <><path d="M15 12h84l8 10v29H15z" fill="#fffdf3" stroke="#89a6b8" strokeWidth="2"/><path d="M15 12h9v39h-9" fill="#add4e8"/><path d="M34 23h56m-56 10h43m-43 10h50" stroke="#97b1c0" strokeWidth="2"/></>}
 </svg>;
}
