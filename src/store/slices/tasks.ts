import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '@/types/core';

interface TasksState {
  byId: Record<string, Task>;
  allIds: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: 'active' | 'completed' | 'cancelled';
    projectId?: string;
    areaId?: string;
    assignedTo?: string;
    search?: string;
  };
  sortBy: 'created_at' | 'due_date' | 'priority' | 'sort_order';
  sortOrder: 'asc' | 'desc';
}

const initialState: TasksState = {
  byId: {},
  allIds: [],
  isLoading: false,
  error: null,
  filters: {},
  sortBy: 'sort_order',
  sortOrder: 'asc',
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.byId = {};
      state.allIds = [];
      action.payload.forEach((task) => {
        state.byId[task.id] = task;
        state.allIds.push(task.id);
      });
    },
    addTask: (state, action: PayloadAction<Task>) => {
      const task = action.payload;
      state.byId[task.id] = task;
      if (!state.allIds.includes(task.id)) {
        state.allIds.push(task.id);
      }
    },
    updateTask: (state, action: PayloadAction<{ id: string; changes: Partial<Task> }>) => {
      const { id, changes } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...changes };
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((taskId) => taskId !== id);
    },
    setFilters: (state, action: PayloadAction<TasksState['filters']>) => {
      state.filters = action.payload;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: TasksState['sortBy']; sortOrder: TasksState['sortOrder'] }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    bulkUpdateTasks: (state, action: PayloadAction<Array<{ id: string; updates: Partial<Task> }>>) => {
      action.payload.forEach(({ id, updates }) => {
        if (state.byId[id]) {
          state.byId[id] = { ...state.byId[id], ...updates };
        }
      });
    },
    reorderTasks: (state, action: PayloadAction<{ taskIds: string[]; newOrder: number[] }>) => {
      const { taskIds, newOrder } = action.payload;
      taskIds.forEach((taskId, index) => {
        if (state.byId[taskId]) {
          state.byId[taskId].sort_order = newOrder[index] || 0;
        }
      });
    },
  },
});

export const {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTask,
  removeTask,
  setFilters,
  setSorting,
  bulkUpdateTasks,
  reorderTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
