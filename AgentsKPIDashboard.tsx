import { useState, useEffect } from 'react'
import { Gear, UserCircle, Phone, UserCheck, Coffee, Users, PhoneX, PhoneIncoming, PhoneOutgoing, Clock, Timer } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import type { AgentsKPIMetrics } from '@/types/kpi'
import { cn } from '@/lib/utils'

type KPICardId = 
  | 'current-logged-in'
  | 'current-on-call'
  | 'current-available'
  | 'current-on-break'
  | 'total-agents'
  | 'missed-calls-today'
  | 'answered-today'
  | 'outbound-today'
  | 'total-outbound-talking'
  | 'total-inbound-talking'

interface KPICardConfig {
  id: KPICardId
  title: string
  value: number | string
  type: 'number' | 'time'
  icon: React.ReactNode
}

interface AgentsKPIDashboardProps {
  title?: string
  metrics: AgentsKPIMetrics
  initialVisibleIds?: string[]
  storageKey?: string
  compactHeader?: boolean
  className?: string
}

const DEFAULT_STORAGE_KEY = 'dashboard.visibleCards.v1'

const ALL_CARDS: KPICardConfig[] = [
  { id: 'current-logged-in', title: 'Current Agents Logged In', value: 0, type: 'number', icon: <UserCircle size={24} /> },
  { id: 'current-on-call', title: 'Current Agents On Call', value: 0, type: 'number', icon: <Phone size={24} /> },
  { id: 'current-available', title: 'Current Agents Available', value: 0, type: 'number', icon: <UserCheck size={24} /> },
  { id: 'current-on-break', title: 'Current Agents on Break', value: 0, type: 'number', icon: <Coffee size={24} /> },
  { id: 'total-agents', title: 'Total Agents', value: 0, type: 'number', icon: <Users size={24} /> },
  { id: 'missed-calls-today', title: 'Missed Calls Today', value: 0, type: 'number', icon: <PhoneX size={24} /> },
  { id: 'answered-today', title: 'Answered Today', value: 0, type: 'number', icon: <PhoneIncoming size={24} /> },
  { id: 'outbound-today', title: 'Outbound Today', value: 0, type: 'number', icon: <PhoneOutgoing size={24} /> },
  { id: 'total-outbound-talking', title: 'Total Outbound Talking', value: '00:00:00', type: 'time', icon: <Clock size={24} /> },
  { id: 'total-inbound-talking', title: 'Total Inbound Talking', value: '00:00:00', type: 'time', icon: <Timer size={24} /> },
]

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const getVisibleCardsFromStorage = (key: string): KPICardId[] => {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored) as KPICardId[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Error reading visible cards from localStorage:', error)
  }
  return ALL_CARDS.map(card => card.id)
}

const setVisibleCardsToStorage = (key: string, cardIds: KPICardId[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(cardIds))
  } catch (error) {
    console.error('Error saving visible cards to localStorage:', error)
  }
}

export function AgentsKPIDashboard({ 
  title = 'Agent KPIs',
  metrics, 
  initialVisibleIds,
  storageKey = DEFAULT_STORAGE_KEY,
  compactHeader = false,
  className 
}: AgentsKPIDashboardProps) {
  const [visibleCardIds, setVisibleCardIds] = useState<KPICardId[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (initialVisibleIds) {
      setVisibleCardIds(initialVisibleIds as KPICardId[])
    } else {
      setVisibleCardIds(getVisibleCardsFromStorage(storageKey))
    }
  }, [])

  const handleToggleCard = (cardId: KPICardId) => {
    setVisibleCardIds((prev) => {
      const newVisibleCards = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId]
      setVisibleCardsToStorage(storageKey, newVisibleCards)
      return newVisibleCards
    })
  }

  const cards: KPICardConfig[] = [
    { id: 'current-logged-in', title: 'Current Agents Logged In', value: metrics.currentAgentsLoggedIn, type: 'number', icon: <UserCircle size={24} /> },
    { id: 'current-on-call', title: 'Current Agents On Call', value: metrics.currentAgentsOnCall, type: 'number', icon: <Phone size={24} /> },
    { id: 'current-available', title: 'Current Agents Available', value: metrics.currentAgentsAvailable, type: 'number', icon: <UserCheck size={24} /> },
    { id: 'current-on-break', title: 'Current Agents on Break', value: metrics.currentAgentsOnBreak, type: 'number', icon: <Coffee size={24} /> },
    { id: 'total-agents', title: 'Total Agents', value: metrics.totalAgents, type: 'number', icon: <Users size={24} /> },
    { id: 'missed-calls-today', title: 'Missed Calls Today', value: metrics.missedCallsToday, type: 'number', icon: <PhoneX size={24} /> },
    { id: 'answered-today', title: 'Answered Today', value: metrics.answeredToday, type: 'number', icon: <PhoneIncoming size={24} /> },
    { id: 'outbound-today', title: 'Outbound Today', value: metrics.outboundToday, type: 'number', icon: <PhoneOutgoing size={24} /> },
    { id: 'total-outbound-talking', title: 'Total Outbound Talking', value: metrics.totalOutboundTalking, type: 'time', icon: <Clock size={24} /> },
    { id: 'total-inbound-talking', title: 'Total Inbound Talking', value: metrics.totalInboundTalking, type: 'time', icon: <Timer size={24} /> },
  ]

  const visibleCards = cards.filter(card => visibleCardIds.includes(card.id))

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('flex items-center justify-between mb-6', compactHeader && 'mb-4')}>
        <h2 className={cn('text-2xl font-semibold text-foreground', compactHeader && 'text-xl')}>{title}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Gear size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] shadow-xl">
            <DialogHeader>
              <DialogTitle>Configure Visible Cards</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              {ALL_CARDS.map((card) => (
                <div key={card.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={card.id}
                    checked={visibleCardIds.includes(card.id)}
                    onCheckedChange={() => handleToggleCard(card.id)}
                  />
                  <Label
                    htmlFor={card.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {card.title}
                  </Label>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {visibleCards.map((card) => (
          <Card key={card.id} className="border border-border shadow-sm rounded-2xl flex flex-col">
            <CardHeader className="pb-2 flex-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className="text-primary shrink-0">
                  {card.icon}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <div className="text-2xl md:text-3xl font-semibold text-foreground tabular-nums">
                {card.type === 'number' ? formatNumber(card.value as number) : card.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {visibleCards.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No cards selected. Click the settings icon to configure visible cards.
        </div>
      )}
    </div>
  )
}
