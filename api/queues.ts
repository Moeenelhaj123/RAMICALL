import { Queue } from "@/types/queues";

export type Query = {
  search?: string;
  status?: "all" | "active" | "disabled";
  strategies?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export async function listQueues(q: Query): Promise<{ rows: Queue[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return { rows: [], total: 0 };
}

export async function createQueue(payload: Omit<Queue, "id" | "createdAt" | "updatedAt" | "metrics">): Promise<Queue> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newQueue: Queue = {
    ...payload,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return newQueue;
}

export async function updateQueue(id: string, patch: Partial<Queue>): Promise<Queue> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...patch, id, updatedAt: new Date().toISOString() } as Queue;
}

export async function toggleQueue(id: string, status: "active" | "disabled"): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
}

export async function listUsersForMembers(): Promise<Array<{
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  skills?: string[];
}>> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [];
}

export async function getQueueMetrics(ids: string[]): Promise<Array<{ id: string; metrics: Queue["metrics"] }>> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [];
}
