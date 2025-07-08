import { selectTodayTasks, selectOverdueTasks, selectInboxTasks, selectUpcomingTasks } from './taskSelectors';
import { RootState } from '../index';
import { Task } from '../../types/core';

const createMockState = (tasks: Task[]): RootState => ({
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
    byId: {}, 
    allIds: [], 
    isLoading: false, 
    error: null 
  },
  projects: { 
    byId: {}, 
    allIds: [], 
    isLoading: false, 
    error: null, 
    filters: {} 
  },
  auth: { 
    user: null, 
    isAuthenticated: false, 
    isLoading: false, 
    error: null, 
    token: null 
  },
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
});

describe('Task Selectors', () => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const mockTasks: Task[] = [
    {
      id: 'task-today',
      title: 'Today Task',
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'active',
      priority: 2,
      sort_order: 1,
      due_date: today,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'task-overdue',
      title: 'Overdue Task',
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'active',
      priority: 1,
      sort_order: 2,
      due_date: yesterday,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'task-upcoming',
      title: 'Upcoming Task',
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'active',
      priority: 2,
      sort_order: 3,
      due_date: tomorrow,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'task-inbox',
      title: 'Inbox Task',
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'active',
      priority: 3,
      sort_order: 4,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'task-completed',
      title: 'Completed Task',
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'completed',
      priority: 2,
      sort_order: 5,
      completed_at: '2024-07-07T12:00:00Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-07-07T12:00:00Z'
    }
  ];

  describe('selectTodayTasks', () => {
    it('should return tasks due today', () => {
      const state = createMockState(mockTasks);
      const todayTasks = selectTodayTasks(state);
      
      expect(todayTasks).toHaveLength(1);
      expect(todayTasks[0]?.id).toBe('task-today');
      expect(todayTasks[0]?.title).toBe('Today Task');
    });

    it('should not include completed tasks', () => {
      const state = createMockState(mockTasks);
      const todayTasks = selectTodayTasks(state);
      
      expect(todayTasks.every(task => task.status === 'active')).toBe(true);
    });
  });

  describe('selectOverdueTasks', () => {
    it('should return tasks due before today', () => {
      const state = createMockState(mockTasks);
      const overdueTasks = selectOverdueTasks(state);
      
      expect(overdueTasks).toHaveLength(1);
      expect(overdueTasks[0]?.id).toBe('task-overdue');
      expect(overdueTasks[0]?.title).toBe('Overdue Task');
    });

    it('should only include active tasks', () => {
      const state = createMockState(mockTasks);
      const overdueTasks = selectOverdueTasks(state);
      
      expect(overdueTasks.every(task => task.status === 'active')).toBe(true);
    });
  });

  describe('selectUpcomingTasks', () => {
    it('should return tasks due in the future', () => {
      const state = createMockState(mockTasks);
      const upcomingTasks = selectUpcomingTasks(state);
      
      expect(upcomingTasks).toHaveLength(1);
      expect(upcomingTasks[0]?.id).toBe('task-upcoming');
      expect(upcomingTasks[0]?.title).toBe('Upcoming Task');
    });

    it('should not include tasks without due dates', () => {
      const state = createMockState(mockTasks);
      const upcomingTasks = selectUpcomingTasks(state);
      
      expect(upcomingTasks.every(task => task.due_date)).toBe(true);
    });
  });

  describe('selectInboxTasks', () => {
    it('should return tasks without due dates', () => {
      const state = createMockState(mockTasks);
      const inboxTasks = selectInboxTasks(state);
      
      expect(inboxTasks).toHaveLength(1);
      expect(inboxTasks[0]?.id).toBe('task-inbox');
      expect(inboxTasks[0]?.title).toBe('Inbox Task');
    });

    it('should only include active tasks', () => {
      const state = createMockState(mockTasks);
      const inboxTasks = selectInboxTasks(state);
      
      expect(inboxTasks.every(task => task.status === 'active')).toBe(true);
      expect(inboxTasks.every(task => !task.due_date)).toBe(true);
    });
  });
});