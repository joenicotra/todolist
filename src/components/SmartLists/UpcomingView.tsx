import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectUpcomingTasksByDate } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const UpcomingView: React.FC = () => {
  const upcomingTasksByDate = useAppSelector(selectUpcomingTasksByDate);
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();

  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    if (dateString === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Tomorrow';
    } else if (date <= nextWeek) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const dates = Object.keys(upcomingTasksByDate);

  return (
    <div className="space-y-6">
      {dates.length > 0 ? (
        dates.map(date => {
          const tasksForDate = upcomingTasksByDate[date];
          if (!tasksForDate) return null;
          
          return (
            <TaskGroup
              key={date}
              title={formatDate(date)}
              tasks={tasksForDate}
              onToggleTask={handleTaskToggle}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              enableInlineCreation={true}
              enableBulkOperations={true}
            />
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No upcoming tasks
          </h2>
          <p className="text-sm text-gray-500">
            Tasks with future due dates will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingView;