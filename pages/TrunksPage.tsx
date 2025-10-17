import { useState, useMemo, useEffect } from 'react'
import { Plus, MagnifyingGlass, SquaresFour, Table, ArrowClockwise } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import TrunksGrid from '@/components/trunks/TrunksGrid'
import TrunksTable from '@/components/trunks/TrunksTable'
import TrunkDrawer from '@/components/trunks/TrunkDrawer'
import type { Trunk, TrunkStatus, TrunkProtocol } from '@/types/trunks'

const demoTrunks: Trunk[] = [
  { id: 'irteqa2', name: 'irteqa2', protocol: 'iax2', status: 'down' },
  { id: 'irteqa3', name: 'irteqa3', protocol: 'iax2', status: 'up', host: '141.179.24.52', port: 4569, maxChannels: 30, activeChannels: 12, latencyMs: 45, packetLossPct: 0.2, asrPct: 94.5, acdSec: 185, lastHeartbeatAt: new Date().toISOString() },
  { id: 'kinanah', name: 'kinanah', protocol: 'sip', status: 'down' },
  { id: 'Nour92', name: 'Nour 92', protocol: 'iax2', status: 'down' },
  { id: 'pbx10', name: 'pbx10', protocol: 'sip', status: 'down' },
  { id: 'pbx20', name: 'pbx20', protocol: 'sip', status: 'down' },
  { id: 'test1', name: 'test1', protocol: 'sip', status: 'up', host: '141.179.24.52', maxChannels: 20, activeChannels: 5, latencyMs: 32, packetLossPct: 0.1, asrPct: 96.2, acdSec: 210, lastHeartbeatAt: new Date().toISOString() },
  { id: 'test5', name: 'test5', protocol: 'sip', status: 'up', host: '94.99.204.230', maxChannels: 15, activeChannels: 8, latencyMs: 58, packetLossPct: 0.5, asrPct: 91.8, acdSec: 165, lastHeartbeatAt: new Date().toISOString() },
  { id: 'test6', name: 'test6', protocol: 'sip', status: 'down' },
  { id: 'uc2000', name: 'uc2000 94', protocol: 'sip', status: 'down' },
  { id: 'yosry', name: 'yosry', protocol: 'iax2', status: 'up', host: '51.36.227.138', port: 14016, maxChannels: 25, activeChannels: 3, latencyMs: 78, packetLossPct: 1.2, asrPct: 88.5, acdSec: 142, lastHeartbeatAt: new Date().toISOString() },
  { id: 'yosrytest', name: 'yosrytest', protocol: 'sip', status: 'up', host: '141.179.24.52', maxChannels: 10, activeChannels: 1, latencyMs: 41, packetLossPct: 0.3, asrPct: 95.1, acdSec: 198, lastHeartbeatAt: new Date().toISOString() },
]

const PREFS_KEY = 'trunks.prefs.v1'

type ViewMode = 'cards' | 'table'

type TrunksPrefs = {
  viewMode: ViewMode
  statusFilter: TrunkStatus | 'all'
  protocolFilter: TrunkProtocol | 'all'
  search: string
}

export default function TrunksPage() {
  const [trunks, setTrunks] = useState<Trunk[]>(demoTrunks)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTrunk, setSelectedTrunk] = useState<Trunk | null>(null)
  
  const [prefs, setPrefs] = useState<TrunksPrefs>(() => {
    try {
      const stored = localStorage.getItem(PREFS_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {}
    return {
      viewMode: 'cards' as ViewMode,
      statusFilter: 'all' as const,
      protocolFilter: 'all' as const,
      search: '',
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
    } catch {}
  }, [prefs])

  const filteredTrunks = useMemo(() => {
    let result = [...trunks]

    if (prefs.search) {
      const lower = prefs.search.toLowerCase()
      result = result.filter(
        t => t.name.toLowerCase().includes(lower) || t.host?.toLowerCase().includes(lower)
      )
    }

    if (prefs.statusFilter !== 'all') {
      result = result.filter(t => t.status === prefs.statusFilter)
    }

    if (prefs.protocolFilter !== 'all') {
      result = result.filter(t => t.protocol === prefs.protocolFilter)
    }

    return result
  }, [trunks, prefs])

  const statusCounts = useMemo(() => {
    const counts = { up: 0, down: 0, unavailable: 0 }
    trunks.forEach(t => {
      counts[t.status]++
    })
    return counts
  }, [trunks])

  const handleEdit = (id: string) => {
    const trunk = trunks.find(t => t.id === id)
    setSelectedTrunk(trunk || null)
    setDrawerOpen(true)
  }

  const handleAdd = () => {
    setSelectedTrunk(null)
    setDrawerOpen(true)
  }

  const handleSave = async (data: any) => {
    console.log('Save trunk:', data)
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const handleRefresh = async () => {
    console.log('Refresh status')
  }

  return (
    <div className="bg-white">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Trunks</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-slate-600">{trunks.length} total</span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-emerald-600">{statusCounts.up} UP</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-sm font-medium text-rose-600">{statusCounts.down} Down</span>
                </div>
                {statusCounts.unavailable > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                      <span className="text-sm font-medium text-slate-600">{statusCounts.unavailable} Unavailable</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="h-9 w-9 text-slate-600 hover:text-slate-900"
                aria-label="refresh status"
              >
                <ArrowClockwise size={18} weight="bold" />
              </Button>

              <ToggleGroup
                type="single"
                value={prefs.viewMode}
                onValueChange={(value) => {
                  if (value) setPrefs(p => ({ ...p, viewMode: value as ViewMode }))
                }}
                className="border border-slate-200 rounded-lg"
              >
                <ToggleGroupItem value="cards" aria-label="cards view" className="h-9 px-3">
                  <SquaresFour size={18} weight="bold" />
                </ToggleGroupItem>
                <ToggleGroupItem value="table" aria-label="table view" className="h-9 px-3">
                  <Table size={18} weight="bold" />
                </ToggleGroupItem>
              </ToggleGroup>

              <Button
                onClick={handleAdd}
                className="gap-2"
              >
                <Plus size={18} weight="bold" />
                Add Trunk
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <div className="relative flex-1 sm:max-w-xs">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="search"
                placeholder="Search by name or host..."
                value={prefs.search}
                onChange={(e) => setPrefs(p => ({ ...p, search: e.target.value }))}
                className="pl-10 h-10"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={prefs.statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setPrefs(p => ({ ...p, statusFilter: 'all' }))}
                className="cursor-pointer h-10 px-4 text-sm hover:bg-slate-100"
              >
                All
              </Badge>
              <Badge
                variant={prefs.statusFilter === 'up' ? 'default' : 'outline'}
                onClick={() => setPrefs(p => ({ ...p, statusFilter: 'up' }))}
                className={`cursor-pointer h-10 px-4 text-sm ${
                  prefs.statusFilter === 'up' 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                    : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                }`}
              >
                UP
              </Badge>
              <Badge
                variant={prefs.statusFilter === 'down' ? 'default' : 'outline'}
                onClick={() => setPrefs(p => ({ ...p, statusFilter: 'down' }))}
                className={`cursor-pointer h-10 px-4 text-sm ${
                  prefs.statusFilter === 'down' 
                    ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                    : 'text-rose-700 border-rose-300 hover:bg-rose-50'
                }`}
              >
                Down
              </Badge>
              <Badge
                variant={prefs.statusFilter === 'unavailable' ? 'default' : 'outline'}
                onClick={() => setPrefs(p => ({ ...p, statusFilter: 'unavailable' }))}
                className={`cursor-pointer h-10 px-4 text-sm ${
                  prefs.statusFilter === 'unavailable' 
                    ? 'bg-slate-500 hover:bg-slate-600 text-white' 
                    : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Unavailable
              </Badge>
            </div>

            <Select
              value={prefs.protocolFilter}
              onValueChange={(value) => setPrefs(p => ({ ...p, protocolFilter: value as any }))}
            >
              <SelectTrigger className="w-full sm:w-32 h-10">
                <SelectValue placeholder="Protocol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="sip">SIP</SelectItem>
                <SelectItem value="iax2">IAX2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-6">
        {prefs.viewMode === 'cards' ? (
          <TrunksGrid trunks={filteredTrunks} onEdit={handleEdit} />
        ) : (
          <TrunksTable trunks={filteredTrunks} onEdit={handleEdit} />
        )}
      </div>

      <TrunkDrawer
        open={drawerOpen}
        trunk={selectedTrunk}
        onClose={() => {
          setDrawerOpen(false)
          setSelectedTrunk(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
