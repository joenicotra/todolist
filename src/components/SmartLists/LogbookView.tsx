import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectCompletedTasks } from '../../store/selectors/taskSelectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

const LogbookView: React.FC = () => {
  const completedTasks = useAppSelector(selectCompletedTasks);
  const { handleToggleTask, handleUpdateTask } = useTaskActions();

  const handleTaskToggle = (taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    handleToggleTask(taskId, currentStatus);
  };

  // Group completed tasks by completion date
  const groupedTasks = completedTasks.reduce((groups, task) => {
    const completionDate = task.completed_at?.split('T')[0] || 'unknown';
    if (!groups[completionDate]) {
      groups[completionDate] = [];
    }
    groups[completionDate].push(task);
    return groups;
  }, {} as Record<string, typeof completedTasks>);

  const formatDate = (dateString: string) => {
    if (dateString === 'unknown') return 'Unknown Date';
    
    const date = new Date(dateString);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateString === today) {
      return 'Today';
    } else if (dateString === yesterdayStr) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const sortedDates = Object.keys(groupedTasks).sort().reverse(); // Most recent first

  return (
    <div className="space-y-6">
      {sortedDates.length > 0 ? (
        sortedDates.map(date => {
          const tasksForDate = groupedTasks[date];
          if (!tasksForDate) return null;
          
          return (
            <TaskGroup
              key={date}
              title={`${formatDate(date)} (${tasksForDate.length})`}
              tasks={tasksForDate}
              onToggleTask={handleTaskToggle}
              onUpdateTask={handleUpdateTask}
              enableBulkOperations={true}
            />
          );
        })
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No completed tasks
          </h2>
          <p className="text-sm text-gray-500">
            Your completed tasks will appear here for reference.
          </p>
        </div>
      )}
    </div>
  );
};

export default LogbookView;