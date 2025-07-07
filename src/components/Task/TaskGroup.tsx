import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Task } from './Task';

interface TaskData {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

interface TaskGroupProps {
  title: string;
  tasks: TaskData[];
  onToggleTask: (id: string) => void;
  showMoreButton?: boolean;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({ 
  title, 
  tasks, 
  onToggleTask, 
  showMoreButton = true 
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 py-2 mb-2">
        <h3 className="text-sm font-medium text-blue-600">{title}</h3>
        {showMoreButton && (
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>
      <div className="space-y-0">
        {tasks.map((task) => (
          <Task
            key={task.id}
            id={task.id}
            title={task.title}
            completed={task.completed}
            onToggle={onToggleTask}
            notes={task.notes}
          />
        ))}
      </div>
    </div>
  );
};