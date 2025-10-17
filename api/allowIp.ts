import { AllowedIP, IpScope, IpStatus } from "@/types/security";

export type AllowIpQuery = {
  search?: string;
  scopes?: IpScope[];
  status?: IpStatus | "all";
  sortBy?: keyof AllowedIP | "updatedAt";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export async function listAllowedIPs(q: AllowIpQuery): Promise<{ rows: AllowedIP[]; total: number }> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { rows: [], total: 0 };
}

export async function createAllowedIP(
  payload: Omit<AllowedIP, "id" | "createdAt" | "createdBy" | "updatedAt">
): Promise<AllowedIP> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Date.now().toString(),
    ...payload,
    createdAt: new Date().toISOString(),
    createdBy: { id: "1", name: "Current User" },
  };
}

export async function updateAllowedIP(id: string, patch: Partial<AllowedIP>): Promise<AllowedIP> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id, updatedAt: new Date().toISOString() } as AllowedIP;
}

export async function deleteAllowedIP(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function bulkImportCSV(file: File): Promise<{
  imported: number;
  skipped: number;
  errors?: Array<{ line: number; reason: string }>;
}> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { imported: 0, skipped: 0, errors: [] };
}
