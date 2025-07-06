import { Task, Project, Area } from './core';

// Navigation and routing types
export type ViewType = 'today' | 'upcoming' | 'anytime' | 'someday' | 'inbox' | 'logbook' | 'area' | 'project';

export interface NavigationState {
  currentView: ViewType;
  selectedAreaId?: string;
  selectedProjectId?: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  type: 'area' | 'project' | 'smartlist';
}

// Modal and UI state types
export interface ModalState {
  isOpen: boolean;
  type?: 'task-details' | 'project-create' | 'area-create' | 'quick-entry';
  data?: any;
}

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// Component prop types
export interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isEditing?: boolean;
  showProject?: boolean;
  collaborative?: boolean;
}

export interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export interface ProjectCardProps {
  project: Project;
  taskCount: number;
  completedCount: number;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onClick: (projectId: string) => void;
}

// Form types
export interface TaskFormData {
  title: string;
  notes?: string;
  project_id?: string;
  area_id?: string;
  priority: number;
  start_date?: string;
  due_date?: string;
}

export interface ProjectFormData {
  name: string;
  notes?: string;
  area_id?: string;
}

export interface AreaFormData {
  name: string;
  notes?: string;
}

// Filter and sort types
export interface TaskFilters {
  status?: Task['status'][];
  project_id?: string;
  area_id?: string;
  assigned_to?: string;
  due_date_range?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

export interface SortOptions {
  field: 'created_at' | 'updated_at' | 'due_date' | 'priority' | 'sort_order';
  direction: 'asc' | 'desc';
}

// Smart list types
export interface SmartListConfig {
  id: string;
  name: string;
  icon: string;
  filter: TaskFilters;
  sort: SortOptions;
  count?: number;
}
