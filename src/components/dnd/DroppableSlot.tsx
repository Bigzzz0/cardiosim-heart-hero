import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableSlotProps {
  id: string;
  title: string;
  priorityNumber?: number;
  children?: React.ReactNode;
  isFilled?: boolean;
  className?: string;
}

export const DroppableSlot: React.FC<DroppableSlotProps> = ({
  id,
  title,
  priorityNumber,
  children,
  isFilled = false,
  className = ''
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[90px] rounded-2xl border-2 transition-all p-3.5 flex flex-col justify-between ${
        isOver
          ? 'border-rose-400 bg-rose-50/80 shadow-md ring-2 ring-rose-300/60'
          : isFilled
          ? 'border-pink-200 bg-white shadow-sm'
          : 'border-dashed border-slate-300 bg-slate-50/60 hover:border-pink-300'
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {priorityNumber && (
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center font-mono border border-rose-200">
              {priorityNumber}
            </span>
          )}
          <span className="text-xs font-bold text-slate-700">{title}</span>
        </div>
        {isFilled && (
          <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 font-medium">
            วางแล้ว
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center">
        {children || (
          <div className="text-center py-3 text-xs text-slate-400 italic">
            ลากการ์ดข้อวินิจฉัยมาวางที่ช่องนี้
          </div>
        )}
      </div>
    </div>
  );
};
