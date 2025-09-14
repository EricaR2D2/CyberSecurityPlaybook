
import type { Incident, User, Asset, Playbook } from '../types';

export const mockIncident: Incident = {
  id: 'INC-2024-07-21-001',
  title: 'Potential Lateral Movement via RDP',
  severity: 'High',
  timestamp: new Date().toISOString(),
  status: 'New',
  details: 'Multiple failed RDP login attempts from ws-finance05 to srv-db01 followed by a successful login, using credentials for user jane.doe.',
  involvedEntities: [
    { type: 'user', id: 'jane.doe' },
    { type: 'asset', id: 'ws-finance05' },
    { type: 'asset', id: 'srv-db01' },
  ],
};

export const mockUsers: Record<string, User> = {
  'jane.doe': {
    id: 'jane.doe',
    name: 'Jane Doe',
    role: 'Financial Analyst',
    department: 'Finance',
    lastLogin: '2024-07-21T10:05:00Z',
    riskScore: 78,
  },
};

export const mockAssets: Record<string, Asset> = {
  'ws-finance05': {
    id: 'ws-finance05',
    hostname: 'ws-finance05',
    ipAddress: '10.1.5.21',
    os: 'Windows 10 Enterprise',
    businessCriticality: 'Medium',
  },
  'srv-db01': {
    id: 'srv-db01',
    hostname: 'srv-db01.prod.local',
    ipAddress: '10.1.2.105',
    os: 'Windows Server 2022',
    businessCriticality: 'High',
  },
};

export const playbook: Playbook = {
  'start': {
    id: 'start',
    type: 'question',
    title: 'Acknowledge Alert',
    prompt: 'A new high-severity "Lateral Movement" alert has been triggered. Do you want to begin the response workflow?',
    source: 'Source: AW-Playbook-LM-v1.4, Step 1a',
    options: [
      { text: 'Acknowledge and Start', nextStepId: 'enrich', action: 'enrich' },
    ],
  },
  'enrich': {
    id: 'enrich',
    type: 'action',
    title: 'Context Enrichment',
    prompt: 'I am enriching the alert with asset and user context from our data sources. This may take a moment...',
    source: 'Source: AW-Playbook-LM-v1.4, Step 1b',
    options: [
        { text: 'Continue to Validation', nextStepId: 'validate' },
    ]
  },
  'validate': {
    id: 'validate',
    type: 'question',
    title: 'Incident Validation',
    prompt: 'The activity involves a user from Finance accessing a production database server, which is anomalous. Do you classify this as a True Positive or a False Positive?',
    source: 'Source: AW-Playbook-LM-v1.4, Step 2a',
    options: [
      { text: 'True Positive', nextStepId: 'contain_prompt' },
      { text: 'False Positive', nextStepId: 'document_fp' },
    ],
  },
  'contain_prompt': {
    id: 'contain_prompt',
    type: 'question',
    title: 'Containment Strategy',
    prompt: 'To prevent further movement, immediate containment is recommended. What is your first containment action?',
    source: 'Source: AW-Playbook-LM-v1.4, Step 3a',
    options: [
      { text: 'Isolate Host (ws-finance05)', nextStepId: 'contain_isolate', action: 'contain' },
      { text: 'Disable User (jane.doe)', nextStepId: 'contain_disable', action: 'contain' },
    ],
  },
  'contain_isolate': {
    id: 'contain_isolate',
    type: 'question',
    title: 'Host Isolated',
    prompt: 'Host "ws-finance05" has been isolated from the network. What is the next step?',
    source: 'Source: AW-Playbook-LM-v1.4, Step 3b',
    options: [
        { text: 'Disable User Account (jane.doe)', nextStepId: 'contain_disable_after_isolate', action: 'contain' },
        { text: 'Proceed to Documentation', nextStepId: 'document_tp' },
    ]
  },
  'contain_disable': {
    id: 'contain_disable',
    type: 'question',
    title: 'User Disabled',
    prompt: 'User account "jane.doe" has been disabled. What is the next step?',
    source: 'Source: AW-Playbook-LM-v1.4, Step 3c',
    options: [
        { text: 'Isolate Host (ws-finance05)', nextStepId: 'contain_isolate_after_disable', action: 'contain' },
        { text: 'Proceed to Documentation', nextStepId: 'document_tp' },
    ]
  },
   'contain_isolate_after_disable': {
    id: 'contain_isolate_after_disable',
    type: 'action',
    title: 'Containment Complete',
    prompt: 'Host "ws-finance05" has also been isolated. Containment is complete.',
    source: 'Source: AW-Playbook-LM-v1.4, Step 3d',
    options: [
        { text: 'Proceed to Documentation', nextStepId: 'document_tp' },
    ]
  },
    'contain_disable_after_isolate': {
    id: 'contain_disable_after_isolate',
    type: 'action',
    title: 'Containment Complete',
    prompt: 'User account "jane.doe" has also been disabled. Containment is complete.',
    source: 'Source: AW-Playbook-LM-v1.4, Step 3d',
    options: [
        { text: 'Proceed to Documentation', nextStepId: 'document_tp' },
    ]
  },
  'document_tp': {
      id: 'document_tp',
      type: 'final',
      title: 'Documentation (True Positive)',
      prompt: 'All containment actions are logged. The incident is classified as a True Positive. You can now generate the final report for escalation.',
      source: 'Source: AW-Playbook-LM-v1.4, Step 4a',
      options: [
        { text: 'Generate Incident Report', nextStepId: null, action: 'generate_report' }
      ]
  },
  'document_fp': {
      id: 'document_fp',
      type: 'final',
      title: 'Documentation (False Positive)',
      prompt: 'The incident has been classified as a False Positive. Please add closing comments before generating the report.',
      source: 'Source: AW-Playbook-LM-v1.4, Step 4b',
      options: [
        { text: 'Generate Incident Report', nextStepId: null, action: 'generate_report' }
      ]
  }
};
