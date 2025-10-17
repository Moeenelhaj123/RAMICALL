import { useState, useEffect } from 'react'
import { X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Trunk, TrunkProtocol, TrunkAuthMode, TrunkTransport } from '@/types/trunks'

type TrunkDrawerProps = {
  open: boolean
  trunk?: Trunk | null
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

const CODECS = ['G.711', 'G.729', 'Opus', 'GSM', 'iLBC']

export default function TrunkDrawer({ open, trunk, onClose, onSave }: TrunkDrawerProps) {
  const isEdit = Boolean(trunk)
  const [saving, setSaving] = useState(false)
  
  const [name, setName] = useState('')
  const [protocol, setProtocol] = useState<TrunkProtocol>('sip')
  const [host, setHost] = useState('')
  const [port, setPort] = useState<string>('')
  const [active, setActive] = useState(true)
  const [authMode, setAuthMode] = useState<TrunkAuthMode>('ip_auth')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registrar, setRegistrar] = useState('')
  const [outboundProxy, setOutboundProxy] = useState('')
  const [transport, setTransport] = useState<TrunkTransport>('udp')
  const [codecs, setCodecs] = useState<string[]>(['G.711'])
  const [maxChannels, setMaxChannels] = useState<string>('')
  const [burst, setBurst] = useState<string>('')

  useEffect(() => {
    if (trunk) {
      setName(trunk.name)
      setProtocol(trunk.protocol)
      setHost(trunk.host || '')
      setPort(trunk.port?.toString() || '')
      setActive(true)
      setMaxChannels(trunk.maxChannels?.toString() || '')
    } else {
      resetForm()
    }
  }, [trunk, open])

  const resetForm = () => {
    setName('')
    setProtocol('sip')
    setHost('')
    setPort('')
    setActive(true)
    setAuthMode('ip_auth')
    setUsername('')
    setPassword('')
    setRegistrar('')
    setOutboundProxy('')
    setTransport('udp')
    setCodecs(['G.711'])
    setMaxChannels('')
    setBurst('')
  }

  const handleSave = async () => {
    if (!name.trim() || !host.trim()) return

    setSaving(true)
    try {
      const data = {
        name: name.trim(),
        protocol,
        host: host.trim(),
        port: port ? parseInt(port, 10) : undefined,
        active,
        authMode,
        username: authMode === 'userpass' ? username : undefined,
        password: authMode === 'userpass' ? password : undefined,
        registrar: protocol === 'sip' ? registrar : undefined,
        outboundProxy: protocol === 'sip' ? outboundProxy : undefined,
        transport: protocol === 'sip' ? transport : undefined,
        codecs,
        maxChannels: maxChannels ? parseInt(maxChannels, 10) : undefined,
        burst: burst ? parseInt(burst, 10) : undefined,
      }
      await onSave(data)
      onClose()
    } catch (error) {
      console.error('Failed to save trunk:', error)
    } finally {
      setSaving(false)
    }
  }

  const toggleCodec = (codec: string) => {
    setCodecs(prev =>
      prev.includes(codec) ? prev.filter(c => c !== codec) : [...prev, codec]
    )
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-slate-50"
      >
        <div className="flex items-center justify-between px-6 h-16 bg-white border-b border-slate-200 shrink-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? 'Edit Trunk' : 'Add Trunk'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="close drawer"
          >
            <X size={20} weight="bold" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Basics</h3>
            
            <div className="space-y-2">
              <Label htmlFor="trunk-name" className="text-sm font-medium text-slate-700">
                Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="trunk-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., irteqa3"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trunk-protocol" className="text-sm font-medium text-slate-700">
                Protocol <span className="text-rose-500">*</span>
              </Label>
              <Select
                value={protocol}
                onValueChange={(value: TrunkProtocol) => {
                  setProtocol(value)
                  if (!port) {
                    setPort(value === 'sip' ? '5060' : '4569')
                  }
                }}
              >
                <SelectTrigger id="trunk-protocol" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sip">SIP</SelectItem>
                  <SelectItem value="iax2">IAX2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trunk-host" className="text-sm font-medium text-slate-700">
                  Host / IP <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="trunk-host"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g., 141.179.24.52"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunk-port" className="text-sm font-medium text-slate-700">
                  Port
                </Label>
                <Input
                  id="trunk-port"
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  placeholder={protocol === 'sip' ? '5060' : '4569'}
                  className="h-10"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <Label htmlFor="trunk-active" className="text-sm font-medium text-slate-700">
                  Active
                </Label>
                <p className="text-xs text-slate-500">Enable this trunk for calls</p>
              </div>
              <Switch
                id="trunk-active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Authentication</h3>
            
            <div className="space-y-2">
              <Label htmlFor="trunk-auth-mode" className="text-sm font-medium text-slate-700">
                Mode
              </Label>
              <Select
                value={authMode}
                onValueChange={(value: TrunkAuthMode) => setAuthMode(value)}
              >
                <SelectTrigger id="trunk-auth-mode" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ip_auth">IP Authentication</SelectItem>
                  <SelectItem value="userpass">Username/Password</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {authMode === 'userpass' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="trunk-username" className="text-sm font-medium text-slate-700">
                    Username
                  </Label>
                  <Input
                    id="trunk-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trunk-password" className="text-sm font-medium text-slate-700">
                    Password
                  </Label>
                  <Input
                    id="trunk-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10"
                  />
                </div>
              </>
            )}
          </section>

          {protocol === 'sip' && (
            <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Registration (SIP)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="trunk-registrar" className="text-sm font-medium text-slate-700">
                  Registrar / Proxy
                </Label>
                <Input
                  id="trunk-registrar"
                  value={registrar}
                  onChange={(e) => setRegistrar(e.target.value)}
                  placeholder="Optional"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunk-proxy" className="text-sm font-medium text-slate-700">
                  Outbound Proxy
                </Label>
                <Input
                  id="trunk-proxy"
                  value={outboundProxy}
                  onChange={(e) => setOutboundProxy(e.target.value)}
                  placeholder="Optional"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunk-transport" className="text-sm font-medium text-slate-700">
                  Transport
                </Label>
                <Select
                  value={transport}
                  onValueChange={(value: TrunkTransport) => setTransport(value)}
                >
                  <SelectTrigger id="trunk-transport" className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Codecs</h3>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Select Codecs
              </Label>
              <div className="flex flex-wrap gap-2">
                {CODECS.map((codec) => (
                  <Badge
                    key={codec}
                    variant={codecs.includes(codec) ? 'default' : 'outline'}
                    onClick={() => toggleCodec(codec)}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-slate-100"
                  >
                    {codec}
                  </Badge>
                ))}
              </div>
              {codecs.length > 0 && (
                <p className="text-xs text-slate-500">
                  Selected: {codecs.join(', ')}
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Capacity</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trunk-max-channels" className="text-sm font-medium text-slate-700">
                  Max Channels
                </Label>
                <Input
                  id="trunk-max-channels"
                  type="number"
                  value={maxChannels}
                  onChange={(e) => setMaxChannels(e.target.value)}
                  placeholder="e.g., 30"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trunk-burst" className="text-sm font-medium text-slate-700">
                  Burst
                </Label>
                <Input
                  id="trunk-burst"
                  type="number"
                  value={burst}
                  onChange={(e) => setBurst(e.target.value)}
                  placeholder="Optional"
                  className="h-10"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4 flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !name.trim() || !host.trim()}
          >
            {saving ? 'Saving...' : 'Save Trunk'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
