import { useState, useEffect, useRef } from 'react'
import { AgentStatusCard } from './AgentStatusCard'
import type { AgentView, AgentsStatusBoardProps, DisplayPresence, AgentActionStatus } from '@/types/agent'
import { mapAgentStatus, getStatusLabel } from '@/lib/mapAgentStatus'
import { cn } from '@/lib/utils'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded'
import { Headphones, Microphone, Users, Phone, Circle } from '@phosphor-icons/react'

function useSecondTicker() {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 1_000_000), 1000)
    return () => clearInterval(id)
  }, [])
}

function formatDuration(startMs: number, nowMs: number): string {
  const diffSeconds = Math.floor((nowMs - startMs) / 1000)
  const hours = Math.floor(diffSeconds / 3600)
  const minutes = Math.floor((diffSeconds % 3600) / 60)
  const seconds = diffSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface AgentCardProps {
  agent: AgentView
  autoBreakSeconds: number
  onAutoBreak?: (agentId: string) => void
  onListen?: (agentId: string, callId?: string) => Promise<void>
  onWhisper?: (agentId: string, callId?: string) => Promise<void>
  onConference?: (agentId: string, callId?: string) => Promise<void>
  onEndCall?: (agentId: string, callId?: string) => Promise<void>
}

function AgentCard({ agent, autoBreakSeconds, onAutoBreak, onListen, onWhisper, onConference, onEndCall }: AgentCardProps) {
  useSecondTicker()
  const autoBreakFiredRef = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [actionState, setActionState] = useState<Partial<Record<'listen' | 'whisper' | 'conference' | 'end', AgentActionStatus>>>({})
  const menuRef = useRef<HTMLDivElement>(null)

  const handleMenuOpen = () => setMenuOpen(!menuOpen)
  const handleMenuClose = () => setMenuOpen(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleMenuClose()
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  const setPending = (key: 'listen' | 'whisper' | 'conference' | 'end', v: AgentActionStatus) => {
    setActionState((s) => ({ ...s, [key]: v }))
  }

  const canListen = (a: AgentView) =>
    (a.presence === 'dialing' || a.presence === 'in_call') && (!!a.callId || !!a.phoneNumber)

  const canWhisper = (a: AgentView) =>
    a.presence === 'in_call' && (!!a.callId || !!a.phoneNumber)

  const canConference = canWhisper

  const canEndCall = (a: AgentView) =>
    a.presence === 'dialing' || a.presence === 'in_call'

  const handleListen = async () => {
    if (!onListen || !canListen(agent)) return
    setPending('listen', 'pending')
    try {
      await onListen(agent.id, agent.callId)
      setPending('listen', 'success')
    } catch {
      setPending('listen', 'error')
    } finally {
      handleMenuClose()
      setTimeout(() => setPending('listen', 'idle'), 1000)
    }
  }

  const handleWhisper = async () => {
    if (!onWhisper || !canWhisper(agent)) return
    setPending('whisper', 'pending')
    try {
      await onWhisper(agent.id, agent.callId)
      setPending('whisper', 'success')
    } catch {
      setPending('whisper', 'error')
    } finally {
      handleMenuClose()
      setTimeout(() => setPending('whisper', 'idle'), 1000)
    }
  }

  const handleConference = async () => {
    if (!onConference || !canConference(agent)) return
    setPending('conference', 'pending')
    try {
      await onConference(agent.id, agent.callId)
      setPending('conference', 'success')
    } catch {
      setPending('conference', 'error')
    } finally {
      handleMenuClose()
      setTimeout(() => setPending('conference', 'idle'), 1000)
    }
  }

  const askEnd = () => {
    setConfirmOpen(true)
    handleMenuClose()
  }

  const handleEndCall = async () => {
    if (!onEndCall || !canEndCall(agent)) return
    setPending('end', 'pending')
    try {
      await onEndCall(agent.id, agent.callId)
      setConfirmOpen(false)
    } catch {
    } finally {
      setPending('end', 'idle')
    }
  }

  const now = Date.now()
  
  const displayPresence: DisplayPresence = (() => {
    if (agent.presence === 'online' && agent.lastActivityAt) {
      const idleSeconds = (now - agent.lastActivityAt) / 1000
      if (idleSeconds > autoBreakSeconds) {
        if (!autoBreakFiredRef.current && onAutoBreak) {
          autoBreakFiredRef.current = true
          onAutoBreak(agent.id)
        }
        return 'break_auto'
      }
    }
    autoBreakFiredRef.current = false
    return agent.presence
  })()

  // Calculate timer for current activity
  const timerStartMs = agent.presence === 'in_call' && agent.callAnsweredAt 
    ? agent.callAnsweredAt 
    : agent.dialStartedAt

  const breakStartMs = displayPresence === 'break_auto' && agent.lastActivityAt
    ? agent.lastActivityAt
    : agent.breakStartedAt

  const showCallDetails = agent.presence === 'dialing' || agent.presence === 'in_call'
  const showBreakDuration = (displayPresence === 'break' || displayPresence === 'break_auto') && breakStartMs
  const showOfflineDuration = displayPresence === 'offline' && agent.offlineSince

  let timer: string | undefined
  if (showCallDetails && timerStartMs) {
    timer = formatDuration(timerStartMs, now)
  } else if (showBreakDuration && breakStartMs) {
    timer = formatDuration(breakStartMs, now)
  } else if (showOfflineDuration && agent.offlineSince) {
    timer = formatDuration(agent.offlineSince, now)
  }

  // Actions menu component
  const actionsMenu = (
    <div className="relative" ref={menuRef}>
      <Tooltip title="More">
        <IconButton
          aria-label="agent actions"
          aria-controls={menuOpen ? `agent-menu-${agent.id}` : undefined}
          aria-haspopup="menu"
          aria-expanded={menuOpen ? 'true' : undefined}
          size="small"
          onClick={handleMenuOpen}
          sx={{ width: 32, height: 32 }}
        >
          <MoreVertRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-1 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-56 border border-border">
          {/* Agent Information Section */}
          <div className="px-4 py-3 bg-slate-50">
            <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">Agent Details</div>
            <div className="mt-1 flex items-center gap-2">
              <Phone size={14} weight="regular" className="text-slate-500" />
              <span className="text-sm font-medium text-slate-900">
                {agent.did || `Ext. ${agent.extension}`}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-100"></div>
          
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <Tooltip 
                title={!onListen ? "Not configured" : !canListen(agent) ? "Available during a live call" : ""} 
                placement="left"
                disableHoverListener={!!onListen && canListen(agent)}
              >
                <button
                  onClick={handleListen}
                  disabled={!onListen || !canListen(agent) || actionState.listen === 'pending'}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                    (!onListen || !canListen(agent) || actionState.listen === 'pending')
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  )}
                >
                  {actionState.listen === 'pending' ? (
                    <Circle size={20} className="animate-spin" />
                  ) : (
                    <Headphones size={20} weight="regular" />
                  )}
                  <span>Listen</span>
                </button>
              </Tooltip>
            </li>

            <li>
              <Tooltip 
                title={!onWhisper ? "Not configured" : !canWhisper(agent) ? "Available during a live call" : ""} 
                placement="left"
                disableHoverListener={!!onWhisper && canWhisper(agent)}
              >
                <button
                  onClick={handleWhisper}
                  disabled={!onWhisper || !canWhisper(agent) || actionState.whisper === 'pending'}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                    (!onWhisper || !canWhisper(agent) || actionState.whisper === 'pending')
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  )}
                >
                  {actionState.whisper === 'pending' ? (
                    <Circle size={20} className="animate-spin" />
                  ) : (
                    <Microphone size={20} weight="regular" />
                  )}
                  <span>Whisper</span>
                </button>
              </Tooltip>
            </li>

            <li>
              <Tooltip 
                title={!onConference ? "Not configured" : !canConference(agent) ? "Available during a live call" : ""} 
                placement="left"
                disableHoverListener={!!onConference && canConference(agent)}
              >
                <button
                  onClick={handleConference}
                  disabled={!onConference || !canConference(agent) || actionState.conference === 'pending'}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors",
                    (!onConference || !canConference(agent) || actionState.conference === 'pending')
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  )}
                >
                  {actionState.conference === 'pending' ? (
                    <Circle size={20} className="animate-spin" />
                  ) : (
                    <Users size={20} weight="regular" />
                  )}
                  <span>Conference</span>
                </button>
              </Tooltip>
            </li>

            <li>
              <Tooltip 
                title={!onEndCall ? "Not configured" : !canEndCall(agent) ? "Available during a live call" : ""} 
                placement="left"
                disableHoverListener={!!onEndCall && canEndCall(agent)}
              >
                <button
                  onClick={askEnd}
                  disabled={!onEndCall || !canEndCall(agent)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 text-left transition-colors text-red-600",
                    (!onEndCall || !canEndCall(agent))
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-red-50 cursor-pointer"
                  )}
                >
                  <Phone size={20} weight="regular" className="rotate-[135deg]" />
                  <span>End Call</span>
                </button>
              </Tooltip>
            </li>
          </ul>
        </div>
      )}

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="end-call-dialog-title"
      >
        <DialogTitle id="end-call-dialog-title">End Call?</DialogTitle>
        <DialogContent>
          <p className="text-sm text-gray-600">
            End the call for <b>{agent.name}</b> {agent.did || agent.extension ? `(${agent.did || `Ext. ${agent.extension}`})` : ''}?
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={actionState.end === 'pending'}
            onClick={handleEndCall}
            autoFocus
          >
            {actionState.end === 'pending' ? 'Ending...' : 'End Call'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )

  return (
    <AgentStatusCard
      name={agent.name}
      extension={agent.extension}
      clientPhone={agent.clientPhoneNumber} // Only show client phone during calls
      timer={timer}
      status={mapAgentStatus(displayPresence)}
      statusLabel={getStatusLabel(displayPresence)}
      avatarUrl={agent.avatarUrl}
      initials={getInitials(agent.name)}
      rightSlot={actionsMenu}
    />
  )
}

export function AgentsStatusBoard({ 
  agents, 
  autoBreakSeconds = 180, 
  onAutoBreak,
  onListen,
  onWhisper,
  onConference,
  onEndCall,
  className 
}: AgentsStatusBoardProps) {
  return (
    <div className={cn('w-full', className)}>
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        Agents Status
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            autoBreakSeconds={autoBreakSeconds}
            onAutoBreak={onAutoBreak}
            onListen={onListen}
            onWhisper={onWhisper}
            onConference={onConference}
            onEndCall={onEndCall}
          />
        ))}
      </div>
    </div>
  )
}
