import { Queue } from "@/types/queues";

export function filterQueues(queues: Queue[], search: string, status?: string, strategies?: string[]): Queue[] {
  return queues.filter(q => {
    const matchesSearch = !search || 
      q.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !status || status === 'all' || q.status === status;
    
    const matchesStrategy = !strategies || strategies.length === 0 || 
      strategies.includes(q.strategy);
    
    return matchesSearch && matchesStatus && matchesStrategy;
  });
}

export function sortQueues(queues: Queue[], sortBy: string, sortDir: 'asc' | 'desc'): Queue[] {
  const sorted = [...queues].sort((a, b) => {
    let aVal: any = a[sortBy as keyof Queue];
    let bVal: any = b[sortBy as keyof Queue];
    
    if (sortBy === 'members') {
      aVal = a.members.length;
      bVal = b.members.length;
    }
    
    if (sortBy === 'waiting' || sortBy === 'agentsReady') {
      aVal = a.metrics?.[sortBy as keyof typeof a.metrics] ?? 0;
      bVal = b.metrics?.[sortBy as keyof typeof b.metrics] ?? 0;
    }
    
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });
  
  return sorted;
}

export function calculateSLAStatus(queue: Queue): 'meeting' | 'missing' | 'unknown' {
  if (!queue.sla || !queue.metrics?.serviceLevelPct) return 'unknown';
  return queue.metrics.serviceLevelPct >= queue.sla.targetPct ? 'meeting' : 'missing';
}
