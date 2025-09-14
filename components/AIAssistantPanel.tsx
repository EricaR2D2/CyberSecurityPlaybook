
import React from 'react';
import { usePlaybook } from '../hooks/usePlaybook';
import Card, { CardHeader, CardContent } from './common/Card';
import Button from './common/Button';
import Loader from './common/Loader';

const RobotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);


const AIAssistantPanel: React.FC = () => {
  const { state, handleOptionSelect, getCurrentStep } = usePlaybook();
  const currentStep = getCurrentStep();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader icon={<RobotIcon />}>AI Assistant</CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6 flex-grow">
          <div className="bg-aw-dark p-4 rounded-md min-h-[100px]">
            <p className="font-semibold text-aw-text-primary mb-2">{currentStep.title}</p>
            {state.isEnriching ? (
                 <Loader text={currentStep.prompt} />
            ) : (
                <p className="text-aw-text-secondary">{currentStep.prompt}</p>
            )}
           
          </div>
          <p className="text-xs text-center text-gray-500 italic">{currentStep.source}</p>
          <div className="space-y-3 pt-4 border-t border-aw-medium-blue">
            {currentStep.type !== 'action' && !state.isEnriching && currentStep.options.map((option, index) => (
              <Button 
                key={index} 
                onClick={() => handleOptionSelect(option)}
                disabled={state.isLoading}
                className="w-full"
              >
                {option.text}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistantPanel;
