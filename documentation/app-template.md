# Things 3 Clone - Complete Application Template

## Project Overview

This is a comprehensive Things 3 clone web application that combines the elegant simplicity of Things 3 with modern collaborative features. The app maintains the "invisible interface" philosophy while adding seamless team collaboration capabilities.

### Key Features
- **Individual Productivity**: Complete Things 3 feature parity with magic plus button, natural language parsing, and smart lists
- **Team Collaboration**: Real-time sharing, collaborative editing, and advanced permission systems
- **Modern Web Stack**: React + TypeScript frontend, C#/.NET backend, PostgreSQL on Supabase
- **Desktop-Quality UX**: Advanced drag-and-drop, keyboard shortcuts, and native-like performance

## Technical Architecture

### Frontend Stack
- **React 18+** with TypeScript for type safety
- **Tailwind CSS** for responsive design matching Things 3 aesthetic
- **Redux Toolkit** for state management
- **React Query** for server state management
- **@dnd-kit** for advanced drag-and-drop functionality
- **PWA** capabilities for offline functionality

### Backend Stack
- **C# .NET 8+** with minimal APIs
- **Entity Framework Core** for database operations
- **PostgreSQL** hosted on Supabase
- **Supabase Auth** for authentication
- **Supabase Realtime** for collaboration features
- **SignalR** for real-time notifications

### Database Schema
```sql
-- Core user and organization structure
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hierarchical task structure: Areas � Projects � Tasks
CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    notes TEXT,
    area_id UUID REFERENCES areas(id),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    notes TEXT,
    project_id UUID REFERENCES projects(id),
    area_id UUID REFERENCES areas(id),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active',
    priority INTEGER DEFAULT 0,
    start_date DATE,
    due_date DATE,
    completed_at TIMESTAMP WITH TIME ZONE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration and sharing
CREATE TABLE sharing_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(50) NOT NULL, -- 'area', 'project', 'task'
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    permission_level VARCHAR(50) NOT NULL, -- 'view', 'edit', 'admin'
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity tracking
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Component Architecture

### Core Components

#### Layout Components
```typescript
// src/components/Layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

// src/components/Layout/Sidebar.tsx
interface SidebarProps {
  selectedList: string;
  onListSelect: (listId: string) => void;
  areas: Area[];
  projects: Project[];
}

// src/components/Layout/MainContent.tsx
interface MainContentProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
```

#### Task Components
```typescript
// src/components/Tasks/TaskCard.tsx
interface TaskCardProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  collaborative?: boolean;
  currentUser?: User;
}

// src/components/Tasks/TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  allowDragDrop?: boolean;
}

// src/components/Tasks/MagicPlusButton.tsx
interface MagicPlusButtonProps {
  onCreateTask: (position?: { x: number; y: number }) => void;
  onCreateProject: () => void;
  onCreateHeading: () => void;
}
```

#### Collaboration Components
```typescript
// src/components/Collaboration/ShareDialog.tsx
interface ShareDialogProps {
  resourceType: 'area' | 'project' | 'task';
  resourceId: string;
  currentPermissions: Permission[];
  onShare: (email: string, permission: PermissionLevel) => void;
  onUpdatePermission: (userId: string, permission: PermissionLevel) => void;
}

// src/components/Collaboration/ActivityFeed.tsx
interface ActivityFeedProps {
  activities: Activity[];
  resourceId?: string;
  showUserAvatars?: boolean;
}

// src/components/Collaboration/CollaboratorsList.tsx
interface CollaboratorsListProps {
  collaborators: User[];
  currentUser: User;
  onRemoveCollaborator: (userId: string) => void;
}
```

## Design System Implementation

### Color System
```scss
// src/styles/colors.scss
:root {
  // Primary Colors
  --color-primary-blue: #007AFF;
  --color-primary-blue-light: #4A90E2;
  --color-primary-blue-pressed: #0051D5;
  
  // Secondary Colors
  --color-orange: #FF9500;
  --color-red: #FF3B30;
  --color-green: #34C759;
  --color-teal: #5AC8FA;
  --color-yellow: #FFCC00;
  --color-purple: #AF52DE;
  
  // Neutral Colors
  --color-white: #FFFFFF;
  --color-light-gray: #F2F2F7;
  --color-medium-gray: #E5E5EA;
  --color-dark-gray: #8E8E93;
  --color-charcoal: #3C3C43;
  --color-black: #000000;
  
  // Semantic Colors
  --color-success: #34C759;
  --color-warning: #FF9500;
  --color-error: #FF3B30;
  --color-info: #007AFF;
}
```

### Component Styles
```scss
// src/styles/components.scss
.sidebar {
  background: var(--color-light-gray);
  width: 240px;
  padding: 16px 0;
  border-right: 1px solid var(--color-medium-gray);
  
  .sidebar-item {
    padding: 4px 16px;
    color: var(--color-charcoal);
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    transition: background 150ms ease-in-out;
    
    &:hover {
      background: var(--color-medium-gray);
    }
    
    &.active {
      background: var(--color-white);
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
  }
}

.task-card {
  background: transparent;
  padding: 8px 0;
  min-height: 32px;
  display: flex;
  align-items: center;
  
  .task-checkbox {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--color-primary-blue);
    background: transparent;
    margin-right: 12px;
    cursor: pointer;
    
    &.checked {
      background: var(--color-primary-blue);
      border-color: var(--color-primary-blue);
    }
  }
  
  .task-text {
    font-size: 14px;
    font-weight: 400;
    color: var(--color-charcoal);
    line-height: 1.4;
    
    &.completed {
      color: var(--color-dark-gray);
      text-decoration: line-through;
    }
  }
}

.magic-plus-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-blue);
  color: var(--color-white);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,122,255,0.3);
  transition: all 150ms ease-in-out;
  
  &:hover {
    background: var(--color-primary-blue-pressed);
    transform: scale(1.05);
  }
}
```

## Smart Lists Implementation

### Today View
```typescript
// src/components/SmartLists/TodayView.tsx
interface TodayViewProps {
  tasks: Task[];
  calendarEvents: CalendarEvent[];
  onTaskUpdate: (task: Task) => void;
  onTaskCreate: (task: Partial<Task>) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  calendarEvents,
  onTaskUpdate,
  onTaskCreate
}) => {
  const todayTasks = tasks.filter(task => 
    isToday(task.start_date) || task.status === 'today'
  );
  
  const eveningTasks = tasks.filter(task => 
    task.status === 'evening' && isToday(task.start_date)
  );

  return (
    <div className="today-view">
      <div className="calendar-events">
        {calendarEvents.map(event => (
          <CalendarEventCard key={event.id} event={event} />
        ))}
      </div>
      
      <div className="today-tasks">
        <h3>Today</h3>
        <TaskList 
          tasks={todayTasks} 
          onTaskUpdate={onTaskUpdate}
          onTaskCreate={onTaskCreate}
          allowDragDrop={true}
        />
      </div>
      
      {eveningTasks.length > 0 && (
        <div className="evening-tasks">
          <h3>This Evening</h3>
          <TaskList 
            tasks={eveningTasks} 
            onTaskUpdate={onTaskUpdate}
            onTaskCreate={onTaskCreate}
            allowDragDrop={true}
          />
        </div>
      )}
    </div>
  );
};
```

### Upcoming View
```typescript
// src/components/SmartLists/UpcomingView.tsx
interface UpcomingViewProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onReschedule: (taskId: string, newDate: Date) => void;
}

export const UpcomingView: React.FC<UpcomingViewProps> = ({
  tasks,
  onTaskUpdate,
  onReschedule
}) => {
  const upcomingTasks = tasks.filter(task => 
    task.start_date && isFuture(task.start_date)
  );
  
  const groupedTasks = groupBy(upcomingTasks, task => 
    format(task.start_date, 'yyyy-MM-dd')
  );

  return (
    <div className="upcoming-view">
      {Object.entries(groupedTasks).map(([date, dateTasks]) => (
        <div key={date} className="date-group">
          <h3>{format(parseISO(date), 'EEEE, MMMM d')}</h3>
          <TaskList 
            tasks={dateTasks} 
            onTaskUpdate={onTaskUpdate}
            allowDragDrop={true}
            onDrop={(task, dropDate) => onReschedule(task.id, dropDate)}
          />
        </div>
      ))}
    </div>
  );
};
```

## Drag and Drop Implementation

### Advanced Drag and Drop Hook
```typescript
// src/hooks/useDragDrop.ts
interface DragDropConfig {
  onTaskMove: (taskId: string, destination: DropDestination) => void;
  onTaskReorder: (taskId: string, newIndex: number) => void;
  onCreateTask: (destination: DropDestination) => void;
  onCreateProject: (areaId?: string) => void;
}

interface DropDestination {
  type: 'list' | 'project' | 'area' | 'date';
  id: string;
  index?: number;
}

export const useDragDrop = (config: DragDropConfig) => {
  const [draggedItem, setDraggedItem] = useState<Task | null>(null);
  const [dropZones, setDropZones] = useState<DropZone[]>([]);
  
  const handleDragStart = (task: Task) => {
    setDraggedItem(task);
    // Highlight valid drop zones
    setDropZones(getValidDropZones(task));
  };
  
  const handleDragEnd = (destination: DropDestination) => {
    if (!draggedItem) return;
    
    switch (destination.type) {
      case 'list':
        config.onTaskMove(draggedItem.id, destination);
        break;
      case 'project':
        config.onTaskMove(draggedItem.id, destination);
        break;
      case 'date':
        config.onTaskMove(draggedItem.id, destination);
        break;
    }
    
    setDraggedItem(null);
    setDropZones([]);
  };
  
  return {
    draggedItem,
    dropZones,
    handleDragStart,
    handleDragEnd
  };
};
```

## Collaboration Features

### Real-time Sync Implementation
```typescript
// src/hooks/useRealTimeSync.ts
interface RealTimeSyncConfig {
  resourceType: 'area' | 'project' | 'task';
  resourceId: string;
  onUpdate: (data: any) => void;
  onDelete: (id: string) => void;
  onCollaboratorJoin: (user: User) => void;
  onCollaboratorLeave: (userId: string) => void;
}

export const useRealTimeSync = (config: RealTimeSyncConfig) => {
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    const channel = supabase.channel(`${config.resourceType}:${config.resourceId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: config.resourceType + 's'
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          config.onUpdate(payload.new);
        } else if (payload.eventType === 'DELETE') {
          config.onDelete(payload.old.id);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat() as User[];
        setCollaborators(users);
      })
      .subscribe();
    
    // Track user presence
    channel.track({
      user: getCurrentUser(),
      online_at: new Date().toISOString()
    });
    
    return () => {
      channel.unsubscribe();
    };
  }, [config.resourceId]);
  
  return { collaborators, isConnected };
};
```

### Sharing System
```typescript
// src/components/Collaboration/ShareDialog.tsx
interface ShareDialogProps {
  resourceType: 'area' | 'project' | 'task';
  resourceId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  resourceType,
  resourceId,
  isOpen,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<PermissionLevel>('view');
  const [currentPermissions, setCurrentPermissions] = useState<Permission[]>([]);
  
  const handleShare = async () => {
    await shareResource({
      resourceType,
      resourceId,
      email,
      permission
    });
    
    setEmail('');
    // Refresh permissions
    fetchPermissions();
  };
  
  const handleUpdatePermission = async (userId: string, newPermission: PermissionLevel) => {
    await updatePermission({
      userId,
      resourceType,
      resourceId,
      permission: newPermission
    });
    
    fetchPermissions();
  };
  
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="share-dialog">
        <h2>Share {resourceType}</h2>
        
        <div className="share-form">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value as PermissionLevel)}
          >
            <option value="view">Can View</option>
            <option value="edit">Can Edit</option>
            <option value="admin">Admin</option>
          </select>
          
          <button onClick={handleShare}>Share</button>
        </div>
        
        <div className="current-permissions">
          <h3>Current Access</h3>
          {currentPermissions.map(permission => (
            <div key={permission.user.id} className="permission-item">
              <span>{permission.user.name}</span>
              <select
                value={permission.level}
                onChange={(e) => handleUpdatePermission(
                  permission.user.id,
                  e.target.value as PermissionLevel
                )}
              >
                <option value="view">Can View</option>
                <option value="edit">Can Edit</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
```

## Natural Language Processing

### Date Parser Implementation
```typescript
// src/utils/dateParser.ts
interface ParsedDate {
  date: Date;
  hasTime: boolean;
  confidence: number;
}

export const parseNaturalLanguageDate = (input: string): ParsedDate | null => {
  const cleanInput = input.toLowerCase().trim();
  
  // Common shortcuts
  const shortcuts = {
    'tod': new Date(),
    'today': new Date(),
    'tom': addDays(new Date(), 1),
    'tomorrow': addDays(new Date(), 1),
    'next week': addDays(new Date(), 7),
    'next month': addMonths(new Date(), 1)
  };
  
  if (shortcuts[cleanInput]) {
    return {
      date: shortcuts[cleanInput],
      hasTime: false,
      confidence: 1.0
    };
  }
  
  // Day names
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = dayNames.findIndex(day => cleanInput.includes(day));
  
  if (dayIndex !== -1) {
    const targetDate = getNextDayOfWeek(new Date(), dayIndex);
    return {
      date: targetDate,
      hasTime: false,
      confidence: 0.9
    };
  }
  
  // Time parsing
  const timeMatch = cleanInput.match(/(\d{1,2})(:\d{2})?\s*(am|pm)/i);
  if (timeMatch) {
    const hour = parseInt(timeMatch[1]);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2].slice(1)) : 0;
    const isPM = timeMatch[3].toLowerCase() === 'pm';
    
    const date = new Date();
    date.setHours(isPM && hour !== 12 ? hour + 12 : hour, minutes, 0, 0);
    
    return {
      date,
      hasTime: true,
      confidence: 0.8
    };
  }
  
  // Fallback to date parsing libraries
  try {
    const parsedDate = parseDate(cleanInput);
    if (isValid(parsedDate)) {
      return {
        date: parsedDate,
        hasTime: cleanInput.includes(':'),
        confidence: 0.7
      };
    }
  } catch (error) {
    // Parsing failed
  }
  
  return null;
};
```

## Keyboard Shortcuts

### Global Shortcuts Implementation
```typescript
// src/hooks/useKeyboardShortcuts.ts
interface KeyboardShortcuts {
  [key: string]: () => void;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = [
        event.ctrlKey && 'ctrl',
        event.metaKey && 'meta',
        event.shiftKey && 'shift',
        event.altKey && 'alt',
        event.key.toLowerCase()
      ].filter(Boolean).join('+');
      
      if (shortcuts[key]) {
        event.preventDefault();
        shortcuts[key]();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Usage in main app
export const App: React.FC = () => {
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [selectedList, setSelectedList] = useState('today');
  
  useKeyboardShortcuts({
    'ctrl+space': () => setShowQuickEntry(true),
    'meta+space': () => setShowQuickEntry(true),
    'ctrl+1': () => setSelectedList('inbox'),
    'ctrl+2': () => setSelectedList('today'),
    'ctrl+3': () => setSelectedList('upcoming'),
    'ctrl+4': () => setSelectedList('anytime'),
    'ctrl+5': () => setSelectedList('someday'),
    'ctrl+k': () => setShowCommandPalette(true),
    'escape': () => {
      setShowQuickEntry(false);
      setShowCommandPalette(false);
    }
  });
  
  return (
    <div className="app">
      <AppLayout>
        <MainContent />
        {showQuickEntry && (
          <QuickEntry 
            onClose={() => setShowQuickEntry(false)}
            onSubmit={handleQuickTaskCreate}
          />
        )}
      </AppLayout>
    </div>
  );
};
```

## Performance Optimization

### Virtualization for Large Lists
```typescript
// src/components/Tasks/VirtualizedTaskList.tsx
interface VirtualizedTaskListProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  itemHeight: number;
  containerHeight: number;
}

export const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onTaskUpdate,
  itemHeight,
  containerHeight
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStartIndex = Math.floor(scrollTop / itemHeight);
  const visibleEndIndex = Math.min(
    visibleStartIndex + Math.ceil(containerHeight / itemHeight),
    tasks.length - 1
  );
  
  const visibleTasks = tasks.slice(visibleStartIndex, visibleEndIndex + 1);
  
  return (
    <div 
      className="virtualized-list"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: tasks.length * itemHeight }}>
        <div 
          style={{ 
            transform: `translateY(${visibleStartIndex * itemHeight}px)` 
          }}
        >
          {visibleTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onTaskUpdate}
              style={{ height: itemHeight }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

## Testing Strategy

### Component Testing
```typescript
// src/components/Tasks/__tests__/TaskCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    notes: 'Test notes',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  it('renders task title correctly', () => {
    render(<TaskCard task={mockTask} onUpdate={jest.fn()} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
  
  it('calls onUpdate when checkbox is clicked', () => {
    const mockOnUpdate = jest.fn();
    render(<TaskCard task={mockTask} onUpdate={mockOnUpdate} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockOnUpdate).toHaveBeenCalledWith({
      ...mockTask,
      status: 'completed'
    });
  });
  
  it('applies completed styles when task is completed', () => {
    const completedTask = { ...mockTask, status: 'completed' };
    render(<TaskCard task={completedTask} onUpdate={jest.fn()} />);
    
    const taskText = screen.getByText('Test Task');
    expect(taskText).toHaveClass('completed');
  });
});
```

### Integration Testing
```typescript
// src/components/SmartLists/__tests__/TodayView.integration.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodayView } from '../TodayView';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('TodayView Integration', () => {
  const queryClient = new QueryClient();
  
  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };
  
  it('displays today tasks and calendar events', async () => {
    const mockTasks = [
      { id: '1', title: 'Morning task', start_date: new Date() },
      { id: '2', title: 'Evening task', status: 'evening' }
    ];
    
    const mockEvents = [
      { id: '1', title: 'Meeting', start: new Date() }
    ];
    
    renderWithProvider(
      <TodayView
        tasks={mockTasks}
        calendarEvents={mockEvents}
        onTaskUpdate={jest.fn()}
        onTaskCreate={jest.fn()}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Morning task')).toBeInTheDocument();
      expect(screen.getByText('Evening task')).toBeInTheDocument();
      expect(screen.getByText('Meeting')).toBeInTheDocument();
    });
  });
});
```

## Deployment Configuration

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY ["TodoApp.Api/TodoApp.Api.csproj", "TodoApp.Api/"]
RUN dotnet restore "TodoApp.Api/TodoApp.Api.csproj"
COPY . .
WORKDIR "/src/TodoApp.Api"
RUN dotnet build "TodoApp.Api.csproj" -c Release -o /app/build

FROM backend-build AS publish
RUN dotnet publish "TodoApp.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=frontend-build /app/build ./wwwroot
ENTRYPOINT ["dotnet", "TodoApp.Api.dll"]
```

### Environment Configuration
```bash
# .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend environment
DATABASE_URL=postgresql://user:password@localhost:5432/todoapp
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-jwt-secret
```

## Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/collaborative-editing
git commit -m "Add real-time collaborative editing"
git push origin feature/collaborative-editing

# Create pull request
gh pr create --title "Add collaborative editing" --body "Implements real-time collaborative editing with conflict resolution"

# After review and tests pass
git checkout main
git merge feature/collaborative-editing
git push origin main
```

### Testing Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Lint and format
npm run lint
npm run format
```

## Success Metrics

### User Experience KPIs
- **Task Creation Speed**: < 3 seconds from thought to captured
- **App Launch Time**: < 1 second initial load
- **Real-time Sync Latency**: < 200ms for collaborative updates
- **Search Response Time**: < 100ms for real-time search

### Collaboration Metrics
- **Team Adoption Rate**: 70% of individual users upgrade to team features
- **Collaboration Engagement**: 5+ shared projects per team average
- **Real-time Usage**: 40% of edits during collaborative sessions
- **Invitation Success**: 85% acceptance rate within 48 hours

### Technical Performance
- **Uptime**: 99.9% availability
- **API Response Time**: 95th percentile < 500ms
- **Database Performance**: Support 100,000+ tasks per organization
- **Mobile Performance**: 60 FPS on mobile devices

This comprehensive template provides the foundation for building a Things 3 clone with advanced collaborative features while maintaining the elegant simplicity and performance that makes Things 3 exceptional.