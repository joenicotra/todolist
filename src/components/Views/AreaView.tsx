import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { selectTasksByArea } from '../../store/selectors/taskSelectors';
import { setCurrentView } from '../../store/slices/ui';
import { TaskGroup } from '../Task';
import { useTaskActions } from '../../hooks/useTaskActions';
import ProjectProgressIcon from '../ui/ProjectProgressIcon';

interface AreaViewProps {
  areaId: string;
}

const AreaView: React.FC<AreaViewProps> = ({ areaId }) => {
  const dispatch = useAppDispatch();
  const area = useAppSelector(state => state.areas.byId[areaId]);
  const areaTasks = useAppSelector(state => selectTasksByArea(state, areaId));
  const allTasks = useAppSelector(state => state.tasks);
  const areaProjects = useAppSelector(state => 
    state.projects.allIds
      .map(id => state.projects.byId[id])
      .filter((project): project is NonNullable<typeof project> => 
        project !== undefined && project.area_id === areaId
      )
  );
  
  const { handleToggleTask, handleUpdateTask, handleCreateTask } = useTaskActions();

  // Helper function to calculate project completion percentage
  const getProjectCompletion = (projectId: string) => {
    const tasks = allTasks.allIds
      .map(id => allTasks.byId[id])
      .filter((task): task is NonNullable<typeof task> => 
        task !== undefined && task.project_id === projectId
      );
    
    if (tasks.length === 0) return { percentage: 0, isCompleted: false };
    
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const percentage = Math.round((completedTasks.length / tasks.length) * 100);
    const isCompleted = percentage === 100;
    
    return { percentage, isCompleted };
  };

  const handleProjectClick = (projectId: string) => {
    dispatch(setCurrentView({ view: `project-${projectId}` }));
  };

  if (!area) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium mb-2 text-gray-900">
          Area not found
        </h2>
        <p className="text-sm text-gray-500">
          The requested area could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Area header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{area.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {areaProjects.length} project{areaProjects.length !== 1 ? 's' : ''}, {areaTasks.length} task{areaTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Projects in this area */}
      {areaProjects.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Projects</h2>
          <div className="grid gap-2">
            {areaProjects.map(project => {
              const completion = getProjectCompletion(project.id);
              return (
                <div 
                  key={project.id} 
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="flex items-center gap-3">
                    <ProjectProgressIcon
                      completionPercentage={completion.percentage}
                      size="lg"
                      isCompleted={completion.isCompleted}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{project.name}</h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {completion.percentage}%
                        </span>
                      </div>
                      {project.notes && (
                        <p className="text-sm text-gray-500 mt-1">{project.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tasks in this area */}
      {areaTasks.length > 0 && (
        <TaskGroup
          title={`Tasks in ${area.name}`}
          tasks={areaTasks}
          onToggleTask={handleToggleTask}
          onUpdateTask={handleUpdateTask}
          onCreateTask={handleCreateTask}
          enableInlineCreation={true}
          enableBulkOperations={true}
          enableDragAndDrop={true}
        />
      )}

      {areaTasks.length === 0 && areaProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
          </div>
          <h2 className="text-lg font-medium mb-2 text-gray-900">
            No tasks or projects in {area.name}
          </h2>
          <p className="text-sm text-gray-500">
            Create your first task or project to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default AreaView;