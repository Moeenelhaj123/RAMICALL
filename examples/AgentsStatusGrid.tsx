// Example usage of the new compact agent status grid
import { AgentStatusCard } from '@/components/AgentStatusCard';
import { mapAgentStatus, getStatusLabel } from '@/lib/mapAgentStatus';

export function AgentsStatusGrid({ agents }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {agents.map(agent => {
        const displayPresence = agent.presence; // Your logic here
        
        return (
          <AgentStatusCard
            key={agent.id}
            name={agent.name}
            initials={agent.initials || getInitials(agent.name)}
            avatarUrl={agent.avatarUrl}
            extension={agent.extension}
            phone={agent.phoneNumber}
            timer={agent.timer} // "00:36:09" format
            status={mapAgentStatus(displayPresence)}
            statusLabel={getStatusLabel(displayPresence)}
            rightSlot={
              <button className="p-2 text-slate-500 hover:text-slate-700">
                ⋮
              </button>
            }
          />
        );
      })}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}