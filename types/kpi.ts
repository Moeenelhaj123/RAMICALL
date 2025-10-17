export interface AgentsKPIMetrics {
  currentAgentsLoggedIn: number;
  currentAgentsOnCall: number;
  currentAgentsAvailable: number;
  currentAgentsOnBreak: number;
  totalAgents: number;
  missedCallsToday: number;
  answeredToday: number;
  outboundToday: number;
  totalOutboundTalking: string;
  totalInboundTalking: string;
}

export interface AgentsKPIDashboardProps {
  title?: string;
  metrics: AgentsKPIMetrics;
  initialVisibleIds?: string[];
  storageKey?: string;
  compactHeader?: boolean;
  className?: string;
}
