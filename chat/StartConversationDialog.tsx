import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import type { UserSummary } from '@/types/chat'
import { MagnifyingGlass } from '@phosphor-icons/react'

interface StartConversationDialogProps {
  open: boolean
  onClose: () => void
  allUsers: UserSummary[]
  me: UserSummary
  onStartDM: (userId: string) => void
  onCreateGroup: (title: string, memberIds: string[]) => void
}

export function StartConversationDialog({
  open,
  onClose,
  allUsers,
  me,
  onStartDM,
  onCreateGroup,
}: StartConversationDialogProps) {
  const [activeTab, setActiveTab] = useState<'dm' | 'group'>('dm')
  const [searchQuery, setSearchQuery] = useState('')
  const [groupTitle, setGroupTitle] = useState('')
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())

  const availableUsers = allUsers.filter((u) => u.id !== me.id)

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartDM = (userId: string) => {
    onStartDM(userId)
    handleClose()
  }

  const handleCreateGroup = () => {
    if (!groupTitle.trim() || selectedMembers.size === 0) return
    onCreateGroup(groupTitle.trim(), Array.from(selectedMembers))
    handleClose()
  }

  const handleClose = () => {
    setSearchQuery('')
    setGroupTitle('')
    setSelectedMembers(new Set())
    setActiveTab('dm')
    onClose()
  }

  const toggleMember = (userId: string) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="dialog-description">
        <DialogHeader>
          <DialogTitle>Start Conversation</DialogTitle>
        </DialogHeader>
        <p id="dialog-description" className="sr-only">
          Create a new direct message or group chat
        </p>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'dm' | 'group')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dm">Direct Message</TabsTrigger>
            <TabsTrigger value="group">Group Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="dm" className="space-y-4 mt-4">
            <div className="relative">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="search"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                id="dm-search"
                aria-label="Search users"
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleStartDM(user.id)}
                    className="w-full flex items-center gap-3 p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-300"
                    aria-label={`Start conversation with ${user.name}`}
                  >
                    <Avatar className="h-10 w-10 border border-slate-200">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="group" className="space-y-4 mt-4">
            <div>
              <Label htmlFor="group-title">Group Name</Label>
              <Input
                id="group-title"
                placeholder="e.g., Project Team"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value)}
                className="mt-1.5"
                aria-required="true"
              />
            </div>

            <div className="relative">
              <MagnifyingGlass
                size={18}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                type="search"
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                id="group-search"
                aria-label="Search members"
              />
            </div>

            <div className="max-h-[200px] overflow-y-auto border border-slate-200 rounded-lg">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className="flex items-center gap-3 p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                    htmlFor={`member-${user.id}`}
                  >
                    <Checkbox
                      id={`member-${user.id}`}
                      checked={selectedMembers.has(user.id)}
                      onCheckedChange={() => toggleMember(user.id)}
                      aria-label={`Select ${user.name}`}
                    />
                    <Avatar className="h-10 w-10 border border-slate-200">
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold text-sm">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {user.name}
                      </p>
                      {user.email && (
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={!groupTitle.trim() || selectedMembers.size === 0}
              >
                Create Group ({selectedMembers.size})
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
