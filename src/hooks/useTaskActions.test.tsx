import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useTaskActions } from './useTaskActions';
import tasksReducer from '../store/slices/tasks';
import { Task } from '../types/core';

const createMockStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksReducer
    },
    preloadedState: {
      tasks: {
        byId: {
          'task-1': {
            id: 'task-1',
            title: 'Test Task',
            organization_id: 'org-1',
            created_by: 'user-1',
            status: 'active',
            priority: 2,
            sort_order: 1,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          } as Task
        },
        allIds: ['task-1'],
        isLoading: false,
        error: null,
        filters: {},
        sortBy: 'sort_order' as const,
        sortOrder: 'asc' as const
      }
    }
  });
};

describe('useTaskActions Hook', () => {
  it('should toggle task from active to completed', () => {
    const store = createMockStore();
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    
    const { result } = renderHook(() => useTaskActions(), { wrapper });
    
    // Toggle task to completed
    result.current.handleToggleTask('task-1', 'active');
    
    const state = store.getState();
    const task = state.tasks.byId['task-1'];
    
    expect(task?.status).toBe('completed');
    expect(task?.completed_at).toBeTruthy();
  });

  it('should toggle task from completed to active', () => {
    const store = createMockStore();
    // First set task as completed
    store.dispatch({
      type: 'tasks/updateTask',
      payload: {
        id: 'task-1',
        changes: {
          status: 'completed',
          completed_at: new Date().toISOString()
        }
      }
    });
    
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    
    const { result } = renderHook(() => useTaskActions(), { wrapper });
    
    // Toggle task back to active
    result.current.handleToggleTask('task-1', 'completed');
    
    const state = store.getState();
    const task = state.tasks.byId['task-1'];
    
    expect(task?.status).toBe('active');
    expect(task?.completed_at).toBeUndefined();
  });

  it('should update task title and notes', () => {
    const store = createMockStore();
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    
    const { result } = renderHook(() => useTaskActions(), { wrapper });
    
    result.current.handleUpdateTask('task-1', {
      title: 'Updated Title',
      notes: 'Updated notes'
    });
    
    const state = store.getState();
    const task = state.tasks.byId['task-1'];
    
    expect(task?.title).toBe('Updated Title');
    expect(task?.notes).toBe('Updated notes');
  });

  it('should create new task', () => {
    const store = createMockStore();
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    
    const { result } = renderHook(() => useTaskActions(), { wrapper });
    
    result.current.handleCreateTask('New Task', 'New task notes');
    
    const state = store.getState();
    const taskIds = state.tasks.allIds;
    const newTaskId = taskIds.find(id => id !== 'task-1');
    const newTask = newTaskId ? state.tasks.byId[newTaskId] : null;
    
    expect(newTask).toBeTruthy();
    expect(newTask?.title).toBe('New Task');
    expect(newTask?.notes).toBe('New task notes');
    expect(newTask?.status).toBe('active');
  });

  it('should delete task by setting status to cancelled', () => {
    const store = createMockStore();
    const wrapper = ({ children }: any) => (
      <Provider store={store}>{children}</Provider>
    );
    
    const { result } = renderHook(() => useTaskActions(), { wrapper });
    
    result.current.handleDeleteTask('task-1');
    
    const state = store.getState();
    const task = state.tasks.byId['task-1'];
    
    expect(task?.status).toBe('cancelled');
  });
});