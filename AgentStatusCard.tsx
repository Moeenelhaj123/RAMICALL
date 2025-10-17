import React from 'react';
import { STATUS_THEME, AgentStatus } from '@/ui/theme/agentStatus';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  Coffee, 
  CircleNotch, 
  WifiX,
  CheckCircle,
  MinusCircle,
  PhoneCall
} from '@phosphor-icons/react';

// Icon mapping for each status
const STATUS_ICONS: Record<AgentStatus, React.ComponentType<any>> = {
  in_call: Phone,
  break: Coffee,
  available: CheckCircle,
  busy: MinusCircle,
  ringing: PhoneCall,
  dialing: CircleNotch,
  offline: WifiX,
};

type Props = {
  name: string;
  extension?: string;
  clientPhone?: string;   // Client phone number (only shown during calls)
  timer?: string;         // "00:36:09"
  status: AgentStatus;    // mapped upstream
  statusLabel?: string;   // UI label e.g. "In Call", "On Break (Auto)"
  avatarUrl?: string;
  initials?: string;
  rightSlot?: React.ReactNode; // actions menu
};

export function AgentStatusCard({
  name,
  extension,
  clientPhone,
  timer,
  status,
  statusLabel,
  avatarUrl,
  initials,
  rightSlot,
}: Props) {
  const t = STATUS_THEME[status];
  const hasBeats = status === 'in_call' || status === 'break' || status === 'dialing'; // dialing now behaves like in_call
  const StatusIcon = STATUS_ICONS[status];

  // Determine card styling based on status
  const getCardStyle = () => {
    if (t.fixedBackground) {
      // Offline - fixed soft red background
      return {
        backgroundColor: 'rgb(254 242 242)', // rose-50
        borderColor: 'rgb(252 165 165)', // rose-300
        borderWidth: '1px',
        borderStyle: 'solid'
      };
    } else if (hasBeats) {
      // Animated statuses (in_call, break, dialing)
      const animationType = status === 'dialing' ? 'pulse-green' : 
                           status === 'in_call' ? 'pulse-green' : 'pulse-orange';
      return {
        animation: `${animationType} 2s ease-in-out infinite`,
        borderWidth: '1px',
        borderStyle: 'solid'
      };
    } else {
      // Default white background for other statuses
      return {
        backgroundColor: 'white',
        borderColor: 'rgb(226 232 240)',
        borderWidth: '1px',
        borderStyle: 'solid'
      };
    }
  };

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-xl p-3',
        'min-h-[88px] shadow-sm transition-all duration-300'
      )}
      role="group"
      style={getCardStyle()}
    >

      {/* Avatar + status icon + live bit */}
      <div className="relative">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-10 w-10 rounded-full object-cover" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 grid place-items-center text-xs font-semibold">
            {initials}
          </div>
        )}
        
        {/* Status Icon */}
        <div className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-white border border-slate-200 flex items-center justify-center">
          <StatusIcon 
            className={cn('h-3 w-3', t.text)} 
            weight={status === 'dialing' ? 'regular' : 'fill'}
          />
        </div>

        {/* Live bit (animated with 2-second intervals for active states) */}
        <span className="absolute -right-1 -bottom-1">
          <span className={cn('block h-2.5 w-2.5 rounded-full', t.dot)} />
          {t.pulse && (
            <span
              className={cn(
                'absolute inset-0 rounded-full opacity-40 ring-2',
                t.pulse
              )}
              style={{
                animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
              }}
            />
          )}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="truncate font-semibold text-slate-900">{name}</div>
          {statusLabel && (
            <span
              className={cn(
                'text-[11px] px-2 py-0.5 rounded-full border border-slate-200 bg-white',
                t.text
              )}
            >
              {statusLabel}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
          {/* Show client phone number only during active calls */}
          {clientPhone && (status === 'in_call' || status === 'dialing' || status === 'ringing') && (
            <span className="truncate font-medium text-slate-900">{clientPhone}</span>
          )}
          {/* Show extension for non-call states or when no client phone */}
          {extension && (!clientPhone || (status !== 'in_call' && status !== 'dialing' && status !== 'ringing')) && (
            <span>Ext. {extension}</span>
          )}
          {timer && (
            <span className={cn('font-semibold', t.text)}>
              {timer}
            </span>
          )}
        </div>
      </div>

      {/* Actions / menu */}
      {rightSlot && <div className="ml-2">{rightSlot}</div>}
    </div>
  );
}