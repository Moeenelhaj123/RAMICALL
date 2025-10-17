// Status theme configuration for compact agent cards
export type AgentStatus =
  | 'in_call'
  | 'break'
  | 'available'
  | 'busy'
  | 'ringing'
  | 'dialing'
  | 'offline';

export const STATUS_THEME: Record<AgentStatus, {
  text: string;
  dot: string;
  pulse?: string;
  fixedBackground?: boolean; // for statuses that should have fixed colored background
}> = {
  in_call: {
    text: 'text-green-800',
    dot: 'bg-green-500',
    pulse: 'ring-green-300'
  },
  break: {
    text: 'text-orange-800',
    dot: 'bg-orange-500',
    pulse: 'ring-orange-300'
  },
  available: {
    text: 'text-sky-800',
    dot: 'bg-sky-500'
  },
  busy: {
    text: 'text-amber-800',
    dot: 'bg-amber-500'
  },
  ringing: {
    text: 'text-indigo-800',
    dot: 'bg-indigo-500'
  },
  dialing: {
    text: 'text-green-800', // same as in_call
    dot: 'bg-green-500',    // same as in_call
    pulse: 'ring-green-300' // same as in_call
  },
  offline: {
    text: 'text-rose-800',
    dot: 'bg-rose-500',
    fixedBackground: true // soft red background, no animation
  },
};