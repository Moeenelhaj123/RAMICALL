import * as React from "react"
import { IconButton, Tooltip } from "@mui/material"
import { CaretLeft, CaretRight, User, Phone } from "@phosphor-icons/react"
import { useLayout } from "@/layout/LayoutProvider"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SettingsMenu } from '@/components/header/SettingsMenu'
import { GlobalSearch } from '@/components/header/GlobalSearch'
import { NAV_SECTIONS } from './nav'

interface SidebarShellProps {
  children: React.ReactNode
  onNavigate?: (route: string) => void
}

export function SidebarShell({ children, onNavigate }: SidebarShellProps) {
  const { prefs, setSidebarCollapsed } = useLayout()
  const collapsed = !!prefs.sidebarCollapsed

  const handleNavigation = (route: string) => {
    if (onNavigate) {
      onNavigate(route)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed left-0 top-0 h-screen bg-gray-800 shadow-sm ${
          collapsed ? "w-16" : "w-64"
        }`}
        style={{ backgroundColor: '#1f2937' }}
        aria-label="Sidebar navigation"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700" style={{ backgroundColor: '#1f2937' }}>
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone size={18} weight="bold" className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">CallCenter</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <Phone size={18} weight="bold" className="text-white" />
            </div>
          )}
          
          {!collapsed && (
            <button
              onClick={() => setSidebarCollapsed(!collapsed)}
              className="p-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Collapse sidebar"
            >
              <CaretLeft size={16} weight="bold" />
            </button>
          )}
          
          {collapsed && (
            <button
              onClick={() => setSidebarCollapsed(!collapsed)}
              className="absolute -right-3 top-6 p-1.5 bg-gray-800 border border-gray-600 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#1f2937' }}
              aria-label="Expand sidebar"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className={`${collapsed ? 'px-2' : 'px-3'} space-y-1`}>
            {NAV_SECTIONS.map((section, sectionIndex) => (
              <div key={section.key} className={section.label ? "mb-6" : "mb-2"}>
                {/* Section separator for non-first sections */}
                {sectionIndex > 0 && section.label && !collapsed && (
                  <div className="mx-3 mb-4 border-t border-gray-700"></div>
                )}
                
                {section.label && !collapsed && (
                  <div className="px-3 mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.label}
                    </h3>
                  </div>
                )}
                
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    // Simple active state based on current path (you can enhance this)
                    const isActive = typeof window !== 'undefined' && window.location.pathname.includes(item.to)
                    
                    return (
                      <Tooltip 
                        key={item.key} 
                        title={collapsed ? item.label : ""} 
                        placement="right"
                        arrow
                      >
                        <button
                          onClick={() => handleNavigation(item.to)}
                          className={`
                            group w-full flex items-center rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            ${collapsed ? "px-2 py-3 justify-center" : "px-3 py-2.5"}
                            ${isActive 
                              ? "bg-blue-600 text-white" 
                              : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }
                          `}
                        >
                          <Icon 
                            size={20} 
                            weight={isActive ? "fill" : "regular"}
                            className={`
                              shrink-0 
                              ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}
                              ${!collapsed ? "mr-3" : ""}
                            `} 
                          />
                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}
                        </button>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {/* Bottom section for user info when collapsed */}
          {collapsed && (
            <div className="absolute bottom-6 left-0 right-0 px-3">
              <div className="flex justify-center">
                <Tooltip title="User Profile" placement="right" arrow>
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-600">
                    <User size={18} weight="bold" className="text-white" />
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center flex-1 max-w-lg">
            <GlobalSearch onNavigate={onNavigate} />
          </div>

          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 hidden lg:block">
              Call Center Dashboard
            </h1>
            
            <div className="flex items-center space-x-3">
              <SettingsMenu />
              
              {/* User Profile */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <Avatar className="h-10 w-10 border-2 border-gray-200 hover:border-gray-300 cursor-pointer">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    <User size={18} weight="bold" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gray-50 overflow-hidden min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
