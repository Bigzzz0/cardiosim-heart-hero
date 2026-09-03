import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  id,
  children,
  disabled = false,
  className = ''
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled
  });

  const style: React.CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative select-none touch-none transition-shadow ${
        isDragging ? 'opacity-80 scale-[1.02] shadow-2xl ring-2 ring-rose-400' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'} ${className}`}
      {...listeners}
      {...attributes}
    >
      <div className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
        <GripVertical className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
};
