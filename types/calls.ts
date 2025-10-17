export type CallDirection = "inbound" | "outbound";
export type CallResult = "answered" | "busy" | "no_answer" | "hungup";
export type HungupBy = "agent" | "client" | "system" | "unknown";

export type CallRecord = {
  id: string;
  direction: CallDirection;
  startAt: string;
  endAt?: string;
  callerNumber: string;
  calledNumber: string;
  totalDurationSec?: number;
  result: CallResult;
  agentId?: string;
  agentName?: string;
  queueId?: string;
  queueName?: string;
  hungupBy?: HungupBy;
  talkTimeSec?: number;
  answeredAt?: string;
  ringTimeSec?: number;
  onHoldDurationSec?: number;
  recordingUrl?: string;
  callId?: string;
};

export type CallHistoryQuery = {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  direction?: CallDirection | "all";
  results?: CallResult[];
  agentIds?: string[];
  queueIds?: string[];
  number?: string;
  // New filter fields
  callerNumber?: string;
  calledNumber?: string;
  durationSec?: { min?: number; max?: number };
  ringTimeSec?: { min?: number; max?: number };
  talkTimeSec?: { min?: number; max?: number };
  onHoldSec?: { min?: number; max?: number };
  hungupBy?: HungupBy[];
  sortBy?: keyof CallRecord;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type VisibleFilters = Record<string, boolean>;

export type CallHistoryResponse = {
  rows: CallRecord[];
  total: number;
};

export type CallHistoryPreferences = {
  filters: Partial<CallHistoryQuery>;
  columnVisibility: Record<string, boolean>;
  pageSize: number;
};
