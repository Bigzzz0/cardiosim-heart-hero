import React, { useId } from 'react';

/** Illustrated enamel housing. Live readings remain accessible HTML above it. */
export function MonitorHousing({ emergency }: { emergency: boolean }) {
  const id = useId().replace(/:/g, '');
  return <>
    <svg className="monitor-housing" viewBox="0 0 240 360" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-case`} x2=".8" y2="1"><stop stopColor="#ffffff"/><stop offset=".48" stopColor="#e1edf2"/><stop offset="1" stopColor="#adbeca"/></linearGradient>
        <linearGradient id={`${id}-edge`} x2="0" y2="1"><stop stopColor="#9db5c5"/><stop offset=".5" stopColor="#edf5f9"/><stop offset="1" stopColor="#738f9f"/></linearGradient>
      </defs>
      <rect x="5" y="8" width="232" height="350" rx="27" fill="#3c5361" opacity=".3"/>
      <rect x="2" y="2" width="232" height="350" rx="26" fill={`url(#${id}-case)`} stroke="#587387" strokeWidth="2.5"/>
      <path d="M24 10H210Q226 10 226 26" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>
      <rect x="12" y="15" width="212" height="302" rx="17" fill="#0d2029" stroke={`url(#${id}-edge)`} strokeWidth="3"/>
      <path d="M25 23H208" stroke="#c9e7ee" opacity=".16" strokeLinecap="round"/>
      <rect x="93" y="5" width="50" height="5" rx="2.5" fill={emergency?'#e87d69':'#7bb8ba'}/>
      {[29,36,43,50,57].map(x=><path key={x} d={`M${x} 332v7`} stroke="#839eae" strokeWidth="2" strokeLinecap="round"/>)}
      <rect x="81" y="330" width="49" height="10" rx="4" fill="#a3b8c5" stroke="#8aa2b2"/>
      <circle cx="155" cy="335" r="4" fill={emergency?'#e87d69':'#76bca3'}/>
      <circle cx="201" cy="335" r="10" fill="#dbe7ef" stroke="#8da6b7" strokeWidth="1.5"/>
      <path d="M201 329v5m-4-3a5 5 0 1 0 8 0" fill="none" stroke="#587e91" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <svg className="monitor-stand" viewBox="0 0 240 100" aria-hidden="true">
      <path d="M109 0v57l-48 18-5 7 64-12 64 12-5-7-48-18V0" fill="#c8dbe5" stroke="#6c8b9d" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M116 2v53m-49 22 50-14 52 14" fill="none" stroke="#f4fbff" strokeWidth="3"/>
      <path d="M119 69v17" stroke="#708b9d" strokeWidth="5"/>
      <g fill="#4b6473" stroke="#344e60" strokeWidth="2"><rect x="49" y="78" width="16" height="10" rx="4"/><rect x="175" y="78" width="16" height="10" rx="4"/><rect x="112" y="85" width="16" height="10" rx="4"/></g>
    </svg>
  </>;
}
