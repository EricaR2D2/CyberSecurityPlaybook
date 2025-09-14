
import React from 'react';
import Dashboard from './components/Dashboard';
import { PlaybookProvider } from './hooks/usePlaybook';

const App: React.FC = () => {
  return (
    <PlaybookProvider>
      <div className="min-h-screen bg-aw-dark">
        <header className="bg-aw-deep-blue p-4 shadow-md flex items-center space-x-4">
          <img src="https://www.arcticwolf.com/wp-content/themes/arctic-wolf/assets/img/logo.svg" alt="Arctic Wolf Logo" className="h-8" />
          <h1 className="text-xl font-bold text-aw-text-primary">Incident Response Playbook Assistant</h1>
        </header>
        <main className="p-4 lg:p-6">
          <Dashboard />
        </main>
      </div>
    </PlaybookProvider>
  );
};

export default App;
