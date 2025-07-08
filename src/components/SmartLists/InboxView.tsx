import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectInboxTasks } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const InboxView: React.FC = () => {
  const inboxTasks = useAppSelector(selectInboxTasks);
  const areas = useAppSelector(state => state.areas.byId);
  const projects = useAppSelector(state => state.projects.byId);
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();
  
  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  const groupedTasks = inboxTasks.reduce((groups, task) => {
    const key = task.project_id || task.area_id || 'unorganized';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(task);
    return groups;
  }, {} as Record<string, typeof inboxTasks>);

  return (
    <div className="space-y-6">
      {/* Unorganized tasks */}
      {groupedTasks.unorganized && (
        <TaskGroup
          title="Inbox"
          tasks={groupedTasks.unorganized}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
        />
      )}

      {/* Tasks grouped by project/area */}
      {Object.entries(groupedTasks)
        .filter(([key]) => key !== 'unorganized')
        .map(([groupKey, tasks]) => {
          // Get the actual name for the group
          const project = projects[groupKey];
          const area = areas[groupKey];
          const groupName = project?.name || area?.name || groupKey;
          
          return (
            <TaskGroup
              key={groupKey}
              title={groupName}
              tasks={tasks}
              onToggleTask={handleTaskToggle}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              enableInlineCreation={true}
            />
          );
        })}

      {inboxTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            Your inbox is empty
          </h2>
          <p className="text-sm text-gray-500">
            New tasks without due dates will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default InboxView;