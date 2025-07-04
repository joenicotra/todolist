# Phase 4: Backend APIs & Database Implementation

## Overview
Implement the complete backend system including C# .NET APIs, PostgreSQL database schema, real-time functionality with Supabase, and all necessary service endpoints. This phase creates the data foundation for the entire application.

## Prerequisites
- Completed Phase 3 authentication system
- Supabase project with auth configured
- C# .NET 8+ development environment
- Reference `/documentation/design/complete-app-template.md` for backend architecture

## Task Breakdown

### 1. Database Schema Implementation
**Estimated Time: 2 days**

#### 1.1 Supabase Database Setup
- [ ] Create complete database schema in Supabase SQL editor:
  ```sql
  -- Users table (extends Supabase auth.users)
  CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Organizations table
  CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Areas table
  CREATE TABLE areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Projects table
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

  -- Tasks table
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

  -- Tags table
  CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7),
    organization_id UUID REFERENCES organizations(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Task-Tag relationship table
  CREATE TABLE task_tags (
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, tag_id)
  );

  -- Sharing permissions table
  CREATE TABLE sharing_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(50) NOT NULL, -- 'area', 'project', 'task'
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    permission_level VARCHAR(50) NOT NULL, -- 'view', 'edit', 'admin'
    granted_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Activity log for collaboration
  CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Comments table
  CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    resource_type VARCHAR(50) NOT NULL, -- 'task', 'project'
    resource_id UUID NOT NULL,
    user_id UUID REFERENCES users(id),
    parent_comment_id UUID REFERENCES comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ```

#### 1.2 Indexes and Performance Optimization
- [ ] Create indexes for frequently queried fields:
  ```sql
  CREATE INDEX idx_tasks_organization_id ON tasks(organization_id);
  CREATE INDEX idx_tasks_project_id ON tasks(project_id);
  CREATE INDEX idx_tasks_area_id ON tasks(area_id);
  CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
  CREATE INDEX idx_tasks_start_date ON tasks(start_date);
  CREATE INDEX idx_tasks_due_date ON tasks(due_date);
  CREATE INDEX idx_tasks_status ON tasks(status);
  CREATE INDEX idx_activity_log_resource ON activity_log(resource_type, resource_id);
  CREATE INDEX idx_sharing_permissions_resource ON sharing_permissions(resource_type, resource_id);
  ```

#### 1.3 Database Functions and Triggers
- [ ] Create updated_at trigger function:
  ```sql
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
  ```
- [ ] Add triggers to all tables with updated_at columns
- [ ] Create function for activity logging
- [ ] Implement soft delete functionality

### 2. Row Level Security (RLS) Implementation
**Estimated Time: 1 day**

#### 2.1 Enable RLS on All Tables
- [ ] Enable RLS on all data tables:
  ```sql
  ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
  ALTER TABLE sharing_permissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
  ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
  ```

#### 2.2 Create Security Policies
- [ ] Implement user-based access policies:
  ```sql
  -- Users can only see organizations they belong to
  CREATE POLICY "Users can view their organizations" ON organizations
    FOR SELECT USING (
      owner_id = auth.uid() OR 
      id IN (
        SELECT organization_id FROM sharing_permissions 
        WHERE user_id = auth.uid()
      )
    );

  -- Users can only see tasks in their organizations
  CREATE POLICY "Users can view tasks in their organizations" ON tasks
    FOR SELECT USING (
      organization_id IN (
        SELECT id FROM organizations WHERE 
        owner_id = auth.uid() OR 
        id IN (SELECT organization_id FROM sharing_permissions WHERE user_id = auth.uid())
      )
    );
  ```
- [ ] Create policies for areas, projects, tags
- [ ] Implement sharing-based access policies
- [ ] Create policies for comments and activity logs

#### 2.3 Test Security Policies
- [ ] Test user isolation between organizations
- [ ] Test sharing permissions at different levels
- [ ] Verify no unauthorized data access
- [ ] Test edge cases and error scenarios

### 3. C# .NET API Project Setup
**Estimated Time: 1 day**

#### 3.1 Project Structure Setup
- [ ] Create new .NET 8 Web API project
- [ ] Set up solution structure:
  ```
  TodoApp/
    TodoApp.Api/          # Main API project
    TodoApp.Core/         # Domain models and interfaces
    TodoApp.Infrastructure/ # Data access and external services
    TodoApp.Tests/        # Unit and integration tests
  ```

#### 3.2 Core Dependencies
- [ ] Install essential packages:
  ```xml
  <PackageReference Include="Supabase" Version="0.13.3" />
  <PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="8.0.0" />
  <PackageReference Include="Microsoft.EntityFrameworkCore.Design" Version="8.0.0" />
  <PackageReference Include="AutoMapper" Version="12.0.1" />
  <PackageReference Include="FluentValidation" Version="11.8.1" />
  <PackageReference Include="Serilog.AspNetCore" Version="8.0.0" />
  <PackageReference Include="Swashbuckle.AspNetCore" Version="6.5.0" />
  <PackageReference Include="Microsoft.AspNetCore.Authentication.JwtBearer" Version="8.0.0" />
  ```

#### 3.3 Configuration Setup
- [ ] Configure appsettings.json:
  ```json
  {
    "ConnectionStrings": {
      "DefaultConnection": "Host=db.supabase.co;Database=postgres;Username=postgres;Password=your-password"
    },
    "Supabase": {
      "Url": "https://your-project.supabase.co",
      "Key": "your-anon-key",
      "ServiceKey": "your-service-role-key"
    },
    "Jwt": {
      "Issuer": "https://your-project.supabase.co/auth/v1",
      "Audience": "authenticated"
    }
  }
  ```

### 4. Domain Models and DTOs
**Estimated Time: 1 day**

#### 4.1 Core Domain Models
- [ ] Create `TodoApp.Core/Models/` with domain entities:
  ```csharp
  public class User
  {
      public Guid Id { get; set; }
      public string Email { get; set; } = string.Empty;
      public string Name { get; set; } = string.Empty;
      public string? AvatarUrl { get; set; }
      public DateTime CreatedAt { get; set; }
      public DateTime UpdatedAt { get; set; }
  }

  public class Organization
  {
      public Guid Id { get; set; }
      public string Name { get; set; } = string.Empty;
      public Guid OwnerId { get; set; }
      public User Owner { get; set; } = null!;
      public List<Area> Areas { get; set; } = new();
      public DateTime CreatedAt { get; set; }
      public DateTime UpdatedAt { get; set; }
  }

  public class Task
  {
      public Guid Id { get; set; }
      public string Title { get; set; } = string.Empty;
      public string? Notes { get; set; }
      public Guid? ProjectId { get; set; }
      public Project? Project { get; set; }
      public Guid? AreaId { get; set; }
      public Area? Area { get; set; }
      public Guid OrganizationId { get; set; }
      public Organization Organization { get; set; } = null!;
      public Guid CreatedBy { get; set; }
      public User Creator { get; set; } = null!;
      public Guid? AssignedTo { get; set; }
      public User? Assignee { get; set; }
      public TaskStatus Status { get; set; }
      public int Priority { get; set; }
      public DateTime? StartDate { get; set; }
      public DateTime? DueDate { get; set; }
      public DateTime? CompletedAt { get; set; }
      public int SortOrder { get; set; }
      public List<Tag> Tags { get; set; } = new();
      public DateTime CreatedAt { get; set; }
      public DateTime UpdatedAt { get; set; }
  }
  ```

#### 4.2 Data Transfer Objects (DTOs)
- [ ] Create request/response DTOs:
  ```csharp
  public record CreateTaskRequest(
      string Title,
      string? Notes,
      Guid? ProjectId,
      Guid? AreaId,
      DateTime? StartDate,
      DateTime? DueDate,
      List<Guid>? TagIds
  );

  public record UpdateTaskRequest(
      string? Title,
      string? Notes,
      Guid? ProjectId,
      Guid? AreaId,
      TaskStatus? Status,
      int? Priority,
      DateTime? StartDate,
      DateTime? DueDate,
      Guid? AssignedTo,
      List<Guid>? TagIds
  );

  public record TaskResponse(
      Guid Id,
      string Title,
      string? Notes,
      ProjectResponse? Project,
      AreaResponse? Area,
      UserResponse Creator,
      UserResponse? Assignee,
      TaskStatus Status,
      int Priority,
      DateTime? StartDate,
      DateTime? DueDate,
      DateTime? CompletedAt,
      List<TagResponse> Tags,
      DateTime CreatedAt,
      DateTime UpdatedAt
  );
  ```

#### 4.3 AutoMapper Configuration
- [ ] Set up AutoMapper profiles for model-DTO mapping
- [ ] Configure complex mappings with custom resolvers
- [ ] Handle nested object mapping
- [ ] Set up validation for mapping operations

### 5. Entity Framework Configuration
**Estimated Time: 1 day**

#### 5.1 DbContext Setup
- [ ] Create `TodoApp.Infrastructure/Data/TodoDbContext.cs`:
  ```csharp
  public class TodoDbContext : DbContext
  {
      public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options) { }

      public DbSet<User> Users { get; set; }
      public DbSet<Organization> Organizations { get; set; }
      public DbSet<Area> Areas { get; set; }
      public DbSet<Project> Projects { get; set; }
      public DbSet<Task> Tasks { get; set; }
      public DbSet<Tag> Tags { get; set; }
      public DbSet<SharingPermission> SharingPermissions { get; set; }
      public DbSet<ActivityLog> ActivityLogs { get; set; }
      public DbSet<Comment> Comments { get; set; }

      protected override void OnModelCreating(ModelBuilder modelBuilder)
      {
          // Configure entity relationships and constraints
      }
  }
  ```

#### 5.2 Entity Configurations
- [ ] Configure entity relationships and constraints
- [ ] Set up foreign key relationships
- [ ] Configure indexes and unique constraints
- [ ] Set up value conversions for enums

#### 5.3 Repository Pattern Implementation
- [ ] Create generic repository interface and implementation
- [ ] Implement specific repositories for each entity
- [ ] Add unit of work pattern
- [ ] Set up async/await patterns throughout

### 6. Authentication Middleware
**Estimated Time: 0.5 days**

#### 6.1 JWT Authentication Setup
- [ ] Configure JWT authentication with Supabase
- [ ] Set up JWT token validation
- [ ] Implement user context extraction from JWT
- [ ] Add authorization policies

#### 6.2 Middleware Implementation
- [ ] Create user context middleware
- [ ] Implement organization context resolution
- [ ] Add request logging middleware
- [ ] Set up error handling middleware

### 7. API Controllers Implementation
**Estimated Time: 3 days**

#### 7.1 Tasks Controller
- [ ] Create `TodoApp.Api/Controllers/TasksController.cs`:
  ```csharp
  [ApiController]
  [Route("api/[controller]")]
  [Authorize]
  public class TasksController : ControllerBase
  {
      [HttpGet]
      public async Task<ActionResult<List<TaskResponse>>> GetTasks(
          [FromQuery] TaskFilters filters)
      
      [HttpPost]
      public async Task<ActionResult<TaskResponse>> CreateTask(
          CreateTaskRequest request)
      
      [HttpPut("{id}")]
      public async Task<ActionResult<TaskResponse>> UpdateTask(
          Guid id, UpdateTaskRequest request)
      
      [HttpDelete("{id}")]
      public async Task<IActionResult> DeleteTask(Guid id)
      
      [HttpPost("bulk")]
      public async Task<ActionResult<List<TaskResponse>>> BulkUpdateTasks(
          BulkUpdateTasksRequest request)
  }
  ```

#### 7.2 Projects Controller
- [ ] Implement full CRUD operations
- [ ] Add project completion functionality
- [ ] Implement project task management
- [ ] Add project sharing endpoints

#### 7.3 Areas Controller
- [ ] Implement area management
- [ ] Add area-project relationships
- [ ] Implement area sharing
- [ ] Add area statistics endpoints

#### 7.4 Organizations Controller
- [ ] Implement organization management
- [ ] Add member management
- [ ] Implement organization settings
- [ ] Add organization statistics

#### 7.5 Tags Controller
- [ ] Implement tag CRUD operations
- [ ] Add tag assignment/removal
- [ ] Implement tag hierarchies
- [ ] Add tag usage statistics

#### 7.6 Collaboration Controllers
- [ ] Create sharing management endpoints
- [ ] Implement activity feed endpoints
- [ ] Add comment management
- [ ] Create notification endpoints

### 8. Service Layer Implementation
**Estimated Time: 2 days**

#### 8.1 Business Logic Services
- [ ] Create `ITaskService` and implementation:
  ```csharp
  public interface ITaskService
  {
      Task<List<TaskResponse>> GetTasksAsync(Guid organizationId, TaskFilters filters);
      Task<TaskResponse> CreateTaskAsync(Guid organizationId, CreateTaskRequest request);
      Task<TaskResponse> UpdateTaskAsync(Guid taskId, UpdateTaskRequest request);
      Task DeleteTaskAsync(Guid taskId);
      Task<List<TaskResponse>> BulkUpdateTasksAsync(BulkUpdateTasksRequest request);
      Task<List<TaskResponse>> GetTasksBySmartListAsync(SmartListType listType);
  }
  ```

#### 8.2 Smart Lists Service
- [ ] Implement smart list filtering logic:
  - Today: Tasks scheduled for today + overdue
  - Upcoming: Future scheduled tasks grouped by date
  - Anytime: Tasks without specific dates
  - Someday: Tasks marked for future consideration
  - Inbox: Unprocessed tasks
  - Logbook: Completed tasks archive

#### 8.3 Collaboration Service
- [ ] Implement sharing management
- [ ] Add real-time notification logic
- [ ] Create activity logging service
- [ ] Implement permission checking

#### 8.4 Validation Services
- [ ] Implement FluentValidation validators
- [ ] Add business rule validation
- [ ] Create custom validation attributes
- [ ] Set up validation pipelines

### 9. Real-time Functionality with Supabase
**Estimated Time: 1.5 days**

#### 9.1 Supabase Realtime Setup
- [ ] Configure Supabase Realtime on database tables
- [ ] Set up WebSocket connections
- [ ] Implement real-time event handling
- [ ] Add connection management

#### 9.2 Real-time Events
- [ ] Implement task creation/update/deletion events
- [ ] Add project and area change events
- [ ] Create collaboration events (comments, sharing)
- [ ] Set up presence indicators

#### 9.3 SignalR Integration (Optional)
- [ ] Set up SignalR hubs for additional real-time features
- [ ] Implement custom real-time notifications
- [ ] Add user presence tracking
- [ ] Create real-time collaboration cursors

### 10. API Testing & Documentation
**Estimated Time: 2 days**

#### 10.1 Unit Tests
- [ ] Test all service layer methods
- [ ] Test repository implementations
- [ ] Test AutoMapper configurations
- [ ] Test validation logic

#### 10.2 Integration Tests
- [ ] Test API endpoints with database
- [ ] Test authentication and authorization
- [ ] Test real-time functionality
- [ ] Test error handling scenarios

#### 10.3 API Documentation
- [ ] Configure Swagger/OpenAPI
- [ ] Add comprehensive API documentation
- [ ] Create example requests/responses
- [ ] Add authentication documentation

### 11. Performance Optimization
**Estimated Time: 1 day**

#### 11.1 Database Optimization
- [ ] Implement efficient querying patterns
- [ ] Add database query optimization
- [ ] Implement caching strategies
- [ ] Add connection pooling

#### 11.2 API Performance
- [ ] Implement response caching
- [ ] Add compression middleware
- [ ] Optimize serialization
- [ ] Add performance monitoring

### 12. Error Handling & Logging
**Estimated Time: 0.5 days**

#### 12.1 Global Error Handling
- [ ] Implement global exception handler
- [ ] Add proper error response format
- [ ] Set up error logging with Serilog
- [ ] Add request/response logging

#### 12.2 Monitoring
- [ ] Set up application insights
- [ ] Add performance counters
- [ ] Implement health checks
- [ ] Create monitoring dashboards

## Deliverables
- Complete PostgreSQL database schema in Supabase
- C# .NET 8 Web API with all endpoints
- Row Level Security policies implemented
- Real-time functionality with Supabase
- Comprehensive API documentation
- Unit and integration test suite (80% coverage)
- Performance optimized backend

## Success Criteria
- [ ] All database tables created with proper relationships
- [ ] RLS policies protecting user data correctly
- [ ] All API endpoints functional and documented
- [ ] Real-time updates working across clients
- [ ] 80% test coverage on backend code
- [ ] API response times under 500ms (95th percentile)
- [ ] Database queries optimized for performance
- [ ] Authentication and authorization working correctly
- [ ] Error handling providing useful feedback

## Dependencies
- Completed Phase 3 authentication
- Supabase project with database access
- C# .NET 8 development environment
- Entity Framework tooling

## Risk Mitigation
- **Database Performance**: Monitor query performance from the start
- **Security**: Test RLS policies thoroughly with real user scenarios
- **Real-time Complexity**: Start with simple real-time features, add complexity gradually
- **API Design**: Use OpenAPI spec to validate API design before implementation
- **Testing**: Write tests alongside implementation, not after

This phase creates a robust, scalable backend that supports both individual productivity and team collaboration features.