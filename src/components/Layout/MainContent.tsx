import React from 'react';
import { useAppSelector } from '../../store/hooks';
import Header from './Header';

interface MainContentProps {
  children?: React.ReactNode;
  onToggleSidebar: () => void;
  isMobile: boolean;
  isSidebarOpen: boolean;
}

const MainContent: React.FC<MainContentProps> = ({
  children,
  onToggleSidebar,
  isMobile,
  isSidebarOpen,
}) => {
  const { currentView } = useAppSelector(state => state.ui.navigation);

  // Get the title for the current view
  const getViewTitle = (view: string): string => {
    switch (view) {
      case 'inbox':
        return 'Inbox';
      case 'today':
        return 'Today';
      case 'upcoming':
        return 'Upcoming';
      case 'anytime':
        return 'Anytime';
      case 'someday':
        return 'Someday';
      case 'logbook':
        return 'Logbook';
      case 'trash':
        return 'Trash';
      default:
        if (view.startsWith('area-')) {
          return 'Area'; // TODO: Get actual area name
        }
        if (view.startsWith('project-')) {
          return 'Project'; // TODO: Get actual project name
        }
        return 'Tasks';
    }
  };

  const mainContentClasses = `
    flex-1 flex flex-col
    ${isMobile ? 'ml-0' : 'ml-56'}
    transition-all duration-200 ease-out
    bg-white
    min-h-screen
  `.trim();

  return (
    <div className={mainContentClasses}>
      {/* Header */}
      <Header
        title={getViewTitle(currentView)}
        onToggleSidebar={onToggleSidebar}
        showMenuButton={isMobile}
      />

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children || (
          <div className="flex items-center justify-center h-full text-things-dark-gray">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-things-light-gray rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-things-dark-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-lg font-medium mb-2 text-things-charcoal">
                No tasks in {getViewTitle(currentView)}
              </h2>
              <p className="text-sm text-things-dark-gray">
                Create your first task to get started.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Magic Plus Button */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 bg-things-blue hover:bg-things-blue-pressed text-white rounded-full shadow-things hover:shadow-things-hover transition-all duration-200 flex items-center justify-center text-xl font-medium z-50"
        title="Add new task"
        aria-label="Add new task"
      >
        +
      </button>
    </div>
  );
};

export default MainContent;
