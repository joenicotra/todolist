import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Task } from '../../types/core';

// Base selectors
const selectTasksState = (state: RootState) => state.tasks;
// Future selectors for enhanced filtering
// const selectProjectsState = (state: RootState) => state.projects;
// const selectAreasState = (state: RootState) => state.areas;

// Get all active tasks
export const selectActiveTasks = createSelector(
  [selectTasksState],
  (tasksState) => {
    return tasksState.allIds
      .map(id => tasksState.byId[id])
      .filter((task): task is Task => task !== undefined && task.status === 'active');
  }
);

// Get all completed tasks
export const selectCompletedTasks = createSelector(
  [selectTasksState],
  (tasksState) => {
    return tasksState.allIds
      .map(id => tasksState.byId[id])
      .filter((task): task is Task => task !== undefined && task.status === 'completed');
  }
);

// Get tasks for Today view (due today or overdue)
export const selectTodayTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    const today = new Date().toISOString().split('T')[0];
    if (!today) return [];
    return activeTasks.filter(task => task.due_date === today);
  }
);

// Get overdue tasks
export const selectOverdueTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    const today = new Date().toISOString().split('T')[0];
    if (!today) return [];
    return activeTasks.filter(task => {
      if (!task.due_date) return false;
      return task.due_date < today;
    });
  }
);

// Get tasks for Upcoming view (due in the future)
export const selectUpcomingTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    const today = new Date().toISOString().split('T')[0];
    if (!today) return [];
    return activeTasks.filter(task => {
      if (!task.due_date) return false;
      return task.due_date > today;
    });
  }
);

// Get tasks for Inbox view (no due date)
export const selectInboxTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    return activeTasks.filter(task => !task.due_date);
  }
);

// Get tasks for Anytime view (has due date but not urgent)
export const selectAnytimeTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const oneWeekStr = oneWeekFromNow.toISOString().split('T')[0];
    if (!oneWeekStr) return [];
    
    return activeTasks.filter(task => {
      if (!task.due_date) return false;
      return task.due_date > oneWeekStr;
    });
  }
);

// Get tasks for Someday view (low priority, no urgent due date)
export const selectSomedayTasks = createSelector(
  [selectActiveTasks],
  (activeTasks) => {
    return activeTasks.filter(task => {
      // Tasks without due dates and priority 3, or far future dates
      if (!task.due_date && task.priority === 3) return true;
      
      if (task.due_date) {
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const oneMonthStr = oneMonthFromNow.toISOString().split('T')[0];
        if (!oneMonthStr) return false;
        return task.due_date > oneMonthStr && task.priority === 3;
      }
      
      return false;
    });
  }
);

// Get tasks by project ID
export const selectTasksByProject = createSelector(
  [selectActiveTasks, (_, projectId: string) => projectId],
  (activeTasks, projectId) => {
    return activeTasks.filter(task => task.project_id === projectId);
  }
);

// Get tasks by area ID
export const selectTasksByArea = createSelector(
  [selectActiveTasks, (_, areaId: string) => areaId],
  (activeTasks, areaId) => {
    return activeTasks.filter(task => task.area_id === areaId);
  }
);

// Get task counts for smart lists
export const selectTaskCounts = createSelector(
  [
    selectTodayTasks,
    selectOverdueTasks,
    selectUpcomingTasks,
    selectInboxTasks,
    selectAnytimeTasks,
    selectSomedayTasks,
    selectCompletedTasks
  ],
  (todayTasks, overdueTasks, upcomingTasks, inboxTasks, anytimeTasks, somedayTasks, completedTasks) => ({
    today: todayTasks.length + overdueTasks.length,
    upcoming: upcomingTasks.length,
    inbox: inboxTasks.length,
    anytime: anytimeTasks.length,
    someday: somedayTasks.length,
    logbook: completedTasks.length
  })
);

// Get upcoming tasks grouped by date
export const selectUpcomingTasksByDate = createSelector(
  [selectUpcomingTasks],
  (upcomingTasks) => {
    const groupedTasks: Record<string, Task[]> = {};
    
    upcomingTasks.forEach(task => {
      if (task.due_date) {
        if (!groupedTasks[task.due_date]) {
          groupedTasks[task.due_date] = [];
        }
        groupedTasks[task.due_date]?.push(task);
      }
    });
    
    // Sort dates
    const sortedDates = Object.keys(groupedTasks).sort();
    const sortedGroupedTasks: Record<string, Task[]> = {};
    
    sortedDates.forEach(date => {
      const tasksForDate = groupedTasks[date];
      if (tasksForDate) {
        sortedGroupedTasks[date] = tasksForDate;
      }
    });
    
    return sortedGroupedTasks;
  }
);