import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppLayout from './components/Layout/AppLayout';
import { TaskGroup } from './components/Task';
import './App.css';

const AppContent: React.FC = () => {
  const [tasks, setTasks] = useState({
    newTodo: [
      { id: 'new-todo-1', title: 'New To-Do', completed: false }
    ],
    learnBasics: [
      { id: 'learn-1', title: 'New To-Do', completed: false },
      { id: 'learn-2', title: 'Create a new to-do', completed: false }
    ],
    tuneSetup: [
      { id: 'setup-1', title: 'Show your calendar events', completed: false },
      { id: 'setup-2', title: 'Add some widgets', completed: false },
      { id: 'setup-3', title: 'Sync your devices', completed: false }
    ],
    boostProductivity: [
      { id: 'boost-1', title: 'Add to-dos from anywhere', completed: false },
      { id: 'boost-2', title: 'Link to emails, files, and web pages', completed: false },
      { id: 'boost-3', title: 'Search and navigate with Quick Find', completed: false },
      { id: 'boost-4', title: 'Tag your to-dos', completed: false },
      { id: 'boost-5', title: 'Go step by step with checklists', completed: false },
      { id: 'boost-6', title: 'Hide the sidebar to focus on your work', completed: false },
      { id: 'boost-7', title: 'Open multiple windows', completed: false },
      { id: 'boost-8', title: 'Convert a to-do into a project', completed: false },
      { id: 'boost-9', title: 'Make your to-dos repeat', completed: false },
      { id: 'boost-10', title: 'Learn some keyboard shortcuts', completed: false },
      { id: 'boost-11', title: 'Structure your notes with Markdown', completed: false }
    ],
    beforeYouGo: [
      { id: 'before-1', title: 'Stay in the loop', completed: false },
      { id: 'before-2', title: 'Rate the app', completed: false },
      { id: 'before-3', title: 'Get Things for iPhone and iPad', completed: false },
      { id: 'before-4', title: 'Any questions? We\'re here to help!', completed: false }
    ]
  });

  const handleToggleTask = (taskId: string) => {
    setTasks(prevTasks => {
      const newTasks = { ...prevTasks };
      for (const groupKey in newTasks) {
        const group = newTasks[groupKey as keyof typeof newTasks];
        const taskIndex = group.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
          const task = group[taskIndex];
          if (task) {
            group[taskIndex] = { ...task, completed: !task.completed };
          }
          break;
        }
      }
      return newTasks;
    });
  };

  return (
    <AppLayout>
      <div className="px-6 py-4">
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-blue-600 text-sm">New To-Do</span>
            </div>
          </div>
        </div>

        <TaskGroup
          title="Learn the basics"
          tasks={tasks.learnBasics}
          onToggleTask={handleToggleTask}
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <span className="text-blue-600 text-sm font-medium">new heading</span>
        </div>

        <TaskGroup
          title="Tune your setup"
          tasks={tasks.tuneSetup}
          onToggleTask={handleToggleTask}
        />

        <TaskGroup
          title="Boost your productivity"
          tasks={tasks.boostProductivity}
          onToggleTask={handleToggleTask}
        />

        <TaskGroup
          title="Before you go..."
          tasks={tasks.beforeYouGo}
          onToggleTask={handleToggleTask}
        />
      </div>
    </AppLayout>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
