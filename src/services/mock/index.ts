import { Task, Project, Area, User } from '../../types/core';

// Mock data generators with realistic data
export class MockDataGenerator {
  private static taskTitles = [
    'Review quarterly reports',
    'Update project documentation',
    'Schedule team meeting',
    'Fix login bug',
    'Design new landing page',
    'Prepare presentation slides',
    'Call client about requirements',
    'Test mobile app features',
    'Write unit tests',
    'Deploy to staging environment',
    'Research competitor analysis',
    'Update user interface',
    'Optimize database queries',
    'Create marketing materials',
    'Plan sprint retrospective',
  ];

  private static projectNames = [
    'Website Redesign',
    'Mobile App Development',
    'Marketing Campaign Q4',
    'Customer Portal',
    'Internal Tools',
    'Data Analytics Platform',
    'E-commerce Integration',
    'User Experience Research',
    'Security Audit',
    'Performance Optimization',
  ];

  private static areaNames = [
    'Work',
    'Personal',
    'Health & Fitness',
    'Learning',
    'Home',
    'Finance',
    'Travel',
    'Hobbies',
    'Family',
    'Side Projects',
  ];

  private static userNames = [
    'John Doe',
    'Jane Smith',
    'Mike Johnson',
    'Sarah Wilson',
    'David Brown',
    'Emily Davis',
    'Chris Miller',
    'Lisa Anderson',
    'Tom Wilson',
    'Amy Taylor',
  ];

  private static getRandomElement<T>(array: T[]): T {
    if (array.length === 0) {
      throw new Error('Cannot get random element from empty array');
    }
    const element = array[Math.floor(Math.random() * array.length)];
    if (element === undefined) {
      throw new Error('Random element is undefined');
    }
    return element;
  }

  private static getRandomDate(daysFromNow: number = 30): string {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * daysFromNow) - daysFromNow / 2);
    const dateString = date.toISOString().split('T')[0];
    if (!dateString) {
      throw new Error('Failed to generate date string');
    }
    return dateString;
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static generateUser(): User {
    return {
      id: this.generateId(),
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      name: this.getRandomElement(this.userNames),
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static generateArea(): Area {
    const area: Area = {
      id: this.generateId(),
      name: this.getRandomElement(this.areaNames),
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      sort_order: Math.floor(Math.random() * 100),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (Math.random() > 0.5) {
      area.notes = 'Some notes about this area';
    }

    return area;
  }

  static generateProject(areaId?: string): Project {
    const status = Math.random() > 0.8 ? 'completed' : 'active';
    const project: Project = {
      id: this.generateId(),
      name: this.getRandomElement(this.projectNames),
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      status,
      sort_order: Math.floor(Math.random() * 100),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (Math.random() > 0.5) {
      project.notes = 'Project description and notes';
    }

    if (areaId) {
      project.area_id = areaId;
    } else if (Math.random() > 0.3) {
      project.area_id = this.generateId();
    }

    return project;
  }

  static generateTask(projectId?: string, areaId?: string): Task {
    const statuses: Task['status'][] = ['active', 'completed', 'cancelled'];
    const priorities = [1, 2, 3];
    const hasDate = Math.random() > 0.6;

    const task: Task = {
      id: this.generateId(),
      title: this.getRandomElement(this.taskTitles),
      organization_id: 'mock_org_id',
      created_by: 'mock_user_id',
      status: this.getRandomElement(statuses),
      priority: this.getRandomElement(priorities),
      sort_order: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (Math.random() > 0.7) {
      task.notes = 'Additional notes for this task';
    }

    if (projectId) {
      task.project_id = projectId;
    } else if (Math.random() > 0.5) {
      task.project_id = this.generateId();
    }

    if (areaId) {
      task.area_id = areaId;
    } else if (Math.random() > 0.5) {
      task.area_id = this.generateId();
    }

    if (hasDate && Math.random() > 0.5) {
      task.start_date = this.getRandomDate(14);
    }

    if (hasDate && Math.random() > 0.5) {
      task.due_date = this.getRandomDate(30);
    }

    return task;
  }

  // Generate collections of mock data
  static generateAreas(count: number = 5): Area[] {
    return Array.from({ length: count }, () => this.generateArea());
  }

  static generateProjects(count: number = 10, areas: Area[] = []): Project[] {
    return Array.from({ length: count }, () => {
      const areaId = areas.length > 0 && Math.random() > 0.3 
        ? this.getRandomElement(areas).id 
        : undefined;
      return this.generateProject(areaId);
    });
  }

  static generateTasks(count: number = 50, projects: Project[] = [], areas: Area[] = []): Task[] {
    return Array.from({ length: count }, () => {
      const projectId = projects.length > 0 && Math.random() > 0.4 
        ? this.getRandomElement(projects).id 
        : undefined;
      const areaId = areas.length > 0 && Math.random() > 0.3 
        ? this.getRandomElement(areas).id 
        : undefined;
      return this.generateTask(projectId, areaId);
    });
  }

  // Generate complete dataset
  static generateCompleteDataset(): {
    user: User;
    areas: Area[];
    projects: Project[];
    tasks: Task[];
  } {
    const user = this.generateUser();
    const areas = this.generateAreas(6);
    const projects = this.generateProjects(12, areas);
    const tasks = this.generateTasks(75, projects, areas);

    return { user, areas, projects, tasks };
  }
}

// Utility for realistic API delays
export const mockDelay = (min: number = 200, max: number = 800): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'todolist_mock_user',
  AREAS: 'todolist_mock_areas',
  PROJECTS: 'todolist_mock_projects',
  TASKS: 'todolist_mock_tasks',
  AUTH_TOKEN: 'todolist_mock_token',
} as const;

// Local storage utilities
export class MockStorage {
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

// Initialize mock data if not exists
export const initializeMockData = (): void => {
  if (!MockStorage.get(STORAGE_KEYS.USER)) {
    const dataset = MockDataGenerator.generateCompleteDataset();
    MockStorage.set(STORAGE_KEYS.USER, dataset.user);
    MockStorage.set(STORAGE_KEYS.AREAS, dataset.areas);
    MockStorage.set(STORAGE_KEYS.PROJECTS, dataset.projects);
    MockStorage.set(STORAGE_KEYS.TASKS, dataset.tasks);
    MockStorage.set(STORAGE_KEYS.AUTH_TOKEN, 'mock_jwt_token_' + Date.now());
  }
};
