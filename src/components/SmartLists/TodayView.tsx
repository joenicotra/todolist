import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectTodayTasks, selectOverdueTasks } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const TodayView: React.FC = () => {
  const todayTasks = useAppSelector(selectTodayTasks);
  const overdueTasks = useAppSelector(selectOverdueTasks);
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();
  
  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  const totalTasks = todayTasks.length + overdueTasks.length;

  return (
    <div className="space-y-6">
      {/* Header with today's date */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Today</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        {totalTasks > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {totalTasks} task{totalTasks !== 1 ? 's' : ''} due today
          </p>
        )}
      </div>

      {/* Overdue tasks */}
      {overdueTasks.length > 0 && (
        <TaskGroup
          title={`Overdue (${overdueTasks.length})`}
          tasks={overdueTasks}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
        />
      )}

      {/* Today's tasks */}
      {todayTasks.length > 0 && (
        <TaskGroup
          title={`Today (${todayTasks.length})`}
          tasks={todayTasks}
          onToggleTask={handleTaskToggle}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
        />
      )}

      {/* This Evening section placeholder */}
      <TaskGroup
        title="This Evening"
        tasks={[]}
        onToggleTask={handleToggleTask}
        onUpdateTask={handleUpdateTask}
        onCreateTask={handleCreateTask}
        enableInlineCreation={true}
      />

      {totalTasks === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No tasks for today
          </h2>
          <p className="text-sm text-gray-500">
            Enjoy your day! Tasks with today's date will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default TodayView;