import { Task, Project, Area, User } from '../../types/core';

// Comprehensive realistic mock data for showcasing functionality
export class RealMockData {
  // Generate comprehensive areas with real-world examples
  static generateRealAreas(): Area[] {
    return [
      {
        id: 'area-work',
        name: 'Work',
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'area-personal',
        name: 'Personal',
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'area-health',
        name: 'Health & Fitness',
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'area-learning',
        name: 'Learning & Development',
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: 4,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'area-home',
        name: 'Home & Family',
        organization_id: 'org-1',
        created_by: 'user-1',
        sort_order: 5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  // Generate realistic projects with meaningful relationships
  static generateRealProjects(): Project[] {
    return [
      // Work Projects
      {
        id: 'project-web-redesign',
        name: 'Company Website Redesign',
        notes: 'Complete overhaul of company website with modern design and improved UX',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'project-mobile-app',
        name: 'Mobile App Launch',
        notes: 'Develop and launch our first mobile application for iOS and Android',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'project-q4-marketing',
        name: 'Q4 Marketing Campaign',
        notes: 'Holiday season marketing push with social media and email campaigns',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      
      // Personal Projects  
      {
        id: 'project-home-renovation',
        name: 'Kitchen Renovation',
        notes: 'Complete kitchen remodel including new cabinets, countertops, and appliances',
        area_id: 'area-home',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 4,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'project-vacation-planning',
        name: 'Summer Vacation to Europe',
        notes: 'Plan 3-week trip to France, Italy, and Spain for the family',
        area_id: 'area-personal',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Learning Projects
      {
        id: 'project-react-course',
        name: 'Advanced React Course',
        notes: 'Complete the advanced React course including hooks, context, and performance optimization',
        area_id: 'area-learning',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 6,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Health Projects
      {
        id: 'project-marathon-training',
        name: 'Marathon Training',
        notes: '16-week training program for the city marathon in spring',
        area_id: 'area-health',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 7,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Standalone projects (no area)
      {
        id: 'project-side-business',
        name: 'Freelance Consulting Business',
        notes: 'Set up freelance web development consulting on the side',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        sort_order: 8,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  // Generate realistic tasks with proper dates and relationships
  static generateRealTasks(): Task[] {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return [
      // Today Tasks (should appear in Today view)
      {
        id: 'task-standup',
        title: 'Daily standup meeting',
        notes: 'Share yesterday\'s progress and today\'s goals with the team',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active' as const,
        priority: 2,
        due_date: today.toISOString().split('T')[0] as string,
        sort_order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-review-designs',
        title: 'Review homepage design mockups',
        notes: 'Provide feedback on the new homepage designs from the design team',
        project_id: 'project-web-redesign',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 1,
        due_date: today.toISOString().split('T')[0] as string,
        sort_order: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-grocery-shopping',
        title: 'Grocery shopping for the week',
        notes: 'Pick up ingredients for meal prep and weekly essentials',
        area_id: 'area-home',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 2,
        due_date: today.toISOString().split('T')[0] as string,
        sort_order: 3,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Tomorrow Tasks (should appear in Upcoming view)
      {
        id: 'task-client-call',
        title: 'Client discovery call with Acme Corp',
        notes: 'Initial consultation to understand their requirements for the new project',
        project_id: 'project-side-business',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 1,
        due_date: tomorrow.toISOString().split('T')[0] as string,
        sort_order: 4,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-morning-run',
        title: '5-mile training run',
        notes: 'Week 8 of marathon training - tempo run at moderate pace',
        project_id: 'project-marathon-training',
        area_id: 'area-health',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 2,
        due_date: tomorrow.toISOString().split('T')[0] as string,
        sort_order: 5,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Next Week Tasks
      {
        id: 'task-wireframes',
        title: 'Create wireframes for mobile app',
        notes: 'Low-fidelity wireframes for the main user flows',
        project_id: 'project-mobile-app',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 1,
        due_date: nextWeek.toISOString().split('T')[0] as string,
        sort_order: 6,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-contractor-quotes',
        title: 'Get quotes from kitchen contractors',
        notes: 'Contact at least 3 contractors for renovation estimates',
        project_id: 'project-home-renovation',
        area_id: 'area-home',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 2,
        due_date: nextWeek.toISOString().split('T')[0] as string,
        sort_order: 7,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Overdue Tasks (should appear in Today view)
      {
        id: 'task-overdue-expense',
        title: 'Submit expense report',
        notes: 'Submit Q3 business expenses for reimbursement',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 1,
        due_date: yesterday.toISOString().split('T')[0] as string,
        sort_order: 8,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Inbox Tasks (no due date)
      {
        id: 'task-inbox-1',
        title: 'Research React testing libraries',
        notes: 'Compare Jest, React Testing Library, and Cypress for our testing strategy',
        area_id: 'area-learning',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 9,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-inbox-2',
        title: 'Update LinkedIn profile',
        notes: 'Add recent projects and skills to professional profile',
        area_id: 'area-personal',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 10,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-inbox-3',
        title: 'Organize digital photos',
        notes: 'Sort and backup photos from the last 6 months',
        area_id: 'area-personal',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 11,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Anytime Tasks (future dates)
      {
        id: 'task-annual-review',
        title: 'Prepare annual performance review',
        notes: 'Compile accomplishments and goals for yearly review meeting',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 2,
        due_date: nextMonth.toISOString().split('T')[0] as string,
        sort_order: 12,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Someday Tasks (no due date, low priority)
      {
        id: 'task-someday-1',
        title: 'Learn Spanish',
        notes: 'Start with Duolingo or find a local class',
        area_id: 'area-learning',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 13,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-someday-2',
        title: 'Plan garden for next spring',
        notes: 'Research plants and design layout for backyard garden',
        area_id: 'area-home',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 14,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },

      // Completed Tasks (for Logbook)
      {
        id: 'task-completed-1',
        title: 'Set up development environment',
        notes: 'Configured TypeScript, React, and testing setup',
        project_id: 'project-web-redesign',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'completed',
        priority: 1,
        completed_at: yesterday.toISOString(),
        sort_order: 15,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: yesterday.toISOString()
      },
      {
        id: 'task-completed-2',
        title: 'Complete React hooks module',
        notes: 'Finished useState, useEffect, and custom hooks sections',
        project_id: 'project-react-course',
        area_id: 'area-learning',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'completed',
        priority: 2,
        completed_at: yesterday.toISOString(),
        sort_order: 16,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: yesterday.toISOString()
      },

      // Additional Work Tasks
      {
        id: 'task-code-review',
        title: 'Review pull request #234',
        notes: 'Authentication module updates need thorough review',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 1,
        sort_order: 17,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-team-lunch',
        title: 'Organize team lunch',
        notes: 'Book restaurant for Friday team celebration',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 3,
        sort_order: 18,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'task-marketing-copy',
        title: 'Write social media copy for campaign',
        notes: 'Create engaging posts for Instagram and Twitter',
        project_id: 'project-q4-marketing',
        area_id: 'area-work',
        organization_id: 'org-1',
        created_by: 'user-1',
        status: 'active',
        priority: 2,
        sort_order: 19,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ];
  }

  static generateMockUser(): User {
    return {
      id: 'user-1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };
  }

  // Get complete realistic dataset
  static getCompleteDataset() {
    return {
      user: this.generateMockUser(),
      areas: this.generateRealAreas(),
      projects: this.generateRealProjects(), 
      tasks: this.generateRealTasks()
    };
  }
}