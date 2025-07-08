import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import AppContent from './AppContent';
import ThemeProvider from './components/ThemeProvider';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
