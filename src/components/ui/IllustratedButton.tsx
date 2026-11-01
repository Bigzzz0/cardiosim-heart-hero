import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> { artwork?: 'start' | 'case'; }

/** Accessible HTML button using the supplied idle, hover and pressed artwork. */
export const IllustratedButton: React.FC<Props> = ({ artwork = 'case', className = '', children, ...props }) => (
  <button {...props} className={`illustrated-button illustrated-button--${artwork} ${className}`}>
    <span className={artwork === 'start' ? 'sr-only' : ''}>{children}</span>
  </button>
);
