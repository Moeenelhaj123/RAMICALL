export type DonutMetric = 'talking' | 'outbounds' | 'unique';

export const DONUT_COLORS = [
  '#6366F1', // indigo-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#22D3EE', // cyan-400
  '#84CC16', // lime-500 (overflow)
];

export const METRIC_LABELS: Record<DonutMetric, string> = {
  talking: 'Most Total Talking',
  outbounds: 'Most Outbounds',
  unique: 'Most Unique Contacts',
};