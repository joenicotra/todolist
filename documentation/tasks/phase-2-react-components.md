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

### 4. Service Layer Implementation ✅
**Estimated Time: 2 days** | **Completed: 2025-01-06**

#### 4.1 Base Service Setup
- [x] Create `src/services/api.ts` with base API configuration
- [x] Set up request/response interceptors
- [x] Implement error handling and retry logic
- [x] Create type-safe API client

#### 4.2 Mock Service Implementation
- [x] Create `src/services/mock/` folder for development
- [x] Implement mock data generators
- [x] Create mock API responses with realistic delays
- [x] Set up localStorage persistence for development

#### 4.3 Service Interfaces
- [x] Create `src/services/authService.ts`:
  ```typescript
  interface AuthService {
    login(email: string, password: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    refreshToken(): Promise<string>;
  }
  ```
- [x] Create `src/services/taskService.ts`:
  ```typescript
  interface TaskService {
    getTasks(filters?: TaskFilters): Promise<Task[]>;
    createTask(task: CreateTaskRequest): Promise<Task>;
    updateTask(id: string, updates: UpdateTaskRequest): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    bulkUpdate(updates: BulkUpdateRequest[]): Promise<Task[]>;
  }
  ```
- [x] Create `src/services/projectService.ts`
- [x] Create `src/services/areaService.ts`
- [x] Create `src/services/collaborationService.ts`

### 5. Layout Components ✅
**Estimated Time: 2 days** | **Completed: 2025-01-07**

#### 5.1 App Layout Component
- [x] Create `src/components/Layout/AppLayout.tsx`:
  - Main application shell
  - Sidebar integration
  - Main content area
  - Responsive behavior
- [x] Convert static CSS to component-scoped styles
- [x] Implement proper TypeScript props interface
- [x] Add error boundaries

#### 5.2 Sidebar Component
- [x] Create `src/components/Layout/Sidebar.tsx`:
  - Smart lists rendering
  - Areas and projects hierarchy
  - Active state management
  - Click handlers for navigation
- [x] Implement sidebar item components
- [x] Add proper keyboard navigation
- [x] Set up responsive collapse behavior

#### 5.3 Main Content Component
- [x] Create `src/components/Layout/MainContent.tsx`:
  - Dynamic content rendering based on route
  - Header with title and actions
  - Scrollable content area
  - Empty state handling

#### 5.4 Navigation Logic
- [x] Set up Redux-based navigation system
- [x] Implement navigation handlers
- [x] Connect sidebar navigation to view switching
- [x] Implement functional smart list filtering
- [x] Create view-based component rendering
- [x] Add current view state management

### 6. Task Components ✅
**Estimated Time: 3 days** | **Completed: 2025-01-08**

#### 6.1 Task Card Component
- [x] Create `src/components/Task/Task.tsx`:
  ```typescript
  interface TaskProps {
    id: string;
    title: string;
    completed: boolean;
    onToggle: (id: string) => void;
    notes?: string | undefined;
  }
  ```
- [x] Implement checkbox functionality with Lucide React icons
- [x] Create hover states and interactions
- [x] Add proper task completion styling
- [x] Add inline editing capabilities
- [x] Add keyboard shortcuts (Enter to edit, Escape to cancel)

#### 6.2 Task List Component
- [x] Create `src/components/Task/TaskGroup.tsx`:
  - Task grouping with section headers
  - Blue header styling matching design
  - More actions button integration
  - Task organization by categories
- [x] Implement proper task rendering
- [x] Add task interaction handling
- [x] Add drag-and-drop integration
- [x] Fix task completion state updates with Redux integration
- [x] Connect task actions to Redux store properly
- [ ] Add virtualized list for performance
- [x] Add bulk operations
- [x] Create task creation inline

#### 6.3 Task Details Component
- [x] Create task editing functionality:
  - Inline editing for title and notes
  - Keyboard shortcuts (Enter/Escape)
  - Task completion animations
  - Context-aware task creation
- [ ] Advanced features (future enhancement):
  - Rich text notes
  - Tag management
  - Date/time pickers
  - Checklist functionality

#### 6.4 Quick Entry Component
- [x] Create `src/components/ui/QuickEntryModal.tsx`:
  - Global quick entry modal
  - Context-aware task creation
  - Smart defaults based on current context
  - Integration with + button
- [ ] Future enhancements:
  - Natural language parsing integration
  - Keyboard shortcuts (Ctrl/Cmd + Space)

### 7. Smart Lists Components ✅
**Estimated Time: 2.5 days** | **Completed: 2025-01-08**

#### 7.1 Today View
- [x] Create `src/components/SmartLists/TodayView.tsx`:
  - Today tasks section with proper filtering
  - Overdue task handling
  - Task completion functionality
- [x] Implement date-based filtering
- [ ] Add calendar events integration (future enhancement)
- [ ] Add task rescheduling functionality (future enhancement)

#### 7.2 Upcoming View
- [x] Create `src/components/SmartLists/UpcomingView.tsx`:
  - Date-grouped task sections
  - Proper upcoming task filtering
  - Task completion functionality
- [ ] Add collapsible date headers (future enhancement)
- [ ] Add drag-to-reschedule functionality (future enhancement)
- [ ] Add week/month view options (future enhancement)

#### 7.3 Inbox View
- [x] Create `src/components/SmartLists/InboxView.tsx`:
  - Unprocessed task list with proper filtering
  - Task completion functionality
  - Integration with task creation
- [ ] Add quick processing actions (future enhancement)
- [ ] Add bulk organization tools (future enhancement)

#### 7.4 Other Smart Lists
- [x] Create `AnytimeView.tsx`, `SomedayView.tsx`, `LogbookView.tsx`, `TrashView.tsx`
- [x] Implement view-specific behaviors and filtering
- [x] Add appropriate filtering and sorting

### 8. UI Components ✅
**Estimated Time: 2 days** | **Completed: 2025-01-08**

#### 8.1 Form Components
- [x] Create `src/components/ui/Modal.tsx` with backdrop and keyboard handling
- [x] Create form inputs integrated into modals
- [x] Create dropdown components with proper styling
- [ ] Create standalone `Input.tsx` with variants (future enhancement)
- [ ] Create standalone `Button.tsx` with variants (future enhancement)
- [ ] Create `Select.tsx` and `DatePicker.tsx` (future enhancement)

#### 8.2 Interactive Components
- [x] Create `src/components/ui/NewListDropdown.tsx`
- [x] Create checkbox functionality integrated in task components
- [x] Create `src/components/ui/DarkModeToggle.tsx`
- [x] Create `src/components/ui/ProjectProgressIcon.tsx`
- [ ] Create `LoadingSpinner.tsx` and `Toast.tsx` (future enhancement)

#### 8.3 Magic Plus Button
- [x] Implement Magic Plus Button functionality:
  - Floating action button in MainContent
  - Context-aware creation via QuickEntryModal
  - Proper styling and positioning
- [ ] Add drag-and-drop functionality (future enhancement)
- [ ] Add advanced animation states (future enhancement)

### 9. Custom Hooks ✅
**Estimated Time: 1.5 days** | **Completed: 2025-01-08**

#### 9.1 Data Hooks
- [x] Create `src/hooks/useTaskActions.ts`:
  - Task CRUD operations
  - Redux integration
  - Error handling
  - State management
- [x] Create data access hooks via Redux selectors
- [ ] Create `useProjects.ts` and `useAreas.ts` (using Redux directly)

#### 9.2 UI Hooks
- [x] Implement keyboard shortcuts in components (Enter/Escape)
- [x] Implement localStorage via Redux persistence
- [x] Implement click outside functionality in dropdowns
- [x] Implement debouncing where needed
- [ ] Create standalone hook files (using inline implementations)

#### 9.3 Business Logic Hooks
- [x] Implement smart list filtering via Redux selectors
- [x] Implement task filtering logic in smart list components
- [ ] Create `useNaturalLanguageParser.ts` (future enhancement)

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

### 13. Critical Bug Fixes ✅
**Estimated Time: 1 day** | **Completed: 2025-01-08**

#### 13.1 Task Interaction Bugs
- [x] Fix task checkbox completion with proper Redux state management
- [x] Verify task editing functionality works with inline editing
- [x] Test task creation workflow with QuickEntryModal
- [x] Implement task completion animations

#### 13.2 Navigation Bugs  
- [x] Fix sidebar navigation with proper view switching
- [x] Implement actual view switching logic via Redux
- [x] Connect Redux UI state to view rendering
- [x] Test all smart list filters work correctly

#### 13.3 Integration Testing
- [x] Test complete user workflows end-to-end
- [x] Verify all interactive elements respond properly
- [x] Ensure TypeScript strict mode compliance
- [ ] Test responsive design on different screen sizes (future enhancement)
- [ ] Validate accessibility with screen readers (future enhancement)

### 14. Enhanced UI Features & Functionality ✅
**Estimated Time: 3 days** | **Completed: 2025-01-08**

#### 14.1 New List Creation
- [x] Add "New List" button in lower left corner
- [x] Implement dropdown menu for adding area or project
- [x] Style dropdown to match Things 3 design
- [x] Connect dropdown actions to Redux store

#### 14.2 Navigation Improvements
- [x] Fix area view → project navigation (clicking project navigates to project view)
- [x] Implement AreaView and ProjectView components with proper navigation
- [x] Test all navigation paths work correctly
- [ ] Add breadcrumb navigation for deep views (future enhancement)

#### 14.3 Enhanced Task Interactions
- [x] Make + button in lower right functional
- [x] Implement task completion animation:
  - Click task → gray out and strike through text
  - Wait 3 seconds
  - Ease out from view with smooth animation
- [x] Add proper task completion state management
- [x] Test task completion workflow end-to-end

#### 14.4 Project Progress Indicators
- [x] Add project completion status indicator in sidebar
- [x] Implement circular icon with stroke fill based on completion percentage
- [x] Change icon to green when 100% complete with check functionality
- [x] Make sidebar indicators properly sized for sidebar
- [x] Calculate completion percentage from associated tasks
- [ ] Add project progress indicator in main content area (future enhancement)

#### 14.5 Dark Mode Implementation
- [x] Implement dark mode toggle component
- [x] Create dark mode color palette matching Things 3
- [x] Add dark mode styles to all components with CSS variables
- [x] Store dark mode preference in localStorage
- [x] Add smooth transitions between light/dark modes
- [x] Test dark mode across all views and components

### 15. Development Tools & Quality
**Estimated Time: 0.5 days**

#### 15.1 Developer Experience
- [ ] Set up ESLint with TypeScript rules
- [ ] Configure Prettier for code formatting
- [ ] Set up Husky for git hooks
- [ ] Add bundle analyzer for optimization

#### 15.2 Debugging Tools
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
- [x] All static HTML functionality converted to React
- [x] TypeScript strict mode with no errors
- [x] Redux state management working correctly
- [x] Service layer ready for backend integration
- [x] Layout components fully functional with proper styling
- [x] Task components with interactive functionality and animations
- [x] Functional navigation between smart lists and views
- [x] Enhanced UI features (New List, Progress Indicators, Dark Mode)
- [x] 34 passing tests with React Testing Library
- [x] Production build optimization (108.16 kB gzipped)
- [ ] **PARTIAL:** 80% test coverage on all components (good coverage, room for expansion)
- [ ] **NOT TESTED:** Performance metrics: < 2s initial load, < 100ms interaction response
- [ ] **NOT TESTED:** Accessibility compliance (WCAG 2.1 AA)

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