import { useState, useMemo, useCallback } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { LayoutProvider } from '@/layout/LayoutProvider'
import { AppShell } from '@/layout/AppShell'
import { AgentsKPIDashboard } from '@/components/AgentsKPIDashboard'
import { AgentsStatusBoard } from '@/components/AgentsStatusBoard'
import { UsersPage } from '@/components/UsersPage'
import { CallHistoryPage } from '@/pages/CallHistoryPage'
import TrunksPage from '@/pages/TrunksPage'
import { QueuesPage } from '@/pages/QueuesPage'
import AllowIPPage from '@/pages/security/AllowIPPage'
import { ChatPage } from '@/pages/ChatPage'
import { AgentPerformancePage } from '@/pages/AgentPerformancePage'
import { GroupsPage } from '@/pages/GroupsPage'
import ExtensionsPage from '@/pages/ExtensionsPage'
import UIElementsPage from '@/pages/UIElementsPage'
import { createAgentViews } from '@/lib/agentSelectors'
import { generateMockCallHistory } from '@/lib/mockCallHistory'
import { generateMockChatData } from '@/lib/mockChatData'
import type { Agent } from '@/types/agent'
import type { AgentsKPIMetrics } from '@/types/kpi'
import type { UserAccount, CreateUserPayload, UpdateUserPayload } from '@/types/users'
import type { CallHistoryQuery, CallRecord } from '@/types/calls'
import type { AllowedIP } from '@/types/security'
import type { Conversation, Message, UserSummary } from '@/types/chat'
import type { ListConversationsQuery } from '@/api/chat'

const mockAgents: Agent[] = [
    {
        id: '1',
        userId: '1',
        extension: '1001',
        did: '+971-4-330-1001',
        presence: 'in_call',
        phoneNumber: '+971-50-123-4567',
        clientPhoneNumber: '+971-4-555-1234',
        dialStartedAt: Date.now() - 1845000,
        callAnsweredAt: Date.now() - 1680000,
        callId: 'call-abc-123',
    },
    {
        id: '2',
        userId: '2',
        extension: '1002',
        did: '+971-4-330-1002',
        presence: 'online',
        phoneNumber: '+971-50-987-6543',
        lastActivityAt: Date.now() - 360000,
    },
    {
        id: '3',
        userId: '3',
        extension: '1003',
        did: '+971-4-330-1003',
        presence: 'dialing',
        phoneNumber: '+971-50-234-5678',
        clientPhoneNumber: '+971-4-555-9876',
        dialStartedAt: Date.now() - 25000,
        callId: 'call-def-456',
    },
    {
        id: '4',
        userId: '4',
        extension: '1004',
        presence: 'break',
        phoneNumber: '+971-50-345-6789',
        breakStartedAt: Date.now() - 1200000,
    },
    {
        id: '5',
        userId: '5',
        extension: '1005',
        did: '+971-4-330-1005',
        presence: 'online',
        phoneNumber: '+971-50-456-7890',
        lastActivityAt: Date.now() - 900000,
    },
    {
        id: '6',
        userId: '6',
        extension: '1006',
        did: '+971-4-330-1006',
        presence: 'offline',
        phoneNumber: '+971-50-567-8901',
        offlineSince: Date.now() - 7200000,
    },
]

const mockUsers: UserAccount[] = [
    {
        id: '1',
        name: 'Majed Alnajar',
        email: 'majed.alnajar@example.com',
        role: 'Admin',
        avatarUrl: '',
        mobileNumber: '+971-50-123-4567',
        createdOn: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lastCall: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
    {
        id: '2',
        name: 'Rashed Alnuaimi',
        email: 'rashed.alnuaimi@example.com',
        role: 'Manager',
        mobileNumber: '+971-50-987-6543',
        createdOn: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lastCall: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
    {
        id: '3',
        name: 'Mahdi Alomari',
        email: 'mahdi.alomari@example.com',
        role: 'User',
        mobileNumber: '+971-50-234-5678',
        createdOn: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        lastCall: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
    {
        id: '4',
        name: 'Tareq Global',
        email: 'tareq.global@example.com',
        role: 'User',
        mobileNumber: '+971-50-345-6789',
        createdOn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
    {
        id: '5',
        name: 'Ruba Khamis',
        email: 'ruba.khamis@example.com',
        role: 'Manager',
        mobileNumber: '+971-50-456-7890',
        createdOn: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        lastCall: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
    {
        id: '6',
        name: 'Yousef Elhaj',
        email: 'yousef.elhaj@example.com',
        role: 'User',
        mobileNumber: '+971-50-567-8901',
        createdOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        hasPassword: true,
    },
]

const mockMetrics: AgentsKPIMetrics = {
    currentAgentsLoggedIn: 42,
    currentAgentsOnCall: 18,
    currentAgentsAvailable: 15,
    currentAgentsOnBreak: 9,
    totalAgents: 50,
    missedCallsToday: 127,
    answeredToday: 1543,
    outboundToday: 892,
    totalOutboundTalking: '14:32:18',
    totalInboundTalking: '28:45:09',
}

const mockAllowedIPs: AllowedIP[] = [
    {
        id: '1',
        cidr: '203.0.113.0/24',
        label: 'Saudi Telecom Carrier',
        scopes: ['api', 'sip'],
        tags: ['carrier', 'saudi', 'prod'],
        notes: 'Main carrier for Saudi Arabia region',
        status: 'enabled',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { id: '1', name: 'Majed Alnajar', email: 'majed.alnajar@example.com' },
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        cidr: '198.51.100.42/32',
        label: 'Office VPN Gateway',
        scopes: ['admin_ui', 'api'],
        tags: ['office', 'vpn', 'prod'],
        status: 'enabled',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { id: '2', name: 'Rashed Alnuaimi', email: 'rashed.alnuaimi@example.com' },
    },
    {
        id: '3',
        cidr: '192.0.2.128/25',
        label: 'Backup Carrier',
        scopes: ['rtp', 'sip'],
        tags: ['carrier', 'backup'],
        status: 'enabled',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { id: '5', name: 'Ruba Khamis', email: 'ruba.khamis@example.com' },
    },
    {
        id: '4',
        cidr: '2001:db8::/32',
        label: 'IPv6 Testing Range',
        scopes: ['api'],
        tags: ['test', 'ipv6'],
        status: 'disabled',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { id: '3', name: 'Mahdi Alomari', email: 'mahdi.alomari@example.com' },
    },
    {
        id: '5',
        cidr: '203.0.113.200/32',
        label: 'Webhook Service',
        scopes: ['webhook'],
        tags: ['webhook', 'automation'],
        notes: 'Third-party webhook integration service',
        status: 'enabled',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: { id: '1', name: 'Majed Alnajar', email: 'majed.alnajar@example.com' },
    },
]

type Route = 'dashboard' | 'users' | 'groups' | 'call-history' | 'trunks' | 'queues' | 'extensions' | 'security/allow-ip' | 'chat' | 'analytics/agent-performance' | 'ui-elements'

function App() {
    const [currentRoute, setCurrentRoute] = useState<Route>('dashboard')
    const [routeParams, setRouteParams] = useState<URLSearchParams>(new URLSearchParams())
    const [users, setUsers] = useState<UserAccount[]>(mockUsers)
    const [allowedIPs, setAllowedIPs] = useState<AllowedIP[]>(mockAllowedIPs)
    
    const currentUserId = '1'
    const chatUsers: UserSummary[] = useMemo(() => 
        users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            avatarUrl: u.avatarUrl,
            presence: Math.random() > 0.5 ? 'online' : Math.random() > 0.5 ? 'away' : 'offline'
        })),
        [users]
    )
    
    const { conversations: mockConversations, messagesByConv: mockMessagesByConv } = useMemo(
        () => generateMockChatData(chatUsers, currentUserId),
        [chatUsers, currentUserId]
    )
    
    const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
    const [messagesByConv, setMessagesByConv] = useState<Record<string, Message[]>>(mockMessagesByConv)
    
    const [allCallRecords] = useState<CallRecord[]>(() => generateMockCallHistory(250))
    const [callHistoryQuery, setCallHistoryQuery] = useState<CallHistoryQuery>({
        page: 0,
        pageSize: 25,
        sortBy: 'startAt',
        sortDir: 'desc',
    })

    const filteredAndSortedCalls = useMemo(() => {
        let filtered = [...allCallRecords]

        if (callHistoryQuery.search) {
            const searchLower = callHistoryQuery.search.toLowerCase()
            filtered = filtered.filter(
                (call) =>
                    call.callerNumber.toLowerCase().includes(searchLower) ||
                    call.calledNumber.toLowerCase().includes(searchLower) ||
                    call.agentName?.toLowerCase().includes(searchLower)
            )
        }

        if (callHistoryQuery.dateFrom) {
            const fromDate = new Date(callHistoryQuery.dateFrom).getTime()
            filtered = filtered.filter((call) => new Date(call.startAt).getTime() >= fromDate)
        }

        if (callHistoryQuery.dateTo) {
            const toDate = new Date(callHistoryQuery.dateTo).getTime()
            filtered = filtered.filter((call) => new Date(call.startAt).getTime() <= toDate)
        }

        if (callHistoryQuery.direction && callHistoryQuery.direction !== 'all') {
            filtered = filtered.filter((call) => call.direction === callHistoryQuery.direction)
        }

        if (callHistoryQuery.results?.length) {
            filtered = filtered.filter((call) => callHistoryQuery.results?.includes(call.result))
        }

        if (callHistoryQuery.agentIds?.length) {
            filtered = filtered.filter((call) => callHistoryQuery.agentIds?.includes(call.agentId || ''))
        }

        if (callHistoryQuery.queueIds?.length) {
            filtered = filtered.filter((call) => callHistoryQuery.queueIds?.includes(call.queueId || ''))
        }

        if (callHistoryQuery.number) {
            const normalizedQuery = callHistoryQuery.number.replace(/[^\d+]/g, '').toLowerCase()
            filtered = filtered.filter((call) => 
                call.callerNumber.replace(/[^\d+]/g, '').toLowerCase().includes(normalizedQuery) ||
                call.calledNumber.replace(/[^\d+]/g, '').toLowerCase().includes(normalizedQuery)
            )
        }

        if (callHistoryQuery.sortBy) {
            filtered.sort((a, b) => {
                const aVal = a[callHistoryQuery.sortBy!]
                const bVal = b[callHistoryQuery.sortBy!]
                
                if (aVal === undefined || aVal === null) return 1
                if (bVal === undefined || bVal === null) return -1
                
                let comparison = 0
                if (typeof aVal === 'string' && typeof bVal === 'string') {
                    comparison = aVal.localeCompare(bVal)
                } else if (typeof aVal === 'number' && typeof bVal === 'number') {
                    comparison = aVal - bVal
                }
                
                return callHistoryQuery.sortDir === 'desc' ? -comparison : comparison
            })
        }

        return filtered
    }, [allCallRecords, callHistoryQuery])

    const paginatedCalls = useMemo(() => {
        const startIdx = (callHistoryQuery.page || 0) * (callHistoryQuery.pageSize || 25)
        const endIdx = startIdx + (callHistoryQuery.pageSize || 25)
        return filteredAndSortedCalls.slice(startIdx, endIdx)
    }, [filteredAndSortedCalls, callHistoryQuery.page, callHistoryQuery.pageSize])

    const handleCallHistoryQueryChange = useCallback(async (query: CallHistoryQuery) => {
        setCallHistoryQuery(query)
    }, [])

    const handleAutoBreak = (agentId: string) => {
        console.log(`Agent ${agentId} automatically placed on break`)
    }

    const handleListen = async (agentId: string, callId?: string) => {
        console.log(`Listen to agent ${agentId}, call ${callId}`)
        await new Promise(resolve => setTimeout(resolve, 1500))
    }

    const handleWhisper = async (agentId: string, callId?: string) => {
        console.log(`Whisper to agent ${agentId}, call ${callId}`)
        await new Promise(resolve => setTimeout(resolve, 1500))
    }

    const handleConference = async (agentId: string, callId?: string) => {
        console.log(`Conference with agent ${agentId}, call ${callId}`)
        await new Promise(resolve => setTimeout(resolve, 1500))
    }

    const handleEndCall = async (agentId: string, callId?: string) => {
        console.log(`End call for agent ${agentId}, call ${callId}`)
        await new Promise(resolve => setTimeout(resolve, 1500))
    }

    const handleNavigate = (route: string) => {
        const [path, search] = route.split('?')
        setCurrentRoute(path as Route)
        setRouteParams(new URLSearchParams(search || ''))
    }

    const handleCreateUser = async (payload: CreateUserPayload) => {
        const newUser: UserAccount = {
            id: Date.now().toString(),
            name: payload.name,
            email: payload.email,
            role: payload.role,
            mobileNumber: payload.mobileNumber,
            avatarUrl: payload.avatarUrl,
            createdOn: new Date().toISOString(),
            hasPassword: !!payload.password,
        }
        setUsers((prev) => [...prev, newUser])
    }

    const handleUpdateUser = async (id: string, updates: UpdateUserPayload) => {
        setUsers((prev) =>
            prev.map((user) =>
                user.id === id
                    ? {
                          ...user,
                          ...updates,
                          hasPassword: updates.newPassword ? true : user.hasPassword,
                      }
                    : user
            )
        )
    }

    const handleDisableUser = async (id: string) => {
        setUsers((prev) =>
            prev.map((user) => (user.id === id ? { ...user, disabled: true } : user))
        )
    }

    const handleEnableUser = async (id: string) => {
        setUsers((prev) =>
            prev.map((user) => (user.id === id ? { ...user, disabled: false } : user))
        )
    }

    const handleResetPassword = async (id: string) => {
        console.log(`Password reset for user ${id}`)
    }

    const handleCreateAllowedIP = async (
        payload: Omit<AllowedIP, 'id' | 'createdAt' | 'createdBy' | 'updatedAt'>
    ) => {
        const newIP: AllowedIP = {
            id: Date.now().toString(),
            ...payload,
            createdAt: new Date().toISOString(),
            createdBy: { id: '1', name: 'Current User', email: 'current@example.com' },
        }
        setAllowedIPs((prev) => [...prev, newIP])
    }

    const handleUpdateAllowedIP = async (id: string, updates: Partial<AllowedIP>) => {
        setAllowedIPs((prev) =>
            prev.map((ip) =>
                ip.id === id
                    ? { ...ip, ...updates, updatedAt: new Date().toISOString() }
                    : ip
            )
        )
    }

    const handleDeleteAllowedIP = async (id: string) => {
        setAllowedIPs((prev) => prev.filter((ip) => ip.id !== id))
    }

    const handleBulkImportIPs = async (file: File) => {
        console.log(`Importing IPs from file: ${file.name}`)
        return { imported: 0, skipped: 0, errors: [] }
    }

    const handleChatQueryConversations = async (query: ListConversationsQuery) => {
        console.log('Query conversations:', query)
    }

    const handleChatOpenConversation = async (id: string) => {
        console.log('Open conversation:', id)
    }

    const handleChatListMessages = async (id: string) => {
        console.log('List messages for conversation:', id)
    }

    const handleChatSend = async (id: string, payload: { body?: string; attachments?: File[] }) => {
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId: id,
            sender: chatUsers.find(u => u.id === currentUserId)!,
            body: payload.body,
            createdAt: new Date().toISOString(),
            status: 'sent',
        }
        
        setMessagesByConv(prev => ({
            ...prev,
            [id]: [...(prev[id] || []), newMessage]
        }))

        setConversations(prev => 
            prev.map(c => 
                c.id === id 
                    ? { ...c, lastMessageAt: newMessage.createdAt, lastMessagePreview: payload.body }
                    : c
            )
        )
    }

    const handleChatMarkRead = async (id: string) => {
        setConversations(prev => 
            prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c)
        )
    }

    const handleChatStartDM = async (userId: string) => {
        const existingDM = conversations.find(
            c => c.type === 'dm' && c.members.some(m => m.id === userId)
        )
        
        if (existingDM) {
            console.log('DM already exists:', existingDM.id)
            return
        }

        const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            type: 'dm',
            members: [
                chatUsers.find(u => u.id === currentUserId)!,
                chatUsers.find(u => u.id === userId)!
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        
        setConversations(prev => [newConv, ...prev])
        setMessagesByConv(prev => ({ ...prev, [newConv.id]: [] }))
    }

    const handleChatCreateGroup = async (title: string, memberIds: string[]) => {
        const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            type: 'group',
            title,
            members: [
                chatUsers.find(u => u.id === currentUserId)!,
                ...memberIds.map(id => chatUsers.find(u => u.id === id)!).filter(Boolean)
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        
        setConversations(prev => [newConv, ...prev])
        setMessagesByConv(prev => ({ ...prev, [newConv.id]: [] }))
    }

    const handleChatRenameGroup = async (id: string, title: string) => {
        setConversations(prev => 
            prev.map(c => c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c)
        )
    }

    const handleChatMute = async (id: string, muted: boolean) => {
        setConversations(prev => 
            prev.map(c => c.id === id ? { ...c, muted } : c)
        )
    }

    const handleChatAddMembers = async (id: string, memberIds: string[]) => {
        console.log('Add members:', id, memberIds)
    }

    const handleChatLeaveGroup = async (id: string) => {
        setConversations(prev => prev.filter(c => c.id !== id))
    }

    const handleChatTyping = async (id: string) => {
        console.log('Typing in conversation:', id)
    }

    const agentViews = createAgentViews(mockAgents, users)
    
    const agentsOptions = useMemo(() => 
        users.map(user => ({ id: user.id, name: user.name })), 
        [users]
    )

    return (
        <LayoutProvider>
            <AppShell onNavigate={handleNavigate}>
                {currentRoute === 'dashboard' && (
                    <div className="p-6 space-y-8">
                        <AgentsStatusBoard 
                            agents={agentViews}
                            autoBreakSeconds={300}
                            onAutoBreak={handleAutoBreak}
                            onListen={handleListen}
                            onWhisper={handleWhisper}
                            onConference={handleConference}
                            onEndCall={handleEndCall}
                        />
                        <AgentsKPIDashboard metrics={mockMetrics} />
                    </div>
                )}
                {currentRoute === 'users' && (
                    <UsersPage
                        users={users}
                        onCreateUser={handleCreateUser}
                        onUpdateUser={handleUpdateUser}
                        onDisableUser={handleDisableUser}
                        onEnableUser={handleEnableUser}
                        onResetPassword={handleResetPassword}
                    />
                )}
                {currentRoute === 'groups' && (
                    <GroupsPage />
                )}
                {currentRoute === 'call-history' && (
                    <CallHistoryPage
                        rows={paginatedCalls}
                        total={filteredAndSortedCalls.length}
                        onQueryChange={handleCallHistoryQueryChange}
                        agentsOptions={agentsOptions}
                        initialNumber={routeParams.get('number') || undefined}
                    />
                )}
                {currentRoute === 'trunks' && (
                    <TrunksPage />
                )}
                {currentRoute === 'queues' && (
                    <QueuesPage users={users} />
                )}
                {currentRoute === 'extensions' && (
                    <ExtensionsPage />
                )}
                {currentRoute === 'security/allow-ip' && (
                    <AllowIPPage />
                )}
                {currentRoute === 'chat' && (
                    <ChatPage
                        me={chatUsers.find(u => u.id === currentUserId)!}
                        conversations={conversations}
                        totalConversations={conversations.length}
                        messagesByConv={messagesByConv}
                        allUsers={chatUsers}
                        onQueryConversations={handleChatQueryConversations}
                        onOpenConversation={handleChatOpenConversation}
                        onListMessages={handleChatListMessages}
                        onSend={handleChatSend}
                        onMarkRead={handleChatMarkRead}
                        onStartDM={handleChatStartDM}
                        onCreateGroup={handleChatCreateGroup}
                        onRenameGroup={handleChatRenameGroup}
                        onMute={handleChatMute}
                        onAddMembers={handleChatAddMembers}
                        onLeaveGroup={handleChatLeaveGroup}
                        onTyping={handleChatTyping}
                    />
                )}
                {currentRoute === 'analytics/agent-performance' && (
                    <AgentPerformancePage
                        users={users}
                        queueOptions={[
                            { id: 'q1', name: 'Sales Queue' },
                            { id: 'q2', name: 'Support Queue' },
                            { id: 'q3', name: 'Technical Queue' }
                        ]}
                    />
                )}
                {currentRoute === 'ui-elements' && (
                    <UIElementsPage />
                )}
            </AppShell>
            <Toaster />
        </LayoutProvider>
    )
}

export default App