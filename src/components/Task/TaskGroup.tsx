import React, { useState } from 'react';
import { MoreHorizontal, Check, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task as TaskComponent } from './Task';
import { SortableTask } from './SortableTask';
import { TaskCreator } from './TaskCreator';
import { SelectableTask } from './SelectableTask';
import { Task } from '../../types/core';

export interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onToggleTask: (id: string, currentStatus: 'active' | 'completed' | 'cancelled') => void;
  onUpdateTask?: (id: string, updates: { title?: string; notes?: string }) => void;
  onCreateTask?: (title: string, notes?: string) => void;
  onReorderTasks?: (reorderedTasks: Task[]) => void;
  onBulkComplete?: (taskIds: string[]) => void;
  onBulkDelete?: (taskIds: string[]) => void;
  showMoreButton?: boolean;
  enableDragAndDrop?: boolean;
  enableInlineCreation?: boolean;
  enableBulkOperations?: boolean;
}

export const TaskGroup: React.FC<TaskGroupProps> = ({ 
  title, 
  tasks, 
  onToggleTask, 
  onUpdateTask,
  onCreateTask,
  onReorderTasks,
  onBulkComplete,
  onBulkDelete,
  showMoreButton = true,
  enableDragAndDrop = false,
  enableInlineCreation = false,
  enableBulkOperations = false
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(task => task.id));
    }
  };

  const handleBulkComplete = () => {
    if (onBulkComplete && selectedTasks.length > 0) {
      onBulkComplete(selectedTasks);
      setSelectedTasks([]);
      setIsSelectionMode(false);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && selectedTasks.length > 0) {
      onBulkDelete(selectedTasks);
      setSelectedTasks([]);
      setIsSelectionMode(false);
    }
  };


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over?.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
        onReorderTasks?.(reorderedTasks);
      }
    }
  };

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between px-4 py-2 mb-2">
        <h3 className="text-sm font-medium text-blue-600">{title}</h3>
        <div className="flex items-center gap-2">
          {enableBulkOperations && (
            <button
              onClick={() => setIsSelectionMode(!isSelectionMode)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                isSelectionMode 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {isSelectionMode ? 'Cancel' : 'Select'}
            </button>
          )}
          {showMoreButton && (
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          )}
        </div>
      </div>
      {isSelectionMode && enableBulkOperations && (
        <div className="flex items-center justify-between px-4 py-2 mb-2 bg-gray-50 border-t border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {selectedTasks.length === tasks.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-xs text-gray-500">
              {selectedTasks.length} selected
            </span>
          </div>
          {selectedTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkComplete}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <Check size={12} />
                Complete
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <X size={12} />
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      <div className="space-y-0">
        {enableDragAndDrop && onReorderTasks ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
              {tasks.map((task) => (
                <SortableTask
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  completed={task.status === 'completed'}
                  onToggle={(id) => onToggleTask(id, task.status)}
                  onUpdate={onUpdateTask}
                  notes={task.notes}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <>
            {tasks.map((task) => {
              if (enableBulkOperations) {
                return (
                  <SelectableTask
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    completed={task.status === 'completed'}
                    onToggle={(id) => onToggleTask(id, task.status)}
                    onUpdate={onUpdateTask}
                    notes={task.notes}
                    isSelected={selectedTasks.includes(task.id)}
                    onSelect={handleTaskSelect}
                    isSelectionMode={isSelectionMode}
                  />
                );
              }
              return (
                <TaskComponent
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  completed={task.status === 'completed'}
                  onToggle={(id) => onToggleTask(id, task.status)}
                  onUpdate={onUpdateTask}
                  notes={task.notes}
                />
              );
            })}
          </>
        )}
        {enableInlineCreation && onCreateTask && (
          <TaskCreator
            onCreateTask={onCreateTask}
            placeholder={`Add a task to ${title}...`}
          />
        )}
      </div>
    </div>
  );
};