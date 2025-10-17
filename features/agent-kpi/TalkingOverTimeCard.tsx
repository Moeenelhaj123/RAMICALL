import * as React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { formatDuration } from '@/lib/formatters';
import { fetchTalkingAnalytics } from '@/api/analytics';

export type BucketType = 'day' | 'week' | 'month';

export interface TalkingDataPoint {
  ts: string; // ISO timestamp (bucket start)
  totalTalkingSec: number;
}

export interface TalkingOverTimeProps {
  fromISO: string;
  toISO: string;
  timezone?: string;
  defaultBucket?: BucketType;
  loading?: boolean;
  className?: string;
}

export function TalkingOverTimeCard({
  fromISO,
  toISO,
  timezone,
  defaultBucket = 'day',
  loading = false,
  className
}: TalkingOverTimeProps) {
  const [bucket, setBucket] = React.useState<BucketType>(defaultBucket);
  const [data, setData] = React.useState<TalkingDataPoint[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch data using the analytics API
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchTalkingAnalytics({
          from: fromISO,
          to: toISO,
          bucket,
          timezone
        });
        setData(result.data);
      } catch (error) {
        console.error('Failed to fetch talking analytics:', error);
        setData([]); // Set empty data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromISO, toISO, bucket, timezone]);

  const formatXAxisTick = React.useCallback((tickItem: string) => {
    const date = new Date(tickItem);
    
    switch (bucket) {
      case 'day':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'week':
        const weekNum = Math.ceil((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
        return `W${weekNum}`;
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      default:
        return '';
    }
  }, [bucket]);

  const formatTooltip = React.useCallback((value: number, name: string) => {
    if (name === 'totalTalkingSec') {
      return [formatDuration(value), 'Total Talking'];
    }
    return [value, name];
  }, []);

  const formatTooltipLabel = React.useCallback((label: string) => {
    const date = new Date(label);
    
    switch (bucket) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      case 'week':
        const weekStart = new Date(date);
        const weekEnd = new Date(date.getTime() + 6 * 24 * 60 * 60 * 1000);
        return `Week of ${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      default:
        return label;
    }
  }, [bucket]);

  const totalInRange = React.useMemo(() => {
    return data.reduce((sum, point) => sum + point.totalTalkingSec, 0);
  }, [data]);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="font-semibold text-slate-900">Total Talking Over Time</div>
        <Select value={bucket} onValueChange={(v) => setBucket(v as BucketType)}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Bucket" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4">
        {(loading || isLoading) ? (
          <div className="h-[280px] flex items-center justify-center">
            <div className="text-sm text-slate-500">Loading chart data...</div>
          </div>
        ) : data.length > 0 ? (
          <>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="talkingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="rgb(16 185 129)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="rgb(16 185 129)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="rgb(226 232 240)" 
                    strokeOpacity={0.5}
                  />
                  <XAxis 
                    dataKey="ts"
                    tickFormatter={formatXAxisTick}
                    stroke="rgb(100 116 139)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      // Show shorter format on Y-axis
                      const hours = Math.floor(value / 3600);
                      return `${hours}h`;
                    }}
                    stroke="rgb(100 116 139)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={formatTooltip}
                    labelFormatter={formatTooltipLabel}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid rgb(226 232 240)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="totalTalkingSec"
                    stroke="rgb(16 185 129)"
                    strokeWidth={2}
                    fill="url(#talkingGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Footer with total */}
            <div className="pt-3 border-t border-slate-200 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Total in range</span>
                <span className="text-sm font-semibold text-slate-900 tabular-nums">
                  {formatDuration(totalInRange)}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-slate-500">
            <div className="text-center">
              <div className="text-sm font-medium">No talking data available</div>
              <div className="text-xs mt-1 max-w-xs">
                {fromISO && toISO 
                  ? `No data found for the selected ${bucket === 'day' ? 'daily' : bucket === 'week' ? 'weekly' : 'monthly'} period`
                  : 'Try adjusting the date range or filters'
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}