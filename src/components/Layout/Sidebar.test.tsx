import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Sidebar from './Sidebar';
import tasksReducer from '../../store/slices/tasks';
import areasReducer from '../../store/slices/areas';
import projectsReducer from '../../store/slices/projects';
import authReducer from '../../store/slices/auth';
import uiReducer from '../../store/slices/ui';
import { Area, Project } from '../../types/core';

const mockAreas: Area[] = [
  {
    id: 'area-1',
    name: 'Work',
    organization_id: 'org-1',
    created_by: 'user-1',
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    area_id: 'area-1',
    organization_id: 'org-1',
    created_by: 'user-1',
    status: 'active',
    sort_order: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'project-2',
    name: 'Standalone Project',
    organization_id: 'org-1',
    created_by: 'user-1',
    status: 'active',
    sort_order: 2,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const createMockStore = (currentView = 'inbox') => {
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
        byId: {}, 
        allIds: [],
        isLoading: false,
        error: null,
        filters: {},
        sortBy: 'sort_order' as const,
        sortOrder: 'asc' as const
      },
      areas: {
        byId: mockAreas.reduce((acc, area) => ({ ...acc, [area.id]: area }), {}),
        allIds: mockAreas.map(area => area.id),
        isLoading: false,
        error: null
      },
      projects: {
        byId: mockProjects.reduce((acc, project) => ({ ...acc, [project.id]: project }), {}),
        allIds: mockProjects.map(project => project.id),
        isLoading: false,
        error: null,
        filters: {}
      },
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null, token: null },
      ui: {
        navigation: { 
          currentView,
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

describe('Sidebar Component', () => {
  const mockProps = {
    isOpen: true,
    isMobile: false,
    onClose: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all smart lists', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <Sidebar {...mockProps} />
      </Provider>
    );
    
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Anytime')).toBeInTheDocument();
    expect(screen.getByText('Someday')).toBeInTheDocument();
  });

  it('renders areas and projects', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <Sidebar {...mockProps} />
      </Provider>
    );
    
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByText('Website Redesign')).toBeInTheDocument();
    expect(screen.getByText('Standalone Project')).toBeInTheDocument();
  });

  it('highlights active view', () => {
    const store = createMockStore('today');
    
    render(
      <Provider store={store}>
        <Sidebar {...mockProps} />
      </Provider>
    );
    
    const todayButton = screen.getByRole('button', { name: /today/i });
    expect(todayButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('dispatches navigation action when smart list is clicked', () => {
    const store = createMockStore();
    const originalDispatch = store.dispatch;
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    
    render(
      <Provider store={store}>
        <Sidebar {...mockProps} />
      </Provider>
    );
    
    const todayButton = screen.getByRole('button', { name: /today/i });
    fireEvent.click(todayButton);
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ui/setCurrentView',
      payload: { view: 'today' }
    });
    
    store.dispatch = originalDispatch;
  });

  it('calls onClose when item is clicked on mobile', () => {
    const store = createMockStore();
    const mobileProps = { ...mockProps, isMobile: true };
    
    render(
      <Provider store={store}>
        <Sidebar {...mobileProps} />
      </Provider>
    );
    
    const inboxButton = screen.getByRole('button', { name: /inbox/i });
    fireEvent.click(inboxButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it('renders logbook section', () => {
    const store = createMockStore();
    
    render(
      <Provider store={store}>
        <Sidebar {...mockProps} />
      </Provider>
    );
    
    expect(screen.getAllByText('Logbook')).toHaveLength(2); // Section title and button
    expect(screen.getByText('Trash')).toBeInTheDocument();
  });
});