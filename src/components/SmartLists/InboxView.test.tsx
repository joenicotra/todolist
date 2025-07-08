import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import InboxView from './InboxView';
import tasksReducer from '../../store/slices/tasks';
import areasReducer from '../../store/slices/areas';
import projectsReducer from '../../store/slices/projects';
import authReducer from '../../store/slices/auth';
import uiReducer from '../../store/slices/ui';
import { Task } from '../../types/core';

const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Test Inbox Task',
    organization_id: 'org-1',
    created_by: 'user-1',
    status: 'active',
    priority: 2,
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    area_id: 'area-1'
  },
  {
    id: 'task-2',
    title: 'Another Inbox Task',
    organization_id: 'org-1',
    created_by: 'user-1',
    status: 'active',
    priority: 2,
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const createMockStore = (tasks: Task[] = []) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      areas: areasReducer,
      projects: projectsReducer,
      auth: authReducer,
      ui: uiReducer
    },
    preloadedState: {
      tasks: {
        byId: tasks.reduce((acc, task) => ({ ...acc, [task.id]: task }), {}),
        allIds: tasks.map(task => task.id),
        isLoading: false,
        error: null,
        filters: {},
        sortBy: 'sort_order' as const,
        sortOrder: 'asc' as const
      },
      areas: { 
        byId: {
          'area-1': {
            id: 'area-1',
            name: 'Work',
            organization_id: 'org-1',
            created_by: 'user-1',
            sort_order: 1,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        }, 
        allIds: ['area-1'], 
        isLoading: false, 
        error: null 
      },
      projects: { byId: {}, allIds: [], isLoading: false, error: null, filters: {} },
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null, token: null },
      ui: {
        navigation: { 
          currentView: 'inbox',
          currentAreaId: undefined,
          currentProjectId: undefined,
          breadcrumbs: [{ label: 'Inbox', path: '/inbox' }]
        },
        modals: {
          isQuickEntryOpen: false,
          isTaskDetailsOpen: false,
          isProjectModalOpen: false,
          isAreaModalOpen: false,
          selectedTaskId: undefined,
          selectedProjectId: undefined,
          selectedAreaId: undefined
        },
        sidebar: {
          isCollapsed: false,
          width: 280
        },
        theme: {
          isDarkMode: false
        },
        loading: {
          global: false,
          tasks: false,
          projects: false,
          areas: false
        },
        errors: {
          global: undefined,
          tasks: undefined,
          projects: undefined,
          areas: undefined
        },
        notifications: []
      }
    }
  });
};

describe('InboxView Component', () => {
  it('renders inbox tasks grouped correctly', () => {
    const store = createMockStore(mockTasks);
    
    render(
      <Provider store={store}>
        <InboxView />
      </Provider>
    );
    
    expect(screen.getByText('Test Inbox Task')).toBeInTheDocument();
    expect(screen.getByText('Another Inbox Task')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    const store = createMockStore([]);
    
    render(
      <Provider store={store}>
        <InboxView />
      </Provider>
    );
    
    expect(screen.getByText('Your inbox is empty')).toBeInTheDocument();
    expect(screen.getByText('New tasks without due dates will appear here.')).toBeInTheDocument();
  });

  it('groups tasks by area/project correctly', () => {
    const store = createMockStore(mockTasks);
    
    render(
      <Provider store={store}>
        <InboxView />
      </Provider>
    );
    
    // Should show grouped tasks - one with proper area name, one unorganized
    expect(screen.getByText('Work')).toBeInTheDocument(); // The area name should be resolved
    expect(screen.getByText('Test Inbox Task')).toBeInTheDocument();
  });

  it('filters out tasks with due dates', () => {
    const tasksWithDueDates = [
      ...mockTasks,
      {
        id: 'task-3',
        title: 'Task with due date',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active' as const,
        priority: 2,
        sort_order: 3,
        due_date: '2024-07-08',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
    
    const store = createMockStore(tasksWithDueDates);
    
    render(
      <Provider store={store}>
        <InboxView />
      </Provider>
    );
    
    // Should only show tasks without due dates
    expect(screen.getByText('Test Inbox Task')).toBeInTheDocument();
    expect(screen.getByText('Another Inbox Task')).toBeInTheDocument();
    expect(screen.queryByText('Task with due date')).not.toBeInTheDocument();
  });
});