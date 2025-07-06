// API Client
export { apiClient, setApiAuthToken, clearApiAuthToken } from './api';

// Service interfaces and implementations
export { authService, login, logout, getCurrentUser, refreshToken, isAuthenticated } from './authService';
export { taskService, getTasks, getTaskById, createTask, updateTask, deleteTask, bulkUpdateTasks, reorderTasks } from './taskService';
export { projectService, getProjects, getProjectById, createProject, updateProject, deleteProject, reorderProjects } from './projectService';
export { areaService, getAreas, getAreaById, createArea, updateArea, deleteArea, reorderAreas } from './areaService';
export {
  collaborationService,
  shareEntity,
  getCollaborators,
  updatePermission,
  removeCollaborator,
  getSharedWithMe,
  acceptShare,
  rejectShare
} from './collaborationService';

// Mock utilities
export { MockDataGenerator, MockStorage, initializeMockData } from './mock';

// Service interfaces (for type checking)
export type { AuthService } from './authService';
export type { TaskService } from './taskService';
export type { ProjectService } from './projectService';
export type { AreaService } from './areaService';
export type { CollaborationService, ShareRequest, ShareResponse, CollaboratorInfo } from './collaborationService';
// export * from './collaborationService'; // TODO: Uncomment when collaborationService is implemented

// Base API configuration
// export * from './api'; // TODO: Uncomment when api is implemented

// Placeholder export to prevent empty module error
export const SERVICES_PLACEHOLDER = 'Services will be exported here as they are created';
