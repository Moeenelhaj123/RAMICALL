export type QueueStrategy =
  | "round_robin" | "least_recent" | "fewest_calls"
  | "ring_all" | "linear" | "random" | "skills";

export type QueueStatus = "active" | "disabled";

export type PauseReason = "break" | "training" | "meeting" | "lunch" | "other";

export type SLATarget = { thresholdSec: number; targetPct: number };

export type QueueHours = {
  timezone: string;
  mon?: { open: string; close: string } | null;
  tue?: { open: string; close: string } | null;
  wed?: { open: string; close: string } | null;
  thu?: { open: string; close: string } | null;
  fri?: { open: string; close: string } | null;
  sat?: { open: string; close: string } | null;
  sun?: { open: string; close: string } | null;
  holidays?: Array<{ date: string; name?: string }>;
};

export type QueuePrompts = {
  moh?: string;
  welcomePrompt?: string;
  positionPrompt?: boolean;
  etaPrompt?: boolean;
  periodicPromptSec?: number;
  language?: string;
};

export type QueueOverflow = {
  maxWaitSec?: number;
  maxQueueSize?: number;
  destination?: "voicemail" | "callback" | "ivr" | "external" | "queue";
  destinationRef?: string;
};

export type QueueMember = {
  userId: string;
  penalty?: number;
  skills?: string[];
  wrapUpSec?: number;
  loginMode?: "dynamic" | "static";
};

export type QueueMetrics = {
  waiting: number;
  longestWaitSec: number;
  agentsReady: number;
  agentsOnCall: number;
  serviceLevelPct?: number;
  asaSec?: number;
  abandonRatePct?: number;
  answeredToday?: number;
  inboundToday?: number;
};

export type Queue = {
  id: string;
  name: string;
  status: QueueStatus;
  strategy: QueueStrategy;
  priority?: number;
  recording?: boolean;
  callbackEnabled?: boolean;
  hours?: QueueHours;
  prompts?: QueuePrompts;
  overflow?: QueueOverflow;
  members: QueueMember[];
  sla?: SLATarget;
  createdAt: string;
  updatedAt: string;
  metrics?: QueueMetrics;
};
