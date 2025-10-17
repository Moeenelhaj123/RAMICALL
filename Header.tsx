import { useState } from 'react'
import { List, User, House, UsersThree, X, Phone, Plugs, Queue, ShieldCheck, ChatCircleDots, ChartBar } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { GlobalSearch } from '@/components/header/GlobalSearch'

interface HeaderProps {
  onNavigate?: (route: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (route: string) => {
    setIsOpen(false)
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-4">
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              >
                <List size={24} weight="bold" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="w-[280px] sm:w-[300px] bg-white p-0 border-slate-200"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Call Center</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  aria-label="close menu"
                >
                  <X size={20} weight="bold" />
                </Button>
              </div>

              <div className="py-4">
                <nav className="flex flex-col px-3 space-y-1">
                  <button
                    onClick={() => handleNavigation('dashboard')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <House size={20} weight="bold" className="shrink-0" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('users')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <UsersThree size={20} weight="bold" className="shrink-0" />
                    <span>Users</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('chat')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <ChatCircleDots size={20} weight="bold" className="shrink-0" />
                    <span>Chat</span>
                  </button>
                  
                  <Separator className="my-2" />
                  
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Telephony</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('call-history')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <Phone size={20} weight="bold" className="shrink-0" />
                    <span>Call History</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('queues')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <Queue size={20} weight="bold" className="shrink-0" />
                    <span>Queues</span>
                  </button>
                  <button
                    onClick={() => handleNavigation('trunks')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <Plugs size={20} weight="bold" className="shrink-0" />
                    <span>Trunks</span>
                  </button>

                  <Separator className="my-2" />
                  
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analytics</p>
                  </div>
                  
                  <button
                    onClick={() => handleNavigation('analytics/agent-performance')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <ChartBar size={20} weight="bold" className="shrink-0" />
                    <span>Agent Performance</span>
                  </button>

                  <Separator className="my-2" />
                  
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Security</p>
                  </div>

                  <button
                    onClick={() => handleNavigation('security/allow-ip')}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <ShieldCheck size={20} weight="bold" className="shrink-0" />
                    <span>Allow IP</span>
                  </button>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <GlobalSearch onNavigate={onNavigate} />

          <h1 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight hidden lg:block">
            Call Center Dashboard
          </h1>
        </div>

        <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
            <User size={20} weight="bold" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
