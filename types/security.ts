export type IpScope = "global" | "api" | "rtp" | "sip" | "admin_ui" | "webhook" | "custom";
export type IpStatus = "enabled" | "disabled";

export type AllowedIP = {
  id: string;
  cidr: string;
  label?: string;
  scopes: IpScope[];
  tags?: string[];
  notes?: string;
  status: IpStatus;
  createdAt: string;
  createdBy?: { id: string; name: string; email?: string };
  updatedAt?: string;
};

// AllowIPRow for table display (matching Extensions structure)
export type AllowIPRow = {
  id: string;
  ip: string;
  description: string;
  status: string;
  createdBy: string;
  createdOn: Date;
  updated: Date;
};

// Query interface for Allow IP
export interface ListQuery {
  page: number;
  pageSize: number;
  q: string;
  sortBy: string;
  order: 'asc' | 'desc';
}
