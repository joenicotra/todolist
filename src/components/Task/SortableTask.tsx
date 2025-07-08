import React from 'react';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from './Task';

export interface SortableTaskProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onUpdate?: ((id: string, updates: { title?: string; notes?: string }) => void) | undefined;
  notes?: string | undefined;
}

export const SortableTask: React.FC<SortableTaskProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task {...props} />
    </div>
  );
};