import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCurrentView } from '../../store/slices/ui';
import SidebarItem from './SidebarItem';
import SidebarSection from './SidebarSection';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isMobile, onClose }) => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector(state => state.ui.navigation);
  const { byId: areasById, allIds: areaIds } = useAppSelector(state => state.areas);
  const { byId: projectsById, allIds: projectIds } = useAppSelector(state => state.projects);

  const handleListSelect = (listId: string) => {
    dispatch(setCurrentView({ view: listId }));
    if (isMobile) {
      onClose();
    }
  };

  const smartLists = [
    { id: 'inbox', name: 'Inbox', icon: '📥', count: 0, iconColor: 'text-things-blue' },
    { id: 'today', name: 'Today', icon: '⭐', count: 0, iconColor: 'text-things-orange' },
    { id: 'upcoming', name: 'Upcoming', icon: '📅', count: 0, iconColor: 'text-things-red' },
    { id: 'anytime', name: 'Anytime', icon: '📋', count: 0, iconColor: 'text-things-teal' },
    { id: 'someday', name: 'Someday', icon: '🌙', count: 0, iconColor: 'text-things-yellow' },
  ];

  const sidebarClasses = `
    ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-56' : 'w-56'}
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
    transition-transform duration-200 ease-out
    bg-things-light-gray border-r border-things-medium-gray
    flex flex-col
    overflow-y-auto hide-scrollbar
    py-2
  `.trim();

  return (
    <div className={sidebarClasses}>
      {/* Smart Lists Section */}
      <SidebarSection title="Smart Lists">
        {smartLists.map(list => (
          <SidebarItem
            key={list.id}
            id={list.id}
            name={list.name}
            icon={list.icon}
            count={list.count}
            isActive={currentView === list.id}
            onClick={() => handleListSelect(list.id)}
            iconColor={list.iconColor}
          />
        ))}
      </SidebarSection>

      {/* Areas Section */}
      <SidebarSection title="Areas" showAddButton>
        {areaIds.map(areaId => {
          const area = areasById[areaId];
          if (!area) return null;

          // Get projects for this area
          const areaProjects = projectIds
            .map(projectId => projectsById[projectId])
            .filter((project): project is NonNullable<typeof project> =>
              project !== undefined && project.area_id === areaId
            );

          return (
            <div key={areaId}>
              <SidebarItem
                id={`area-${areaId}`}
                name={area.name}
                icon="area"
                isActive={currentView === `area-${areaId}`}
                onClick={() => handleListSelect(`area-${areaId}`)}
                hasChildren={areaProjects.length > 0}
                iconColor="bg-things-purple"
              />

              {/* Projects under this area */}
              {areaProjects.map(project => (
                <SidebarItem
                  key={project.id}
                  id={`project-${project.id}`}
                  name={project.name}
                  icon="project"
                  isActive={currentView === `project-${project.id}`}
                  onClick={() => handleListSelect(`project-${project.id}`)}
                  isChild
                  iconColor="bg-things-green"
                />
              ))}
            </div>
          );
        })}
      </SidebarSection>

      {/* Projects Section (projects without areas) */}
      <SidebarSection title="Projects" showAddButton>
        {projectIds
          .map(projectId => projectsById[projectId])
          .filter((project): project is NonNullable<typeof project> =>
            project !== undefined && !project.area_id
          )
          .map(project => (
            <SidebarItem
              key={project.id}
              id={`project-${project.id}`}
              name={project.name}
              icon="project"
              isActive={currentView === `project-${project.id}`}
              onClick={() => handleListSelect(`project-${project.id}`)}
              iconColor="bg-things-blue"
            />
          ))}
      </SidebarSection>

      {/* Logbook Section */}
      <SidebarSection title="Logbook">
        <SidebarItem
          id="logbook"
          name="Logbook"
          icon="📚"
          isActive={currentView === 'logbook'}
          onClick={() => handleListSelect('logbook')}
          iconColor="text-things-green"
        />
        <SidebarItem
          id="trash"
          name="Trash"
          icon="🗑️"
          isActive={currentView === 'trash'}
          onClick={() => handleListSelect('trash')}
          iconColor="text-things-gray"
        />
      </SidebarSection>
    </div>
  );
};

export default Sidebar;
