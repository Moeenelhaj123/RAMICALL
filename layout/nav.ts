import { House, UsersThree, ChatCircleDots, Phone, Queue, Plugs, ChartBar, ShieldCheck, DeviceMobile, Palette, Users } from '@phosphor-icons/react'

export type NavItem = { 
  key: string
  label: string
  icon: typeof House
  to: string
}

export type NavSection = {
  key: string
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "main",
    label: "",
    items: [
      { key: "dashboard", label: "Dashboard", icon: House, to: "dashboard" },
      { key: "users", label: "Users", icon: UsersThree, to: "users" },
      { key: "groups", label: "Groups", icon: Users, to: "groups" },
      { key: "chat", label: "Chat", icon: ChatCircleDots, to: "chat" },
    ]
  },
  {
    key: "telephony",
    label: "Telephony",
    items: [
      { key: "call-history", label: "Call History", icon: Phone, to: "call-history" },
      { key: "queues", label: "Queues", icon: Queue, to: "queues" },
      { key: "trunks", label: "Trunks", icon: Plugs, to: "trunks" },
      { key: "extensions", label: "Extensions", icon: DeviceMobile, to: "extensions" },
    ]
  },
  {
    key: "analytics",
    label: "Analytics",
    items: [
      { key: "analytics/agent-performance", label: "Agent Performance", icon: ChartBar, to: "analytics/agent-performance" },
    ]
  },
  {
    key: "security",
    label: "Security",
    items: [
      { key: "security/allow-ip", label: "Allow IP", icon: ShieldCheck, to: "security/allow-ip" },
    ]
  },
  {
    key: "development",
    label: "Development",
    items: [
      { key: "ui-elements", label: "UI Elements", icon: Palette, to: "ui-elements" },
    ]
  }
]
