
import type { Incident, AnalystAction, EnrichedContext } from '../types';

// This is a mock service that simulates calls to a generative AI model.
// In a real application, this would use @google/genai to make API calls.

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const geminiService = {
  enrichAlert: async (incident: Incident): Promise<EnrichedContext> => {
    console.log("Simulating AI enrichment for incident:", incident.id);
    await simulateDelay(2500); // Simulate network and processing latency

    return {
      summary: `The alert indicates potential lateral movement originating from asset 'ws-finance05' (10.1.5.21) via RDP, targeting 'srv-db01'. The user account 'jane.doe' is associated with this activity. This pattern is consistent with credential compromise followed by internal reconnaissance.`,
      affectedSystems: ['ws-finance05', 'srv-db01'],
      recommendedActions: [
        "Isolate 'ws-finance05' from the network immediately.",
        "Disable the 'jane.doe' user account pending investigation.",
        "Review logs on 'srv-db01' for unauthorized access attempts."
      ]
    };
  },

  generateReport: async (incident: Incident, actions: AnalystAction[]): Promise<string> => {
    console.log("Simulating AI report generation...");
    await simulateDelay(2000);

    const actionsLog = actions.map(action => 
      `- **${action.stepTitle}:** Analyst chose "${action.analystChoice}" at ${new Date(action.timestamp).toLocaleTimeString()}`
    ).join('\n');

    const report = `
# Incident Report: ${incident.id} - ${incident.title}

## Executive Summary
This report details the response to a high-severity lateral movement alert detected on ${new Date(incident.timestamp).toLocaleString()}. The incident involved user 'jane.doe' and assets 'ws-finance05' and 'srv-db01'. The response, guided by playbook AW-Playbook-LM-v1.4, resulted in successful containment of the threat by isolating the source host and disabling the potentially compromised user account.

## Initial Alert Details
- **Severity:** ${incident.severity}
- **Timestamp:** ${new Date(incident.timestamp).toLocaleString()}
- **Description:** ${incident.details}

## Analyst Actions Log
${actionsLog}

## Outcome
The incident was classified as a **True Positive**. Containment actions were successful, and the incident has been escalated for further forensic analysis.

## Recommendations
- Conduct a full forensic analysis of the isolated host 'ws-finance05'.
- Monitor 'srv-db01' for any further anomalous activity.
- Review RDP access policies across the organization.
    `;

    return report.trim();
  }
};
