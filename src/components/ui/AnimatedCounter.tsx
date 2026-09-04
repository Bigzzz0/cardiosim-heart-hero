import React, { useEffect, useState, useRef } from 'react';

export interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  formatter?: (val: number) => string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  durationMs = 800,
  formatter,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const startValueRef = useRef(value);
  const targetValueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (value === targetValueRef.current) return;

    startValueRef.current = displayValue;
    targetValueRef.current = value;
    startTimeRef.current = null;

    let animId: number;

    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);

      const current = startValueRef.current + (targetValueRef.current - startValueRef.current) * easedProgress;
      setDisplayValue(current);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValueRef.current);
      }
    };

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [value, durationMs]);

  const formatted = formatter
    ? formatter(displayValue)
    : Math.round(displayValue).toLocaleString();

  return (
    <span className={`inline-block tabular-nums font-mono ${className}`}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
