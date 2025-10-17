import { useState } from 'react'
import { List, User, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { SettingsMenu } from '@/components/header/SettingsMenu'
import { GlobalSearch } from '@/components/header/GlobalSearch'
import { NAV_SECTIONS } from './nav'

interface HeaderShellProps {
  children: React.ReactNode
  onNavigate?: (route: string) => void
}

export function HeaderShell({ children, onNavigate }: HeaderShellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleNavigation = (route: string) => {
    setIsOpen(false)
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 h-16 gap-4">
          <div className="flex items-center gap-3 md:gap-4 flex-1">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Open menu"
                  aria-controls="app-drawer"
                >
                  <List size={24} weight="bold" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[280px] sm:w-[300px] bg-white p-0 border-slate-200"
                aria-label="Navigation menu"
                id="app-drawer"
              >
                <div className="flex items-center justify-between px-6 h-16 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-900">Call Center</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    aria-label="Close menu"
                  >
                    <X size={20} weight="bold" />
                  </Button>
                </div>

                <div className="py-4">
                  <nav className="flex flex-col px-3 space-y-1">
                    {NAV_SECTIONS.map((section) => (
                      <div key={section.key}>
                        {section.label && (
                          <div className="px-3 py-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              {section.label}
                            </p>
                          </div>
                        )}
                        {section.items.map((item) => {
                          const Icon = item.icon
                          return (
                            <button
                              key={item.key}
                              onClick={() => handleNavigation(item.to)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                              <Icon size={20} weight="bold" className="shrink-0" />
                              <span>{item.label}</span>
                            </button>
                          )
                        })}
                        {section.label && <Separator className="my-2" />}
                      </div>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <GlobalSearch onNavigate={onNavigate} />

            <h1 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight hidden lg:block">
              Call Center Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <SettingsMenu />
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-slate-200 hover:border-slate-300 cursor-pointer">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-slate-100 text-slate-700 font-semibold">
                <User size={20} weight="bold" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  )
}
