import * as React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { DONUT_COLORS, DonutMetric, METRIC_LABELS } from './constants';
import { getTopAgentsForMetric } from './selectors';
import type { AgentPerformanceRow } from '@/types/performance';
import { formatDuration } from '@/lib/formatters';

type Props = {
  rows: AgentPerformanceRow[];   // same source as AgentPerformanceTable
  defaultMetric?: DonutMetric;
  className?: string;
};

export function AgentBestDonut({ rows, defaultMetric = 'talking', className }: Props) {
  const [metric, setMetric] = React.useState<DonutMetric>(defaultMetric);

  const data = React.useMemo(() => getTopAgentsForMetric(rows, metric, 5), [rows, metric]);
  const total = React.useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  const formatValue = React.useCallback((v: number) => {
    if (metric === 'talking') return formatDuration(v); // seconds → hh:mm:ss
    return Intl.NumberFormat().format(v);
  }, [metric]);

  return (
    <Card className={className}>
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="font-semibold text-slate-900">Top Agents</div>
        <Select value={metric} onValueChange={(v) => setMetric(v as DonutMetric)}>
          <SelectTrigger className="h-8 w-[190px]">
            <SelectValue placeholder="Choose metric" />
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="talking">{METRIC_LABELS.talking}</SelectItem>
            <SelectItem value="outbounds">{METRIC_LABELS.outbounds}</SelectItem>
            <SelectItem value="unique">{METRIC_LABELS.unique}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="p-4">
        {data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
            {/* Chart */}
            <div className="col-span-1 lg:col-span-3 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={2}
                  >
                    {data.map((entry, i) => (
                      <Cell key={entry.id} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [formatValue(val), '']}
                    labelFormatter={(label: any) => String(label)}
                    contentStyle={{ 
                      borderRadius: 12, 
                      borderColor: '#E5E7EB',
                      backgroundColor: 'white',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend / totals */}
            <div className="col-span-1 lg:col-span-2">
              <div className="space-y-3">
                {data.map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }}
                      />
                      <span className="truncate text-sm text-slate-700">{d.name}</span>
                    </div>
                    <span className="text-sm font-medium tabular-nums text-slate-900 ml-2">
                      {formatValue(d.value)}
                    </span>
                  </div>
                ))}
                {data.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Total</span>
                    <span className="text-sm font-semibold tabular-nums text-slate-900">
                      {formatValue(total)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-slate-500">
            <div className="text-center">
              <div className="text-sm font-medium">No data available</div>
              <div className="text-xs mt-1">Select a different date range or filter</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}