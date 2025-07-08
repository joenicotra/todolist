import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateTask, addTask } from '../store/slices/tasks';
import { Task } from '../types/core';

export const useTaskActions = () => {
  const dispatch = useAppDispatch();

  const handleToggleTask = useCallback((taskId: string, currentStatus: 'active' | 'completed' | 'cancelled') => {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
    const changes: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    if (newStatus === 'completed') {
      changes.completed_at = new Date().toISOString();
    } else {
      changes.completed_at = undefined;
    }
    
    dispatch(updateTask({
      id: taskId,
      changes
    }));
  }, [dispatch]);

  const handleUpdateTask = useCallback((taskId: string, updates: { title?: string; notes?: string }) => {
    dispatch(updateTask({
      id: taskId,
      changes: {
        ...updates,
        updated_at: new Date().toISOString()
      }
    }));
  }, [dispatch]);

  const handleCreateTask = useCallback((title: string, notes?: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      organization_id: 'org-1',
      created_by: 'user-1',
      status: 'active',
      priority: 2,
      sort_order: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(notes && { notes })
    };

    dispatch(addTask(newTask));
  }, [dispatch]);

  const handleDeleteTask = useCallback((taskId: string) => {
    dispatch(updateTask({
      id: taskId,
      changes: {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      }
    }));
  }, [dispatch]);

  const handleBulkComplete = useCallback((taskIds: string[]) => {
    taskIds.forEach(taskId => {
      dispatch(updateTask({
        id: taskId,
        changes: {
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }));
    });
  }, [dispatch]);

  const handleBulkDelete = useCallback((taskIds: string[]) => {
    taskIds.forEach(taskId => {
      dispatch(updateTask({
        id: taskId,
        changes: {
          status: 'cancelled',
          updated_at: new Date().toISOString()
        }
      }));
    });
  }, [dispatch]);

  return {
    handleToggleTask,
    handleUpdateTask,
    handleCreateTask,
    handleDeleteTask,
    handleBulkComplete,
    handleBulkDelete
  };
};