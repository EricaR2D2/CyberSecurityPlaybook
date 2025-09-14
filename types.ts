
export interface Incident {
  id: string;
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  timestamp: string;
  status: 'New' | 'In Progress' | 'Contained' | 'Resolved';
  details: string;
  involvedEntities: { type: 'user' | 'asset'; id: string }[];
}

export interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  lastLogin: string;
  riskScore: number;
}

export interface Asset {
  id: string;
  hostname: string;
  ipAddress: string;
  os: string;
  businessCriticality: 'High' | 'Medium' | 'Low';
}

export interface PlaybookOption {
  text: string;
  nextStepId: string | null;
  action?: 'enrich' | 'contain' | 'document' | 'generate_report';
}

export interface PlaybookStep {
  id: string;
  type: 'question' | 'action' | 'final';
  title: string;
  prompt: string;
  source: string;
  options: PlaybookOption[];
}

export interface Playbook {
  [key: string]: PlaybookStep;
}

export interface AnalystAction {
  stepId: string;
  stepTitle: string;
  analystChoice: string;
  timestamp: string;
}

export interface EnrichedContext {
  summary?: string;
  affectedSystems?: string[];
  recommendedActions?: string[];
}
