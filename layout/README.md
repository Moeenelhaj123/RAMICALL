# Layout System

This directory contains the adaptive layout system that supports two modes:
- **Header + Drawer**: Traditional top bar with hamburger menu that opens a drawer
- **Collapsible Sidebar**: Persistent left sidebar with collapse functionality

## Usage

The layout system is already integrated into the App component. Users can switch layouts via the Settings icon in the header.

## Components

### LayoutProvider
Context provider that manages layout preferences and persists to localStorage.

```tsx
import { LayoutProvider } from '@/layout/LayoutProvider'

<LayoutProvider>
  <App />
</LayoutProvider>
```

### AppShell
Main shell component that renders either HeaderShell or SidebarShell based on user preference.

```tsx
import { AppShell } from '@/layout/AppShell'

<AppShell onNavigate={handleNavigate}>
  {children}
</AppShell>
```

### useLayout Hook
Access layout preferences and controls.

```tsx
import { useLayout } from '@/layout/LayoutProvider'

const { prefs, setMode, setSidebarCollapsed } = useLayout()
```

## Navigation Config

Navigation items are defined once in `nav.ts` and used by both layout modes:

```tsx
export const NAV_SECTIONS: NavSection[] = [
  {
    key: "main",
    label: "",
    items: [
      { key: "dashboard", label: "Dashboard", icon: House, to: "dashboard" },
      // ...more items
    ]
  }
]
```

## Persistence

Layout preferences are stored in localStorage:
- `app.layout.v1`: Current layout mode ("header" | "sidebar")
- `app.sidebar.collapse.v1`: Sidebar collapse state ("0" | "1")

## Backend Integration (Future)

To sync layout preferences to user profile:

```tsx
// Add to your API client
export async function updateUserLayoutPrefs(userId: string, prefs: LayoutPrefs) {
  return await fetch(`/api/users/${userId}/prefs`, {
    method: 'PATCH',
    body: JSON.stringify({ layoutMode: prefs.mode, sidebarCollapsed: prefs.sidebarCollapsed })
  })
}
```

## Accessibility

- All interactive elements have aria-labels
- Sidebar has aria-label="Sidebar navigation"
- Focus rings on all focusable elements
- RTL-safe layout using CSS Grid
