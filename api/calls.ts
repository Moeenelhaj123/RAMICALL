import type { CallHistoryQuery, CallHistoryResponse, CallRecord } from "@/types/calls";

export async function fetchCallHistory(
  query: CallHistoryQuery
): Promise<CallHistoryResponse> {
  const params = new URLSearchParams();
  
  if (query.search) params.append("search", query.search);
  if (query.dateFrom) params.append("from", query.dateFrom);
  if (query.dateTo) params.append("to", query.dateTo);
  if (query.direction && query.direction !== "all") params.append("direction", query.direction);
  if (query.results?.length) params.append("results", query.results.join(","));
  if (query.agentIds?.length) params.append("agentIds", query.agentIds.join(","));
  if (query.queueIds?.length) params.append("queueIds", query.queueIds.join(","));
  if (query.sortBy) params.append("sortBy", query.sortBy);
  if (query.sortDir) params.append("sortDir", query.sortDir);
  if (query.page !== undefined) params.append("page", query.page.toString());
  if (query.pageSize) params.append("pageSize", query.pageSize.toString());

  const response = await fetch(`/api/calls?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch call history");
  }
  
  return response.json();
}

export async function fetchCallDetails(id: string): Promise<CallRecord> {
  const response = await fetch(`/api/calls/${id}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch call details");
  }
  
  return response.json();
}

export async function getRecordingUrl(id: string): Promise<string> {
  const response = await fetch(`/api/calls/${id}/recording`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch recording URL");
  }
  
  const data = await response.json();
  return data.url;
}
