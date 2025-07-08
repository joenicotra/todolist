import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { setAreas } from './store/slices/areas';
import { setProjects } from './store/slices/projects';
import { setTasks } from './store/slices/tasks';
import { setUser } from './store/slices/auth';
import { initializeMockData, MockStorage, STORAGE_KEYS } from './services/mock';
import { User, Area, Project, Task } from './types/core';
import AppLayout from './components/Layout/AppLayout';
import InboxView from './components/SmartLists/InboxView';
import TodayView from './components/SmartLists/TodayView';
import UpcomingView from './components/SmartLists/UpcomingView';
import AnytimeView from './components/SmartLists/AnytimeView';
import SomedayView from './components/SmartLists/SomedayView';
import LogbookView from './components/SmartLists/LogbookView';
import TrashView from './components/SmartLists/TrashView';
import AreaView from './components/Views/AreaView';
import ProjectView from './components/Views/ProjectView';
import AreaModal from './components/ui/AreaModal';
import ProjectModal from './components/ui/ProjectModal';
import QuickEntryModal from './components/ui/QuickEntryModal';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentView } = useAppSelector(state => state.ui.navigation);

  // Initialize mock data and load into Redux store
  useEffect(() => {
    initializeMockData();

    // Load data from localStorage into Redux store
    const user = MockStorage.get<User>(STORAGE_KEYS.USER);
    const areas = MockStorage.get<Area[]>(STORAGE_KEYS.AREAS);
    const projects = MockStorage.get<Project[]>(STORAGE_KEYS.PROJECTS);
    const tasks = MockStorage.get<Task[]>(STORAGE_KEYS.TASKS);

    if (user) {
      dispatch(setUser(user));
    }

    if (areas) {
      dispatch(setAreas(areas));
    }

    if (projects) {
      dispatch(setProjects(projects));
    }

    if (tasks) {
      dispatch(setTasks(tasks));
    }
  }, [dispatch]);

  // Render the appropriate view based on current navigation
  const renderCurrentView = () => {
    switch (currentView) {
      case 'inbox':
        return <InboxView />;
      case 'today':
        return <TodayView />;
      case 'upcoming':
        return <UpcomingView />;
      case 'anytime':
        return <AnytimeView />;
      case 'someday':
        return <SomedayView />;
      case 'logbook':
        return <LogbookView />;
      case 'trash':
        return <TrashView />;
      default:
        if (currentView.startsWith('area-')) {
          const areaId = currentView.replace('area-', '');
          return <AreaView areaId={areaId} />;
        }
        if (currentView.startsWith('project-')) {
          const projectId = currentView.replace('project-', '');
          return <ProjectView projectId={projectId} />;
        }
        return <InboxView />; // Default fallback
    }
  };

  return (
    <>
      <AppLayout>
        {renderCurrentView()}
      </AppLayout>
      
      {/* Global Modals */}
      <AreaModal />
      <ProjectModal />
      <QuickEntryModal />
    </>
  );
};

export default AppContent;