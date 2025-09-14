
import React, { createContext, useReducer, useContext, useCallback, useEffect } from 'react';
import type { Incident, AnalystAction, EnrichedContext, PlaybookStep, PlaybookOption } from '../types';
import { mockIncident, playbook } from '../data/mockData';
import { geminiService } from '../services/geminiService';

interface PlaybookState {
  incident: Incident;
  currentStepId: string;
  history: AnalystAction[];
  enrichedContext: EnrichedContext | null;
  isLoading: boolean;
  isEnriching: boolean;
  report: string | null;
}

type PlaybookAction =
  | { type: 'START_WORKFLOW' }
  | { type: 'SET_STEP'; payload: { stepId: string; option: PlaybookOption } }
  | { type: 'START_ENRICHMENT' }
  | { type: 'SET_ENRICHED_CONTEXT'; payload: EnrichedContext }
  | { type: 'START_REPORT_GENERATION' }
  | { type: 'SET_REPORT'; payload: string }
  | { type: 'CLOSE_REPORT' };

const initialState: PlaybookState = {
  incident: mockIncident,
  currentStepId: 'start',
  history: [],
  enrichedContext: null,
  isLoading: false,
  isEnriching: false,
  report: null,
};

const playbookReducer = (state: PlaybookState, action: PlaybookAction): PlaybookState => {
  switch (action.type) {
    case 'START_WORKFLOW':
      return { ...state, incident: { ...state.incident, status: 'In Progress' } };
    case 'SET_STEP': {
        const currentStep = playbook[state.currentStepId];
        const newAction: AnalystAction = {
            stepId: state.currentStepId,
            stepTitle: currentStep.title,
            analystChoice: action.payload.option.text,
            timestamp: new Date().toISOString(),
        };
        return {
            ...state,
            currentStepId: action.payload.stepId,
            history: [...state.history, newAction],
            isLoading: false,
        };
    }
    case 'START_ENRICHMENT':
        return {...state, isLoading: true, isEnriching: true };
    case 'SET_ENRICHED_CONTEXT':
        return {...state, enrichedContext: action.payload, isLoading: false, isEnriching: false };
    case 'START_REPORT_GENERATION':
        return {...state, isLoading: true };
    case 'SET_REPORT':
        return {...state, report: action.payload, isLoading: false };
    case 'CLOSE_REPORT':
        return {...state, report: null};
    default:
      return state;
  }
};

interface PlaybookContextType {
  state: PlaybookState;
  handleOptionSelect: (option: PlaybookOption) => void;
  closeReport: () => void;
  getCurrentStep: () => PlaybookStep;
}

const PlaybookContext = createContext<PlaybookContextType | undefined>(undefined);

export const PlaybookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(playbookReducer, initialState);

  const handleEnrichment = useCallback(async () => {
    dispatch({ type: 'START_ENRICHMENT' });
    const context = await geminiService.enrichAlert(state.incident);
    dispatch({ type: 'SET_ENRICHED_CONTEXT', payload: context });
  }, [state.incident]);

  const handleReportGeneration = useCallback(async () => {
      dispatch({ type: 'START_REPORT_GENERATION' });
      const generatedReport = await geminiService.generateReport(state.incident, state.history);
      dispatch({ type: 'SET_REPORT', payload: generatedReport });
  }, [state.incident, state.history]);

  const handleOptionSelect = useCallback((option: PlaybookOption) => {
    if (state.isLoading) return;

    if (option.action === 'enrich') {
        dispatch({ type: 'START_WORKFLOW' });
        handleEnrichment();
    }
    
    if (option.nextStepId) {
        dispatch({ type: 'SET_STEP', payload: { stepId: option.nextStepId, option } });
    }
    
    if (option.action === 'generate_report') {
        const currentStep = playbook[state.currentStepId];
        dispatch({ type: 'SET_STEP', payload: { stepId: state.currentStepId, option } });
        handleReportGeneration();
    }
  }, [state.isLoading, state.currentStepId, handleEnrichment, handleReportGeneration]);
  
  useEffect(() => {
    // This effect handles auto-advancing from action steps
    const currentStep = playbook[state.currentStepId];
    if (currentStep && currentStep.type === 'action' && !state.isLoading) {
      const nextOption = currentStep.options[0];
      if (nextOption && nextOption.nextStepId) {
        setTimeout(() => { // small delay to allow user to read the action text
             dispatch({ type: 'SET_STEP', payload: { stepId: nextOption.nextStepId, option: nextOption } });
        }, 1500);
      }
    }
  }, [state.currentStepId, state.isLoading]);


  const getCurrentStep = () => playbook[state.currentStepId];

  const closeReport = () => dispatch({ type: 'CLOSE_REPORT' });

  return (
    <PlaybookContext.Provider value={{ state, handleOptionSelect, closeReport, getCurrentStep }}>
      {children}
    </PlaybookContext.Provider>
  );
};

export const usePlaybook = (): PlaybookContextType => {
  const context = useContext(PlaybookContext);
  if (!context) {
    throw new Error('usePlaybook must be used within a PlaybookProvider');
  }
  return context;
};
