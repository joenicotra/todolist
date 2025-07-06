import { Task, Project, Area } from './core';

// Custom event types for the application
export interface TaskEvent {
  type: 'task-created' | 'task-updated' | 'task-deleted' | 'task-completed';
  task: Task;
  timestamp: string;
  userId: string;
}

export interface ProjectEvent {
  type: 'project-created' | 'project-updated' | 'project-deleted' | 'project-completed';
  project: Project;
  timestamp: string;
  userId: string;
}

export interface AreaEvent {
  type: 'area-created' | 'area-updated' | 'area-deleted';
  area: Area;
  timestamp: string;
  userId: string;
}

// Keyboard shortcut events
export interface KeyboardShortcutEvent {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  action: string;
}

// Drag and drop events
export interface DragEvent {
  type: 'task' | 'project';
  id: string;
  sourceIndex: number;
  targetIndex: number;
  sourceContainer?: string;
  targetContainer?: string;
}

// Collaboration events (for future real-time features)
export interface CollaborationEvent {
  type: 'user-joined' | 'user-left' | 'cursor-moved' | 'selection-changed';
  userId: string;
  data?: Record<string, any>;
  timestamp: string;
}

// UI interaction events
export interface UIEvent {
  type: 'modal-opened' | 'modal-closed' | 'view-changed' | 'filter-applied';
  data?: Record<string, any>;
  timestamp: string;
}

// Error events
export interface ErrorEvent {
  type: 'api-error' | 'validation-error' | 'network-error' | 'unknown-error';
  message: string;
  code?: string;
  details?: Record<string, any>;
  timestamp: string;
}
