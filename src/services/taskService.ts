import { Task } from '../types/core';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  BulkUpdateRequest,
  GetTasksParams,
  ApiResponse
} from '../types/api';
import { TaskFilters } from '../types/ui';
import { apiClient } from './api';
import { MockStorage, STORAGE_KEYS, mockDelay, MockDataGenerator } from './mock';

// Task service interface
export interface TaskService {
  getTasks(filters?: TaskFilters): Promise<Task[]>;
  getTaskById(id: string): Promise<Task | null>;
  createTask(task: CreateTaskRequest): Promise<Task>;
  updateTask(id: string, updates: UpdateTaskRequest): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  bulkUpdate(updates: BulkUpdateRequest[]): Promise<Task[]>;
  reorderTasks(taskIds: string[]): Promise<Task[]>;
}

// Mock implementation for development
class MockTaskService implements TaskService {
  private getStoredTasks(): Task[] {
    return MockStorage.get<Task[]>(STORAGE_KEYS.TASKS) || [];
  }

  private saveTasks(tasks: Task[]): void {
    MockStorage.set(STORAGE_KEYS.TASKS, tasks);
  }

  private applyFilters(tasks: Task[], filters?: TaskFilters): Task[] {
    if (!filters) return tasks;

    return tasks.filter(task => {
      // Status filter
      if (filters.status && !filters.status.includes(task.status)) {
        return false;
      }

      // Project filter
      if (filters.project_id && task.project_id !== filters.project_id) {
        return false;
      }

      // Area filter
      if (filters.area_id && task.area_id !== filters.area_id) {
        return false;
      }

      // Date filters
      if (filters.due_date_range) {
        if (filters.due_date_range.start) {
          const taskDate = task.due_date || task.start_date;
          if (!taskDate || taskDate < filters.due_date_range.start) {
            return false;
          }
        }

        if (filters.due_date_range.end) {
          const taskDate = task.due_date || task.start_date;
          if (!taskDate || taskDate > filters.due_date_range.end) {
            return false;
          }
        }
      }

      return true;
    });
  }

  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    await mockDelay();
    const tasks = this.getStoredTasks();
    return this.applyFilters(tasks, filters);
  }

  async getTaskById(id: string): Promise<Task | null> {
    await mockDelay(100, 300);
    const tasks = this.getStoredTasks();
    return tasks.find(task => task.id === id) || null;
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    await mockDelay();

    const tasks = this.getStoredTasks();
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      status: 'active',
      priority: taskData.priority || 2,
      sort_order: tasks.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (taskData.notes !== undefined) {
      newTask.notes = taskData.notes;
    }
    if (taskData.project_id !== undefined) {
      newTask.project_id = taskData.project_id;
    }
    if (taskData.area_id !== undefined) {
      newTask.area_id = taskData.area_id;
    }
    if (taskData.start_date !== undefined) {
      newTask.start_date = taskData.start_date;
    }
    if (taskData.due_date !== undefined) {
      newTask.due_date = taskData.due_date;
    }

    tasks.push(newTask);
    this.saveTasks(tasks);

    return newTask;
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    await mockDelay();

    const tasks = this.getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const existingTask = tasks[taskIndex];
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      id: existingTask.id,
      title: updates.title !== undefined ? updates.title : existingTask.title,
      organization_id: existingTask.organization_id,
      created_by: existingTask.created_by,
      status: updates.status !== undefined ? updates.status : existingTask.status,
      priority: updates.priority !== undefined ? updates.priority : existingTask.priority,
      sort_order: updates.sort_order !== undefined ? updates.sort_order : existingTask.sort_order,
      created_at: existingTask.created_at,
      updated_at: new Date().toISOString(),
    };

    // Copy assigned_to if it exists in the original task
    if (existingTask.assigned_to !== undefined) {
      updatedTask.assigned_to = existingTask.assigned_to;
    }

    // Handle optional properties
    if (updates.notes !== undefined) {
      updatedTask.notes = updates.notes;
    } else if (existingTask.notes !== undefined) {
      updatedTask.notes = existingTask.notes;
    }

    if (updates.project_id !== undefined) {
      updatedTask.project_id = updates.project_id;
    } else if (existingTask.project_id !== undefined) {
      updatedTask.project_id = existingTask.project_id;
    }

    if (updates.area_id !== undefined) {
      updatedTask.area_id = updates.area_id;
    } else if (existingTask.area_id !== undefined) {
      updatedTask.area_id = existingTask.area_id;
    }



    if (updates.start_date !== undefined) {
      updatedTask.start_date = updates.start_date;
    } else if (existingTask.start_date !== undefined) {
      updatedTask.start_date = existingTask.start_date;
    }

    if (updates.due_date !== undefined) {
      updatedTask.due_date = updates.due_date;
    } else if (existingTask.due_date !== undefined) {
      updatedTask.due_date = existingTask.due_date;
    }

    // Copy completed_at if it exists in the original task
    if (existingTask.completed_at !== undefined) {
      updatedTask.completed_at = existingTask.completed_at;
    }

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await mockDelay();

    const tasks = this.getStoredTasks();
    const filteredTasks = tasks.filter(task => task.id !== id);

    if (filteredTasks.length === tasks.length) {
      throw new Error(`Task with id ${id} not found`);
    }

    this.saveTasks(filteredTasks);
  }

  async bulkUpdate(updates: BulkUpdateRequest[]): Promise<Task[]> {
    await mockDelay(300, 600);

    const tasks = this.getStoredTasks();
    const updatedTasks: Task[] = [];

    for (const update of updates) {
      const taskIndex = tasks.findIndex(task => task.id === update.id);
      if (taskIndex !== -1) {
        const existingTask = tasks[taskIndex];
        if (!existingTask) continue;

        const updatedTask: Task = {
          id: existingTask.id,
          title: update.updates.title !== undefined ? update.updates.title : existingTask.title,
          organization_id: existingTask.organization_id,
          created_by: existingTask.created_by,
          status: update.updates.status !== undefined ? update.updates.status : existingTask.status,
          priority: update.updates.priority !== undefined ? update.updates.priority : existingTask.priority,
          sort_order: update.updates.sort_order !== undefined ? update.updates.sort_order : existingTask.sort_order,
          created_at: existingTask.created_at,
          updated_at: new Date().toISOString(),
        };

        // Handle optional properties
        if (update.updates.notes !== undefined) {
          updatedTask.notes = update.updates.notes;
        } else if (existingTask.notes !== undefined) {
          updatedTask.notes = existingTask.notes;
        }

        if (update.updates.project_id !== undefined) {
          updatedTask.project_id = update.updates.project_id;
        } else if (existingTask.project_id !== undefined) {
          updatedTask.project_id = existingTask.project_id;
        }

        if (update.updates.area_id !== undefined) {
          updatedTask.area_id = update.updates.area_id;
        } else if (existingTask.area_id !== undefined) {
          updatedTask.area_id = existingTask.area_id;
        }

        if (update.updates.start_date !== undefined) {
          updatedTask.start_date = update.updates.start_date;
        } else if (existingTask.start_date !== undefined) {
          updatedTask.start_date = existingTask.start_date;
        }

        if (update.updates.due_date !== undefined) {
          updatedTask.due_date = update.updates.due_date;
        } else if (existingTask.due_date !== undefined) {
          updatedTask.due_date = existingTask.due_date;
        }

        // Copy other optional properties
        if (existingTask.assigned_to !== undefined) {
          updatedTask.assigned_to = existingTask.assigned_to;
        }

        if (existingTask.completed_at !== undefined) {
          updatedTask.completed_at = existingTask.completed_at;
        }

        tasks[taskIndex] = updatedTask;
        updatedTasks.push(updatedTask);
      }
    }

    this.saveTasks(tasks);
    return updatedTasks;
  }

  async reorderTasks(taskIds: string[]): Promise<Task[]> {
    await mockDelay();

    const tasks = this.getStoredTasks();
    const reorderedTasks: Task[] = [];

    taskIds.forEach((id, index) => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        const updatedTask: Task = {
          ...task,
          sort_order: index,
          updated_at: new Date().toISOString(),
        };
        const taskIndex = tasks.findIndex(t => t.id === id);
        tasks[taskIndex] = updatedTask;
        reorderedTasks.push(updatedTask);
      }
    });

    this.saveTasks(tasks);
    return reorderedTasks;
  }
}

// Production implementation
class ProductionTaskService implements TaskService {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params: GetTasksParams = {};
    if (filters) {
      params.filters = filters;
    }
    const config = Object.keys(params).length > 0 ? { params } : {};
    const response = await apiClient.get<Task[]>('/tasks', config);
    return response.data;
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const response = await apiClient.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    const response = await apiClient.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  }

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  }

  async bulkUpdate(updates: BulkUpdateRequest[]): Promise<Task[]> {
    const response = await apiClient.patch<Task[]>('/tasks/bulk', { updates });
    return response.data;
  }

  async reorderTasks(taskIds: string[]): Promise<Task[]> {
    const response = await apiClient.patch<Task[]>('/tasks/reorder', { taskIds });
    return response.data;
  }
}

// Export the appropriate service based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
export const taskService: TaskService = isDevelopment
  ? new MockTaskService()
  : new ProductionTaskService();

// Export individual methods for convenience
export const getTasks = (filters?: TaskFilters) => taskService.getTasks(filters);
export const getTaskById = (id: string) => taskService.getTaskById(id);
export const createTask = (task: CreateTaskRequest) => taskService.createTask(task);
export const updateTask = (id: string, updates: UpdateTaskRequest) => taskService.updateTask(id, updates);
export const deleteTask = (id: string) => taskService.deleteTask(id);
export const bulkUpdateTasks = (updates: BulkUpdateRequest[]) => taskService.bulkUpdate(updates);
export const reorderTasks = (taskIds: string[]) => taskService.reorderTasks(taskIds);
