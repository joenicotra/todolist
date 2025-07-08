import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const TrashView: React.FC = () => {
  const { byId: tasksById, allIds: taskIds } = useAppSelector(state => state.tasks);
  const { handleToggleTask, handleUpdateTask } = useTaskActions();

  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  // Get cancelled/deleted tasks
  const trashedTasks = taskIds
    .map(id => tasksById[id])
    .filter((task): task is NonNullable<typeof task> => 
      task !== undefined && task.status === 'cancelled'
    );

  return (
    <div className="space-y-6">
      {trashedTasks.length > 0 ? (
        <TaskGroup
          title={`Trash (${trashedTasks.length})`}
          tasks={trashedTasks}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          enableBulkOperations={true}
        />
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            Trash is empty
          </h2>
          <p className="text-sm text-gray-500">
            Deleted tasks will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default TrashView;