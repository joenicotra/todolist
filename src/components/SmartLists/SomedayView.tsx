import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectSomedayTasks } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const SomedayView: React.FC = () => {
  const somedayTasks = useAppSelector(selectSomedayTasks);
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();

  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  return (
    <div className="space-y-6">
      {somedayTasks.length > 0 ? (
        <TaskGroup
          title={`Someday (${somedayTasks.length})`}
          tasks={somedayTasks}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
          enableDragAndDrop={true}
        />
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No someday tasks
          </h2>
          <p className="text-sm text-gray-500">
            Tasks you might do someday will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default SomedayView;