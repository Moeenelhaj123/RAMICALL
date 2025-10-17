import { useLayout } from "@/layout/LayoutProvider"
import { HeaderShell } from "./HeaderShell"
import { SidebarShell } from "./SidebarShell"

interface AppShellProps {
  children: React.ReactNode
  onNavigate?: (route: string) => void
}

export function AppShell({ children, onNavigate }: AppShellProps) {
  const { prefs } = useLayout()
  
  return prefs.mode === "sidebar" ? (
    <SidebarShell onNavigate={onNavigate}>{children}</SidebarShell>
  ) : (
    <HeaderShell onNavigate={onNavigate}>{children}</HeaderShell>
  )
}
