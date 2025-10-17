import type { Agent, AgentView } from '@/types/agent'
import type { UserAccount } from '@/types/users'

export function createAgentViews(agents: Agent[], users: UserAccount[]): AgentView[] {
    const userMap = new Map(users.map(u => [u.id, u]))
    
    return agents.map(agent => {
        const user = userMap.get(agent.userId)
        return {
            ...agent,
            name: user?.name || '(Unknown)',
            avatarUrl: user?.avatarUrl,
            email: user?.email,
            role: user?.role,
        }
    })
}

export function createAgentView(agent: Agent, users: UserAccount[]): AgentView {
    const user = users.find(u => u.id === agent.userId)
    return {
        ...agent,
        name: user?.name || '(Unknown)',
        avatarUrl: user?.avatarUrl,
        email: user?.email,
        role: user?.role,
    }
}
