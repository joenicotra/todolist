import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Task, Project, Area } from '@/types/core';

// Base selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectTasks = (state: RootState) => state.tasks;
export const selectProjects = (state: RootState) => state.projects;
export const selectAreas = (state: RootState) => state.areas;
export const selectUI = (state: RootState) => state.ui;

// Auth selectors
export const selectCurrentUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuth],
  (auth) => auth.isAuthenticated
);

// Task selectors
export const selectAllTasks = createSelector(
  [selectTasks],
  (tasks) => tasks.allIds.map(id => tasks.byId[id]).filter((task): task is Task => Boolean(task))
);

export const selectTaskById = createSelector(
  [selectTasks, (state: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.byId[taskId]
);

export const selectActiveTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task): task is Task => Boolean(task) && task.status === 'active')
);

export const selectCompletedTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task): task is Task => Boolean(task) && task.status === 'completed')
);

export const selectTasksByProject = createSelector(
  [selectAllTasks, (state: RootState, projectId: string) => projectId],
  (tasks, projectId) => tasks.filter((task): task is Task => Boolean(task) && task.project_id === projectId)
);

export const selectTasksByArea = createSelector(
  [selectAllTasks, (state: RootState, areaId: string) => areaId],
  (tasks, areaId) => tasks.filter((task): task is Task => Boolean(task) && task.area_id === areaId)
);

// Project selectors
export const selectAllProjects = createSelector(
  [selectProjects],
  (projects) => projects.allIds.map(id => projects.byId[id]).filter((project): project is Project => Boolean(project))
);

export const selectProjectById = createSelector(
  [selectProjects, (state: RootState, projectId: string) => projectId],
  (projects, projectId) => projects.byId[projectId]
);

export const selectActiveProjects = createSelector(
  [selectAllProjects],
  (projects) => projects.filter((project): project is Project => Boolean(project) && project.status === 'active')
);

export const selectProjectsByArea = createSelector(
  [selectAllProjects, (state: RootState, areaId: string) => areaId],
  (projects, areaId) => projects.filter((project): project is Project => Boolean(project) && project.area_id === areaId)
);

// Area selectors
export const selectAllAreas = createSelector(
  [selectAreas],
  (areas) => areas.allIds.map(id => areas.byId[id]).filter((area): area is Area => Boolean(area))
);

export const selectAreaById = createSelector(
  [selectAreas, (state: RootState, areaId: string) => areaId],
  (areas, areaId) => areas.byId[areaId]
);

// Smart list selectors
export const selectTodayTasks = createSelector(
  [selectActiveTasks],
  (tasks) => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter((task): task is Task =>
      Boolean(task) && (task.due_date === today || task.start_date === today)
    );
  }
);

export const selectUpcomingTasks = createSelector(
  [selectActiveTasks],
  (tasks) => {
    const today = new Date();
    return tasks.filter((task): task is Task => {
      if (!task || (!task.due_date && !task.start_date)) return false;
      const taskDate = new Date(task.due_date || task.start_date || '');
      return taskDate > today;
    });
  }
);

export const selectInboxTasks = createSelector(
  [selectActiveTasks],
  (tasks) => tasks.filter((task): task is Task => Boolean(task) && !task.project_id && !task.area_id)
);

export const selectAnytimeTasks = createSelector(
  [selectActiveTasks],
  (tasks) => tasks.filter((task): task is Task =>
    Boolean(task) && !task.due_date && !task.start_date && Boolean(task.project_id || task.area_id)
  )
);

export const selectSomedayTasks = createSelector(
  [selectAllTasks],
  (tasks) => tasks.filter((task): task is Task => Boolean(task) && task.status === 'cancelled') // Using cancelled as "someday"
);

// Hierarchical data selectors
export const selectAreasWithProjects = createSelector(
  [selectAllAreas, selectAllProjects],
  (areas, projects) => {
    return areas.map(area => ({
      ...area,
      projects: projects.filter((project): project is Project =>
        Boolean(project) && Boolean(area) && project.area_id === area.id
      )
    }));
  }
);

export const selectProjectsWithTasks = createSelector(
  [selectAllProjects, selectAllTasks],
  (projects, tasks) => {
    return projects.map(project => ({
      ...project,
      tasks: tasks.filter((task): task is Task =>
        Boolean(task) && Boolean(project) && task.project_id === project.id
      )
    }));
  }
);

// UI selectors
export const selectCurrentView = createSelector(
  [selectUI],
  (ui) => ui.navigation.currentView
);

export const selectCurrentAreaId = createSelector(
  [selectUI],
  (ui) => ui.navigation.currentAreaId
);

export const selectCurrentProjectId = createSelector(
  [selectUI],
  (ui) => ui.navigation.currentProjectId
);

export const selectBreadcrumbs = createSelector(
  [selectUI],
  (ui) => ui.navigation.breadcrumbs
);

export const selectIsQuickEntryOpen = createSelector(
  [selectUI],
  (ui) => ui.modals.isQuickEntryOpen
);

export const selectIsSidebarCollapsed = createSelector(
  [selectUI],
  (ui) => ui.sidebar.isCollapsed
);

export const selectNotifications = createSelector(
  [selectUI],
  (ui) => ui.notifications
);

export const selectGlobalError = createSelector(
  [selectUI],
  (ui) => ui.errors.global
);

export const selectGlobalLoading = createSelector(
  [selectUI],
  (ui) => ui.loading.global
);

export const selectTasksLoading = createSelector(
  [selectUI],
  (ui) => ui.loading.tasks
);

export const selectProjectsLoading = createSelector(
  [selectUI],
  (ui) => ui.loading.projects
);

export const selectAreasLoading = createSelector(
  [selectUI],
  (ui) => ui.loading.areas
);
