import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskProps {
  id: string;
  title: string;
  completed: boolean;
  onToggle: (id: string) => void;
  notes?: string | undefined;
}

export const Task: React.FC<TaskProps> = ({ id, title, completed, onToggle, notes }) => {
  return (
    <div className="flex items-start gap-3 px-4 py-2 hover:bg-gray-50 group">
      <button
        onClick={() => onToggle(id)}
        className="flex-shrink-0 mt-0.5 text-gray-400 hover:text-blue-500 transition-colors"
      >
        {completed ? (
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
};