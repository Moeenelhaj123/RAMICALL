import type { BucketType, TalkingDataPoint } from '@/features/agent-kpi/TalkingOverTimeCard';

export interface TalkingAnalyticsQuery {
  from: string; // ISO string
  to: string;   // ISO string
  bucket: BucketType;
  timezone?: string;
}

export interface TalkingAnalyticsResponse {
  data: TalkingDataPoint[];
}

/**
 * Fetch talking analytics data
 * This is a mock implementation - replace with real API call
 */
export async function fetchTalkingAnalytics(query: TalkingAnalyticsQuery): Promise<TalkingAnalyticsResponse> {
  // In production, this would be:
  // const response = await fetch(`/api/analytics/talking?from=${query.from}&to=${query.to}&bucket=${query.bucket}`);
  // return response.json();
  
  // Mock implementation for development
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = generateMockTalkingData(query.from, query.to, query.bucket);
      resolve({ data: mockData });
    }, 500); // Simulate network delay
  });
}

function generateMockTalkingData(fromISO: string, toISO: string, bucket: BucketType): TalkingDataPoint[] {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  const data: TalkingDataPoint[] = [];
  
  const getBucketIncrement = (bucket: BucketType) => {
    switch (bucket) {
      case 'day': return 24 * 60 * 60 * 1000; // 1 day
      case 'week': return 7 * 24 * 60 * 60 * 1000; // 1 week
      case 'month': return 30 * 24 * 60 * 60 * 1000; // ~1 month
    }
  };

  const increment = getBucketIncrement(bucket);
  let current = new Date(from);

  while (current <= to) {
    // Generate realistic talking time based on bucket
    const baseTalking = bucket === 'day' ? 4 * 3600 : bucket === 'week' ? 28 * 3600 : 120 * 3600;
    const variance = baseTalking * 0.4;
    const totalTalkingSec = Math.max(0, Math.floor(baseTalking + (Math.random() - 0.5) * variance));
    
    data.push({
      ts: current.toISOString(),
      totalTalkingSec
    });
    
    current = new Date(current.getTime() + increment);
  }

  return data;
}