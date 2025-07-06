export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface Area {
  id: string;
  name: string;
  notes?: string;
  organization_id: string;
  created_by: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  notes?: string;
  area_id?: string;
  organization_id: string;
  created_by: string;
  status: 'active' | 'completed' | 'cancelled';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  project_id?: string;
  area_id?: string;
  organization_id: string;
  created_by: string;
  assigned_to?: string;
  status: 'active' | 'completed' | 'cancelled';
  priority: number;
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Computed types for UI
export interface TaskWithProject extends Task {
  project?: Project;
}

export interface ProjectWithTasks extends Project {
  tasks: Task[];
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
}

export interface AreaWithProjects extends Area {
  projects: ProjectWithTasks[];
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}
