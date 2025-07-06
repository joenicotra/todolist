import { Project } from '../types/core';
import {
  CreateProjectRequest,
  UpdateProjectRequest,
  GetProjectsParams,
  ApiResponse
} from '../types/api';
import { apiClient } from './api';
import { MockStorage, STORAGE_KEYS, mockDelay } from './mock';

// Project service interface
export interface ProjectService {
  getProjects(params?: GetProjectsParams): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(project: CreateProjectRequest): Promise<Project>;
  updateProject(id: string, updates: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  reorderProjects(projectIds: string[]): Promise<Project[]>;
}

// Mock implementation for development
class MockProjectService implements ProjectService {
  private getStoredProjects(): Project[] {
    return MockStorage.get<Project[]>(STORAGE_KEYS.PROJECTS) || [];
  }

  private saveProjects(projects: Project[]): void {
    MockStorage.set(STORAGE_KEYS.PROJECTS, projects);
  }

  private applyFilters(projects: Project[], params?: GetProjectsParams): Project[] {
    if (!params) return projects;

    return projects.filter(project => {
      // Area filter
      if (params.area_id && project.area_id !== params.area_id) {
        return false;
      }

      // Status filter
      if (params.status && !params.status.includes(project.status)) {
        return false;
      }

      return true;
    });
  }

  async getProjects(params?: GetProjectsParams): Promise<Project[]> {
    await mockDelay();
    const projects = this.getStoredProjects();
    return this.applyFilters(projects, params);
  }

  async getProjectById(id: string): Promise<Project | null> {
    await mockDelay(100, 300);
    const projects = this.getStoredProjects();
    return projects.find(project => project.id === id) || null;
  }

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    await mockDelay();

    const projects = this.getStoredProjects();
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      name: projectData.name,
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      status: 'active',
      sort_order: projects.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (projectData.notes !== undefined) {
      newProject.notes = projectData.notes;
    }
    if (projectData.area_id !== undefined) {
      newProject.area_id = projectData.area_id;
    }

    projects.push(newProject);
    this.saveProjects(projects);

    return newProject;
  }

  async updateProject(id: string, updates: UpdateProjectRequest): Promise<Project> {
    await mockDelay();

    const projects = this.getStoredProjects();
    const projectIndex = projects.findIndex(project => project.id === id);

    if (projectIndex === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    const existingProject = projects[projectIndex];
    if (!existingProject) {
      throw new Error('Project not found');
    }

    const updatedProject: Project = {
      id: existingProject.id,
      name: updates.name !== undefined ? updates.name : existingProject.name,
      organization_id: existingProject.organization_id,
      created_by: existingProject.created_by,
      status: updates.status !== undefined ? updates.status : existingProject.status,
      sort_order: updates.sort_order !== undefined ? updates.sort_order : existingProject.sort_order,
      created_at: existingProject.created_at,
      updated_at: new Date().toISOString(),
    };

    if (updates.notes !== undefined) {
      updatedProject.notes = updates.notes;
    } else if (existingProject.notes !== undefined) {
      updatedProject.notes = existingProject.notes;
    }

    if (updates.area_id !== undefined) {
      updatedProject.area_id = updates.area_id;
    } else if (existingProject.area_id !== undefined) {
      updatedProject.area_id = existingProject.area_id;
    }

    projects[projectIndex] = updatedProject;
    this.saveProjects(projects);

    return updatedProject;
  }

  async deleteProject(id: string): Promise<void> {
    await mockDelay();

    const projects = this.getStoredProjects();
    const filteredProjects = projects.filter(project => project.id !== id);

    if (filteredProjects.length === projects.length) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.saveProjects(filteredProjects);
  }

  async reorderProjects(projectIds: string[]): Promise<Project[]> {
    await mockDelay();

    const projects = this.getStoredProjects();
    const reorderedProjects: Project[] = [];

    projectIds.forEach((id, index) => {
      const project = projects.find(p => p.id === id);
      if (project) {
        const updatedProject: Project = {
          ...project,
          sort_order: index,
          updated_at: new Date().toISOString(),
        };
        const projectIndex = projects.findIndex(p => p.id === id);
        projects[projectIndex] = updatedProject;
        reorderedProjects.push(updatedProject);
      }
    });

    this.saveProjects(projects);
    return reorderedProjects;
  }
}

// Production implementation
class ProductionProjectService implements ProjectService {
  async getProjects(params?: GetProjectsParams): Promise<Project[]> {
    const config = params ? { params } : {};
    const response = await apiClient.get<Project[]>('/projects', config);
    return response.data;
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const response = await apiClient.get<Project>(`/projects/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createProject(project: CreateProjectRequest): Promise<Project> {
    const response = await apiClient.post<Project>('/projects', project);
    return response.data;
  }

  async updateProject(id: string, updates: UpdateProjectRequest): Promise<Project> {
    const response = await apiClient.patch<Project>(`/projects/${id}`, updates);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  }

  async reorderProjects(projectIds: string[]): Promise<Project[]> {
    const response = await apiClient.patch<Project[]>('/projects/reorder', { projectIds });
    return response.data;
  }
}

// Export the appropriate service based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
export const projectService: ProjectService = isDevelopment
  ? new MockProjectService()
  : new ProductionProjectService();

// Export individual methods for convenience
export const getProjects = (params?: GetProjectsParams) => projectService.getProjects(params);
export const getProjectById = (id: string) => projectService.getProjectById(id);
export const createProject = (project: CreateProjectRequest) => projectService.createProject(project);
export const updateProject = (id: string, updates: UpdateProjectRequest) => projectService.updateProject(id, updates);
export const deleteProject = (id: string) => projectService.deleteProject(id);
export const reorderProjects = (projectIds: string[]) => projectService.reorderProjects(projectIds);
