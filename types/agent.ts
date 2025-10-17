export type Presence = "offline" | "online" | "dialing" | "in_call" | "break";
export type DisplayPresence = Presence | "break_auto";

export type AgentActionStatus = "idle" | "pending" | "success" | "error";

export interface Agent {
  id: string;
  userId: string;
  extension: string;
  did?: string;           // Agent's DID number
  presence: Presence;
  lastActivityAt?: number;
  phoneNumber?: string;
  clientPhoneNumber?: string;
  dialStartedAt?: number;
  callAnsweredAt?: number;
  breakStartedAt?: number;
  offlineSince?: number;
  callId?: string;
}

export interface AgentView extends Agent {
  name: string;
  avatarUrl?: string;
  email?: string;
  role?: string;
}

export interface AgentsStatusBoardProps {
  agents: AgentView[];
  autoBreakSeconds?: number;
  onAutoBreak?: (agentId: string) => void;
  onListen?: (agentId: string, callId?: string) => Promise<void>;
  onWhisper?: (agentId: string, callId?: string) => Promise<void>;
  onConference?: (agentId: string, callId?: string) => Promise<void>;
  onEndCall?: (agentId: string, callId?: string) => Promise<void>;
  className?: string;
}
