import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task } from './Task';

export interface SelectableTaskProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onUpdate?: ((id: string, updates: { title?: string; notes?: string }) => void) | undefined;
  notes?: string | undefined;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isSelectionMode: boolean;
}

export const SelectableTask: React.FC<SelectableTaskProps> = ({ 
  id, 
  title, 
  completed, 
  onToggle, 
  onUpdate, 
  notes, 
  isSelected,
  onSelect,
  isSelectionMode
}) => {
  const handleTaskClick = () => {
    if (isSelectionMode) {
      onSelect(id);
    }
  };

  if (isSelectionMode) {
    return (
      <div 
        className={`flex items-start gap-3 px-4 py-2 hover:bg-gray-50 group cursor-pointer ${
          isSelected ? 'bg-blue-50 border-l-2 border-blue-400' : ''
        }`}
        onClick={handleTaskClick}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
        >
          {isSelected ? (
            <CheckCircle2 size={16} className="text-blue-500" />
          ) : (
            <Circle size={16} />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className={`text-sm ${completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {title}
          </div>
          {notes && (
            <div className="text-xs text-gray-500 mt-1">
              {notes}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Task
      id={id}
      title={title}
      completed={completed}
      onToggle={onToggle}
      onUpdate={onUpdate}
      notes={notes}
    />
  );
};