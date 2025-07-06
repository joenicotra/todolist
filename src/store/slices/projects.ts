import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '@/types/core';

interface ProjectsState {
  byId: Record<string, Project>;
  allIds: string[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: 'active' | 'completed' | 'cancelled';
    areaId?: string;
  };
}

const initialState: ProjectsState = {
  byId: {},
  allIds: [],
  isLoading: false,
  error: null,
  filters: {},
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.byId = {};
      state.allIds = [];
      action.payload.forEach((project) => {
        state.byId[project.id] = project;
        state.allIds.push(project.id);
      });
    },
    addProject: (state, action: PayloadAction<Project>) => {
      const project = action.payload;
      state.byId[project.id] = project;
      if (!state.allIds.includes(project.id)) {
        state.allIds.push(project.id);
      }
    },
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = { ...state.byId[id], ...updates };
      }
    },
    removeProject: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter((projectId) => projectId !== id);
    },
    setFilters: (state, action: PayloadAction<ProjectsState['filters']>) => {
      state.filters = action.payload;
    },
    reorderProjects: (state, action: PayloadAction<{ projectIds: string[]; newOrder: number[] }>) => {
      const { projectIds, newOrder } = action.payload;
      projectIds.forEach((projectId, index) => {
        if (state.byId[projectId]) {
          state.byId[projectId].sort_order = newOrder[index] || 0;
        }
      });
    },
  },
});

export const {
  setLoading,
  setError,
  setProjects,
  addProject,
  updateProject,
  removeProject,
  setFilters,
  reorderProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
