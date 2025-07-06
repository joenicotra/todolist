import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import './App.css';

const AppContent: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Things 3 Clone - Phase 2 Development</h1>
        <p>
          Redux store configured. Ready for layout components.
        </p>
        <div className="status">
          <p>✅ TypeScript configured</p>
          <p>✅ Project structure created</p>
          <p>✅ Core types defined</p>
          <p>✅ Redux store setup</p>
          <p>🚧 Next: Layout components</p>
        </div>
      </header>
    </div>
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
