# Phase 2: React Components & Service Interfaces

## Overview
Convert the static HTML prototype to a fully functional React application with TypeScript, implementing component architecture, state management, and service interfaces. This phase focuses on building the component foundation and data flow without backend integration.

## Prerequisites
- Completed Phase 1 static HTML prototype
- React 18+ with TypeScript setup
- Reference `/documentation/design/complete-app-template.md` for component architecture

## Task Breakdown

### 1. React Project Setup & Configuration
**Estimated Time: 1 day**

#### 1.1 Convert CRA to TypeScript
- [x] Install TypeScript dependencies: `typescript @types/node @types/react @types/react-dom @types/jest`
- [x] Rename `.js` files to `.tsx`
- [x] Create `tsconfig.json` with strict TypeScript configuration
- [x] Set up absolute imports with path mapping (`src/` as base)
- [x] Configure TypeScript for React 18+ features

#### 1.2 Install Core Dependencies
- [x] Install state management: `@reduxjs/toolkit react-redux`
- [x] Install routing: `react-router-dom @types/react-router-dom`
- [x] Install data fetching: `@tanstack/react-query @tanstack/react-query-devtools`
- [x] Install drag-and-drop: `@dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`
- [x] Install date manipulation: `date-fns`
- [x] Install UI utilities: `clsx class-variance-authority`

#### 1.3 Project Structure Setup
- [x] Create folder structure:
  ```
  src/
    components/
      Layout/
      Tasks/
      SmartLists/
      Collaboration/
      UI/
    hooks/
    services/
    store/
    types/
    utils/
    __tests__/
  ```
- [x] Set up barrel exports (index.ts files)
- [x] Configure path aliases in TypeScript

### 2. Type Definitions & Interfaces
**Estimated Time: 1 day**

#### 2.1 Core Data Types
- [x] Create `src/types/core.ts`:
  ```typescript
  interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  }

  interface Organization {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
  }

  interface Area {
    id: string;
    name: string;
    organization_id: string;
    created_by: string;
    sort_order: number;
    created_at: string;
    updated_at: string;
  }

  interface Project {
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

  interface Task {
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
  ```

#### 2.2 UI and State Types
- [x] Create `src/types/ui.ts` for component props and state types
- [x] Create `src/types/api.ts` for API request/response types
- [x] Create `src/types/events.ts` for custom event types
- [x] Set up utility types for common patterns

#### 2.3 Service Interface Types
- [x] Define service contract interfaces
- [x] Create mock data types for development
- [x] Set up error handling types

### 3. Redux Store Setup
**Estimated Time: 1.5 days**

#### 3.1 Store Configuration
- [x] Create `src/store/index.ts` with Redux Toolkit store
- [x] Set up Redux DevTools configuration
- [x] Configure middleware for development/production
- [x] Set up type-safe hooks (`useAppDispatch`, `useAppSelector`)

#### 3.2 Core Slices
- [x] Create `src/store/slices/auth.ts`:
  - Current user state
  - Authentication status
  - Login/logout actions
- [x] Create `src/store/slices/tasks.ts`:
  - Tasks by ID (normalized state)
  - Task filtering and sorting
  - CRUD operations
- [x] Create `src/store/slices/projects.ts`:
  - Projects by ID
  - Project-task relationships
  - Project CRUD operations
- [x] Create `src/store/slices/areas.ts`:
  - Areas by ID
  - Area-project relationships
  - Area CRUD operations
- [x] Create `src/store/slices/ui.ts`:
  - Current view/navigation
  - Modal states
  - Loading states
  - Error states

#### 3.3 Selectors and Computed State
- [x] Create memoized selectors using `createSelector`
- [x] Implement smart list selectors (Today, Upcoming, etc.)
- [x] Create filtered and sorted data selectors
- [x] Set up hierarchical data selectors (Areas → Projects → Tasks)

### 4. Service Layer Implementation
**Estimated Time: 2 days**

#### 4.1 Base Service Setup
- [ ] Create `src/services/api.ts` with base API configuration
- [ ] Set up request/response interceptors
- [ ] Implement error handling and retry logic
- [ ] Create type-safe API client

#### 4.2 Mock Service Implementation
- [ ] Create `src/services/mock/` folder for development
- [ ] Implement mock data generators
- [ ] Create mock API responses with realistic delays
- [ ] Set up localStorage persistence for development

#### 4.3 Service Interfaces
- [ ] Create `src/services/authService.ts`:
  ```typescript
  interface AuthService {
    login(email: string, password: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    refreshToken(): Promise<string>;
  }
  ```
- [ ] Create `src/services/taskService.ts`:
  ```typescript
  interface TaskService {
    getTasks(filters?: TaskFilters): Promise<Task[]>;
    createTask(task: CreateTaskRequest): Promise<Task>;
    updateTask(id: string, updates: UpdateTaskRequest): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    bulkUpdate(updates: BulkUpdateRequest[]): Promise<Task[]>;
  }
  ```
- [ ] Create `src/services/projectService.ts`
- [ ] Create `src/services/areaService.ts`
- [ ] Create `src/services/collaborationService.ts`

### 5. Layout Components
**Estimated Time: 2 days**

#### 5.1 App Layout Component
- [ ] Create `src/components/Layout/AppLayout.tsx`:
  - Main application shell
  - Sidebar integration
  - Main content area
  - Responsive behavior
- [ ] Convert static CSS to component-scoped styles
- [ ] Implement proper TypeScript props interface
- [ ] Add error boundaries

#### 5.2 Sidebar Component
- [ ] Create `src/components/Layout/Sidebar.tsx`:
  - Smart lists rendering
  - Areas and projects hierarchy
  - Active state management
  - Click handlers for navigation
- [ ] Implement sidebar item components
- [ ] Add proper keyboard navigation
- [ ] Set up responsive collapse behavior

#### 5.3 Main Content Component
- [ ] Create `src/components/Layout/MainContent.tsx`:
  - Dynamic content rendering based on route
  - Header with title and actions
  - Scrollable content area
  - Empty state handling

#### 5.4 Navigation Logic
- [ ] Set up React Router with typed routes
- [ ] Implement navigation handlers
- [ ] Create route-based component rendering
- [ ] Add breadcrumb functionality

### 6. Task Components
**Estimated Time: 3 days**

#### 6.1 Task Card Component
- [ ] Create `src/components/Tasks/TaskCard.tsx`:
  ```typescript
  interface TaskCardProps {
    task: Task;
    onUpdate: (task: Task) => void;
    onDelete: (taskId: string) => void;
    isEditing?: boolean;
    showProject?: boolean;
    collaborative?: boolean;
  }
  ```
- [ ] Implement checkbox functionality
- [ ] Add inline editing capabilities
- [ ] Create hover states and interactions
- [ ] Add keyboard shortcuts (Enter to edit, Escape to cancel)

#### 6.2 Task List Component
- [ ] Create `src/components/Tasks/TaskList.tsx`:
  - Virtualized list for performance
  - Drag-and-drop integration
  - Bulk operations
  - Filtering and sorting
- [ ] Implement empty state handling
- [ ] Add loading skeletons
- [ ] Create task creation inline

#### 6.3 Task Details Component
- [ ] Create `src/components/Tasks/TaskDetails.tsx`:
  - Expanded view for editing
  - Notes with rich text
  - Tag management
  - Date/time pickers
  - Checklist functionality

#### 6.4 Quick Entry Component
- [ ] Create `src/components/Tasks/QuickEntry.tsx`:
  - Global quick entry modal
  - Natural language parsing integration
  - Keyboard shortcuts (Ctrl/Cmd + Space)
  - Smart defaults based on current context

### 7. Smart Lists Components
**Estimated Time: 2.5 days**

#### 7.1 Today View
- [ ] Create `src/components/SmartLists/TodayView.tsx`:
  - Calendar events integration (mock)
  - Today tasks section
  - This Evening section
  - Overdue task handling
- [ ] Implement date-based filtering
- [ ] Add task rescheduling functionality

#### 7.2 Upcoming View
- [ ] Create `src/components/SmartLists/UpcomingView.tsx`:
  - Date-grouped task sections
  - Collapsible date headers
  - Drag-to-reschedule functionality
  - Week/month view options

#### 7.3 Inbox View
- [ ] Create `src/components/SmartLists/InboxView.tsx`:
  - Unprocessed task list
  - Quick processing actions
  - Bulk organization tools

#### 7.4 Other Smart Lists
- [ ] Create `AnytimeView.tsx`, `SomedayView.tsx`, `LogbookView.tsx`
- [ ] Implement view-specific behaviors
- [ ] Add appropriate filtering and sorting

### 8. UI Components
**Estimated Time: 2 days**

#### 8.1 Form Components
- [ ] Create `src/components/UI/Input.tsx` with variants
- [ ] Create `src/components/UI/Button.tsx` with variants
- [ ] Create `src/components/UI/Select.tsx`
- [ ] Create `src/components/UI/DatePicker.tsx`
- [ ] Create `src/components/UI/Modal.tsx`

#### 8.2 Interactive Components
- [ ] Create `src/components/UI/Dropdown.tsx`
- [ ] Create `src/components/UI/Checkbox.tsx`
- [ ] Create `src/components/UI/LoadingSpinner.tsx`
- [ ] Create `src/components/UI/Toast.tsx` for notifications

#### 8.3 Magic Plus Button
- [ ] Create `src/components/UI/MagicPlusButton.tsx`:
  - Floating action button
  - Context-aware creation
  - Drag-and-drop functionality (basic)
  - Animation states

### 9. Custom Hooks
**Estimated Time: 1.5 days**

#### 9.1 Data Hooks
- [ ] Create `src/hooks/useTasks.ts`:
  - Task CRUD operations
  - Optimistic updates
  - Error handling
  - Cache invalidation
- [ ] Create `src/hooks/useProjects.ts`
- [ ] Create `src/hooks/useAreas.ts`

#### 9.2 UI Hooks
- [ ] Create `src/hooks/useKeyboardShortcuts.ts`
- [ ] Create `src/hooks/useLocalStorage.ts`
- [ ] Create `src/hooks/useDebounce.ts`
- [ ] Create `src/hooks/useClickOutside.ts`

#### 9.3 Business Logic Hooks
- [ ] Create `src/hooks/useSmartLists.ts` for filtering logic
- [ ] Create `src/hooks/useTaskFiltering.ts`
- [ ] Create `src/hooks/useNaturalLanguageParser.ts` (mock implementation)

### 10. React Query Integration
**Estimated Time: 1 day**

#### 10.1 Query Setup
- [ ] Configure React Query provider
- [ ] Set up query keys and factories
- [ ] Implement cache invalidation strategies
- [ ] Set up optimistic updates

#### 10.2 Query Hooks
- [ ] Create query hooks for all entities
- [ ] Implement mutation hooks with optimistic updates
- [ ] Set up background refetching
- [ ] Add error handling and retry logic

### 11. Component Testing Setup
**Estimated Time: 2 days**

#### 11.1 Testing Configuration
- [ ] Set up React Testing Library with TypeScript
- [ ] Configure MSW (Mock Service Worker) for API mocking
- [ ] Set up custom render helpers with providers
- [ ] Create testing utilities and helpers

#### 11.2 Component Tests
- [ ] Write tests for all UI components (80% coverage target)
- [ ] Test user interactions and state changes
- [ ] Test error handling and edge cases
- [ ] Test accessibility features

#### 11.3 Integration Tests
- [ ] Test complete user workflows
- [ ] Test Redux state management
- [ ] Test React Query integration
- [ ] Test routing and navigation

### 12. Performance Optimization
**Estimated Time: 1 day**

#### 12.1 React Optimization
- [ ] Implement React.memo for expensive components
- [ ] Use useMemo and useCallback appropriately
- [ ] Set up code splitting with React.lazy
- [ ] Optimize re-renders with proper dependency arrays

#### 12.2 Virtualization
- [ ] Implement virtual scrolling for large task lists
- [ ] Optimize image loading and caching
- [ ] Implement proper loading states
- [ ] Add performance monitoring

### 13. Development Tools & Quality
**Estimated Time: 0.5 days**

#### 13.1 Developer Experience
- [ ] Set up ESLint with TypeScript rules
- [ ] Configure Prettier for code formatting
- [ ] Set up Husky for git hooks
- [ ] Add bundle analyzer for optimization

#### 13.2 Debugging Tools
- [ ] Configure Redux DevTools
- [ ] Set up React DevTools Profiler
- [ ] Add React Query DevTools
- [ ] Create debug mode for development

## Deliverables
- Fully functional React application with TypeScript
- Complete component library
- Redux store with normalized state
- Service layer with mock implementations
- Comprehensive test suite (80% coverage)
- Performance optimized application

## Success Criteria
- [ ] All static HTML functionality converted to React
- [ ] TypeScript strict mode with no errors
- [ ] 80% test coverage on all components
- [ ] Redux state management working correctly
- [ ] Service layer ready for backend integration
- [ ] Performance metrics: < 2s initial load, < 100ms interaction response
- [ ] Accessibility compliance (WCAG 2.1 AA)

## Dependencies
- Completed Phase 1 static HTML
- React 18+ with TypeScript
- Redux Toolkit and React Query
- Testing frameworks and tools

## Risk Mitigation
- **Complexity Management**: Start with simple components, add complexity gradually
- **State Management**: Use normalized state to avoid deep nesting issues
- **Performance**: Profile early and implement optimizations incrementally
- **Testing**: Write tests alongside component development, not after

This phase creates a fully functional React application ready for backend integration in Phase 3.