import { useMemo } from 'react';
import { AllowedIP, IpScope, IpStatus } from '@/types/security';

export type AllowIPFilters = {
  search?: string;
  scopes?: IpScope[];
  status?: IpStatus | 'all';
};

export function useFilteredAllowedIPs(
  rows: AllowedIP[],
  filters: AllowIPFilters
): AllowedIP[] {
  return useMemo(() => {
    let filtered = [...rows];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (ip) =>
          ip.cidr.toLowerCase().includes(searchLower) ||
          ip.label?.toLowerCase().includes(searchLower) ||
          ip.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          ip.createdBy?.name?.toLowerCase().includes(searchLower) ||
          ip.createdBy?.email?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((ip) => ip.status === filters.status);
    }

    if (filters.scopes && filters.scopes.length > 0) {
      filtered = filtered.filter((ip) =>
        filters.scopes!.some((scope) => ip.scopes.includes(scope))
      );
    }

    return filtered;
  }, [rows, filters]);
}
