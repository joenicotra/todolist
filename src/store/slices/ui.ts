import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ViewType = 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday' | 'logbook' | 'trash' | 'area' | 'project';

interface NavigationState {
  currentView: string; // Allow any string to handle area-123, project-456 etc.
  currentAreaId: string | undefined;
  currentProjectId: string | undefined;
  breadcrumbs: Array<{ label: string; path: string }>;
}

interface ModalState {
  isQuickEntryOpen: boolean;
  isTaskDetailsOpen: boolean;
  isProjectModalOpen: boolean;
  isAreaModalOpen: boolean;
  selectedTaskId: string | undefined;
  selectedProjectId: string | undefined;
  selectedAreaId: string | undefined;
}

interface UIState {
  navigation: NavigationState;
  modals: ModalState;
  sidebar: {
    isCollapsed: boolean;
    width: number;
  };
  theme: {
    isDarkMode: boolean;
  };
  loading: {
    global: boolean;
    tasks: boolean;
    projects: boolean;
    areas: boolean;
  };
  errors: {
    global: string | undefined;
    tasks: string | undefined;
    projects: string | undefined;
    areas: string | undefined;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

const initialState: UIState = {
  navigation: {
    currentView: 'inbox',
    currentAreaId: undefined,
    currentProjectId: undefined,
    breadcrumbs: [{ label: 'Inbox', path: '/inbox' }],
  },
  modals: {
    isQuickEntryOpen: false,
    isTaskDetailsOpen: false,
    isProjectModalOpen: false,
    isAreaModalOpen: false,
    selectedTaskId: undefined,
    selectedProjectId: undefined,
    selectedAreaId: undefined,
  },
  sidebar: {
    isCollapsed: false,
    width: 280,
  },
  theme: {
    isDarkMode: false,
  },
  loading: {
    global: false,
    tasks: false,
    projects: false,
    areas: false,
  },
  errors: {
    global: undefined,
    tasks: undefined,
    projects: undefined,
    areas: undefined,
  },
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    setCurrentView: (state, action: PayloadAction<{ view: string; areaId?: string; projectId?: string }>) => {
      const { view, areaId, projectId } = action.payload;
      state.navigation.currentView = view;
      state.navigation.currentAreaId = areaId;
      state.navigation.currentProjectId = projectId;
    },
    setBreadcrumbs: (state, action: PayloadAction<Array<{ label: string; path: string }>>) => {
      state.navigation.breadcrumbs = action.payload;
    },
    
    // Modals
    openQuickEntry: (state) => {
      state.modals.isQuickEntryOpen = true;
    },
    closeQuickEntry: (state) => {
      state.modals.isQuickEntryOpen = false;
    },
    openTaskDetails: (state, action: PayloadAction<string>) => {
      state.modals.isTaskDetailsOpen = true;
      state.modals.selectedTaskId = action.payload;
    },
    closeTaskDetails: (state) => {
      state.modals.isTaskDetailsOpen = false;
      state.modals.selectedTaskId = undefined;
    },
    openProjectModal: (state, action: PayloadAction<string | undefined>) => {
      state.modals.isProjectModalOpen = true;
      state.modals.selectedProjectId = action.payload;
    },
    closeProjectModal: (state) => {
      state.modals.isProjectModalOpen = false;
      state.modals.selectedProjectId = undefined;
    },
    openAreaModal: (state, action: PayloadAction<string | undefined>) => {
      state.modals.isAreaModalOpen = true;
      state.modals.selectedAreaId = action.payload;
    },
    closeAreaModal: (state) => {
      state.modals.isAreaModalOpen = false;
      state.modals.selectedAreaId = undefined;
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    setSidebarWidth: (state, action: PayloadAction<number>) => {
      state.sidebar.width = action.payload;
    },
    
    // Theme
    toggleDarkMode: (state) => {
      state.theme.isDarkMode = !state.theme.isDarkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.theme.isDarkMode = action.payload;
    },
    
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setTasksLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.tasks = action.payload;
    },
    setProjectsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.projects = action.payload;
    },
    setAreasLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.areas = action.payload;
    },
    
    // Error states
    setGlobalError: (state, action: PayloadAction<string | undefined>) => {
      state.errors.global = action.payload;
    },
    setTasksError: (state, action: PayloadAction<string | undefined>) => {
      state.errors.tasks = action.payload;
    },
    setProjectsError: (state, action: PayloadAction<string | undefined>) => {
      state.errors.projects = action.payload;
    },
    setAreasError: (state, action: PayloadAction<string | undefined>) => {
      state.errors.areas = action.payload;
    },
    clearAllErrors: (state) => {
      state.errors.global = undefined;
      state.errors.tasks = undefined;
      state.errors.projects = undefined;
      state.errors.areas = undefined;
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setCurrentView,
  setBreadcrumbs,
  openQuickEntry,
  closeQuickEntry,
  openTaskDetails,
  closeTaskDetails,
  openProjectModal,
  closeProjectModal,
  openAreaModal,
  closeAreaModal,
  toggleSidebar,
  setSidebarWidth,
  toggleDarkMode,
  setDarkMode,
  setGlobalLoading,
  setTasksLoading,
  setProjectsLoading,
  setAreasLoading,
  setGlobalError,
  setTasksError,
  setProjectsError,
  setAreasError,
  clearAllErrors,
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
