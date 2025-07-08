import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectAnytimeTasks } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const AnytimeView: React.FC = () => {
  const anytimeTasks = useAppSelector(selectAnytimeTasks);
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();

  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  return (
    <div className="space-y-6">
      {anytimeTasks.length > 0 ? (
        <TaskGroup
          title={`Anytime (${anytimeTasks.length})`}
          tasks={anytimeTasks}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
          enableDragAndDrop={true}
        />
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No tasks for anytime
          </h2>
          <p className="text-sm text-gray-500">
            Tasks with flexible due dates will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnytimeView;