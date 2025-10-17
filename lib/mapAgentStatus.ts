import { AgentStatus } from '@/ui/theme/agentStatus';
import type { DisplayPresence } from '@/types/agent';

export function mapAgentStatus(displayPresence: DisplayPresence): AgentStatus {
  switch (displayPresence) {
    case 'in_call':
      return 'in_call';
    case 'break':
    case 'break_auto':
      return 'break';
    case 'dialing':
      return 'dialing';
    case 'online':
      return 'available';
    case 'offline':
    default:
      return 'offline';
  }
}

export function getStatusLabel(displayPresence: DisplayPresence): string {
  switch (displayPresence) {
    case 'offline':
      return 'Offline';
    case 'online':
      return 'Available';
    case 'dialing':
      return 'Dialing';
    case 'in_call':
      return 'In Call';
    case 'break':
      return 'On Break';
    case 'break_auto':
      return 'On Break (Auto)';
    default:
      return 'Unknown';
  }
}