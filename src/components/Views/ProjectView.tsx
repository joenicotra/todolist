import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectTasksByProject } from '../../store/selectors';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';

interface ProjectViewProps {
  projectId: string;
}

const ProjectView: React.FC<ProjectViewProps> = ({ projectId }) => {
  const project = useAppSelector(state => state.projects.byId[projectId]);
  const projectTasks = useAppSelector(state => selectTasksByProject(state, projectId));
  const area = useAppSelector(state => 
    project?.area_id ? state.areas.byId[project.area_id] : undefined
  );
  
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium mb-2 text-gray-900">
          Project not found
        </h2>
        <p className="text-sm text-gray-500">
          The requested project could not be found.
        </p>
      </div>
    );
  }

  const completedTasks = projectTasks.filter(task => task.status === 'completed');
  const activeTasks = projectTasks.filter(task => task.status === 'active');
  const progressPercentage = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Project header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">{project.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              {area && (
                <span className="text-sm text-gray-500">
                  in {area.name}
                </span>
              )}
              <span className="text-sm text-gray-500">
                {activeTasks.length} active, {completedTasks.length} completed
              </span>
              {projectTasks.length > 0 && (
                <span className="text-sm text-gray-500">
                  {progressPercentage}% complete
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {projectTasks.length > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Project notes */}
        {project.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{project.notes}</p>
          </div>
        )}
      </div>

      {/* Active tasks */}
      {activeTasks.length > 0 && (
        <TaskGroup
          title={`Active Tasks (${activeTasks.length})`}
          tasks={activeTasks}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
          enableDragAndDrop={true}
        />
      )}

      {/* Completed tasks */}
      {completedTasks.length > 0 && (
        <TaskGroup
          title={`Completed Tasks (${completedTasks.length})`}
          tasks={completedTasks}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          enableBulkOperations={true}
        />
      )}

      {projectTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No tasks in {project.name}
          </h2>
          <p className="text-sm text-gray-500">
            Create your first task to get started on this project.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectView;