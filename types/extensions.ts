export type Presence = 'Available' | 'Away' | 'DND' | 'Offline';

export type DeviceStatus = {
  sip: boolean;
  pc: boolean;
  mobile: boolean;
  web: boolean;
};

export interface ExtensionRow {
  id: string;              // GUID
  extension: string;       // "100"
  presence: Presence;
  device: DeviceStatus;    // icon set
  callerIdName?: string;
  role?: string;           // "Agent" | "Admin" | ...
  email?: string;
  mobile?: string;
  notes?: string;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ListQuery {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'presence' | 'extension' | 'callerIdName' | 'role' | 'email' | 'mobile';
  order?: 'asc' | 'desc';
}

export interface ExtensionFormData {
  extension: string;
  presence: Presence;
  callerIdName: string;
  role: string;
  email: string;
  mobile: string;
  device: DeviceStatus;
  notes: string;
}

export interface ExtensionsResponse {
  data: ExtensionRow[];
  meta: PageMeta;
}

export interface ImportResult {
  jobId: string;
  summary: {
    total: number;
    imported: number;
    failed: number;
  };
}