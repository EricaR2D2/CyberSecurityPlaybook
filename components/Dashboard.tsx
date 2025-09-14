
import React from 'react';
import AIAssistantPanel from './AIAssistantPanel';
import IncidentDetailsPanel from './IncidentDetailsPanel';
import ContextPanel from './ContextPanel';
import ReportModal from './ReportModal';
import { usePlaybook } from '../hooks/usePlaybook';
import Loader from './common/Loader';

const Dashboard: React.FC = () => {
  const { state, closeReport } = usePlaybook();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel */}
        <div className="lg:col-span-4 xl:col-span-3">
          <AIAssistantPanel />
        </div>

        {/* Center Panel */}
        <div className="lg:col-span-8 xl:col-span-6">
          <IncidentDetailsPanel />
        </div>

        {/* Right Panel */}
        <div className="hidden xl:block xl:col-span-3">
          <ContextPanel />
        </div>
      </div>
      {state.report && <ReportModal report={state.report} onClose={closeReport} />}
      {state.isLoading && !state.isEnriching && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
              <Loader text="Processing..." />
          </div>
      )}
    </>
  );
};

export default Dashboard;
