
import React from 'react';
import { usePlaybook } from '../hooks/usePlaybook';
import Card, { CardHeader, CardContent } from './common/Card';
import Loader from './common/Loader';

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const SeverityBadge: React.FC<{ severity: 'High' | 'Medium' | 'Low' }> = ({ severity }) => {
  const colors = {
    High: 'bg-red-500 text-white',
    Medium: 'bg-yellow-500 text-black',
    Low: 'bg-green-500 text-white',
  };
  return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${colors[severity]}`}>{severity}</span>;
};

const IncidentDetailsPanel: React.FC = () => {
  const { state } = usePlaybook();
  const { incident, enrichedContext, history } = state;

  return (
    <Card className="h-full">
      <CardHeader icon={<AlertIcon />}>Incident Details: {incident.id}</CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Incident Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-aw-text-primary">{incident.title}</h3>
            <div className="flex justify-between items-center text-sm">
                <SeverityBadge severity={incident.severity} />
                <span className="text-gray-400">{new Date(incident.timestamp).toLocaleString()}</span>
            </div>
            <p>{incident.details}</p>
          </div>

          {/* AI Enrichment */}
          {state.isEnriching && <Loader text="AI is analyzing context..." />}
          {enrichedContext && (
            <div className="p-4 bg-aw-dark rounded-md border border-aw-accent/30 space-y-3">
                <h3 className="text-lg font-semibold text-aw-accent flex items-center"><SparklesIcon/> <span className="ml-2">AI-Enriched Context</span></h3>
                <div>
                    <h4 className="font-semibold text-aw-text-primary">Summary</h4>
                    <p>{enrichedContext.summary}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-aw-text-primary">Recommended Actions</h4>
                    <ul className="list-disc list-inside space-y-1">
                        {enrichedContext.recommendedActions?.map((action, i) => <li key={i}>{action}</li>)}
                    </ul>
                </div>
            </div>
          )}

          {/* Analyst Actions */}
          {history.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-aw-text-primary mb-2 flex items-center"><HistoryIcon/> <span className="ml-2">Analyst Actions</span></h3>
              <ul className="space-y-2 border-l-2 border-aw-medium-blue pl-4">
                {history.map((action, index) => (
                  <li key={index} className="text-sm">
                    <p className="font-semibold text-aw-text-primary">{action.stepTitle}</p>
                    <p>Choice: <span className="text-aw-accent">{action.analystChoice}</span></p>
                    <p className="text-xs text-gray-500">{new Date(action.timestamp).toLocaleTimeString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentDetailsPanel;
