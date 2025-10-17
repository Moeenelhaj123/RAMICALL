# Layout Switcher Implementation

## Overview
Implemented a settings-driven layout system that allows users to switch between two layout modes:
1. **Header + Hamburger Drawer** (default): Top bar with slide-out navigation menu
2. **Collapsible Sidebar**: Persistent left sidebar with collapse functionality

## Features Implemented

### ✅ Settings Menu
- Settings icon (gear) next to user avatar in top bar
- Opens MUI Menu with layout options
- Shows current selection
- Provides descriptions for each layout mode
- Includes collapse toggle (disabled when not in sidebar mode)

### ✅ Layout Modes

#### Header + Drawer Mode
- Top navigation bar with hamburger menu button
- Slide-out drawer (Sheet component) from left
- Responsive width (280px on mobile, 300px on desktop)
- Search bar in header
- User avatar in header

#### Sidebar Mode
- Persistent left sidebar
- Two widths: 260px (expanded) or 72px (collapsed)
- Collapse/expand toggle button in sidebar header
- Icon-only navigation when collapsed (with tooltips)
- Search bar and user controls in top bar
- Responsive grid layout

### ✅ Persistence
- Layout mode stored in `localStorage` key: `app.layout.v1`
- Sidebar collapse state stored in: `app.sidebar.collapse.v1`
- Persists across page refreshes
- Ready for backend sync (see below)

### ✅ Navigation Configuration
- Single source of truth: `src/layout/nav.ts`
- Defines all navigation items with icons and routes
- Organized into sections (Main, Telephony, Analytics, Security)
- Both layouts render from same config

### ✅ Accessibility
- All icon buttons have `aria-label` attributes
- Sidebar has `aria-label="Sidebar navigation"`
- Drawer has `aria-label="Navigation menu"` and `id="app-drawer"`
- Focus rings on all interactive elements (`focus:ring-2`)
- Tooltips on collapsed sidebar items for discoverability
- Screen reader support (`.sr-only` class for hidden labels)

### ✅ RTL Support
- CSS Grid layout automatically handles RTL
- MUI components have built-in RTL support
- No hardcoded directional styles

## File Structure

```
src/
├── types/
│   └── layout.ts                    # LayoutMode, LayoutPrefs types
├── layout/
│   ├── LayoutProvider.tsx           # Context + localStorage persistence
│   ├── AppShell.tsx                 # Conditional renderer
│   ├── HeaderShell.tsx              # Header + Drawer mode
│   ├── SidebarShell.tsx             # Sidebar mode
│   ├── nav.ts                       # Navigation config
│   ├── index.ts                     # Barrel exports
│   └── README.md                    # Documentation
├── components/
│   └── header/
│       └── SettingsMenu.tsx         # Settings menu component
└── App.tsx                          # Updated to use layout system
```

## Key Components

### LayoutProvider
- React Context provider
- Manages layout preferences state
- Handles localStorage reads/writes
- Exports `useLayout()` hook

### useLayout Hook
```tsx
const { prefs, setMode, setSidebarCollapsed } = useLayout()
```

### AppShell
- Conditionally renders HeaderShell or SidebarShell
- Passes `onNavigate` prop through to shells
- Single integration point in App.tsx

### SettingsMenu
- MUI IconButton + Menu
- Two MenuItem options for layout modes
- Divider + Switch for sidebar collapse
- Updates via useLayout hook

## Technology Stack
- **React 19** + TypeScript
- **Tailwind CSS** for styling
- **MUI (Material-UI)**: IconButton, Menu, MenuItem, Switch, Tooltip, Divider, ListItemIcon, ListItemText
- **Phosphor Icons**: Settings, Layout, Sidebar, Caret icons
- **shadcn/ui**: Sheet (Drawer), Input, Avatar, Button, Separator

## Design Decisions

### No Animations
Per requirements, transitions use `transition-none` or instant changes. Width changes happen immediately without animation.

### localStorage vs Backend
Currently uses localStorage for instant persistence. Backend sync can be added later:

```tsx
// Future enhancement
async function syncLayoutPrefs(userId: string, prefs: LayoutPrefs) {
  await fetch(`/api/users/${userId}/preferences`, {
    method: 'PATCH',
    body: JSON.stringify(prefs)
  })
}
```

### Single Navigation Source
`NAV_SECTIONS` array in `nav.ts` ensures menu items stay consistent across both layouts. Adding/removing items updates both automatically.

### Collapsed State Behavior
When sidebar is collapsed:
- Labels hidden with `.sr-only` (accessible to screen readers)
- Icons remain visible
- Tooltips show on hover (placement="right")
- Width reduces to 72px (accommodates icon + padding)

## Testing Checklist

- [x] Settings icon visible in header
- [x] Settings menu opens on click
- [x] Can switch to sidebar layout
- [x] Can switch back to header layout
- [x] Layout persists on refresh
- [x] Sidebar collapse toggle works
- [x] Collapse state persists
- [x] All navigation items accessible in both modes
- [x] Tooltips show in collapsed sidebar
- [x] Focus rings visible on keyboard navigation
- [x] aria-labels present on interactive elements
- [x] No console errors

## Future Enhancements

1. **Backend Sync**: Add API endpoint to save/load user layout preferences
2. **Per-Route Preferences**: Remember layout per route/section
3. **Mobile Optimization**: Auto-collapse sidebar on mobile, switch to drawer
4. **Keyboard Shortcuts**: Add shortcuts for layout switching (e.g., Ctrl+B to toggle sidebar)
5. **Theme Integration**: Sync layout preference with theme preference
6. **Analytics**: Track which layout mode is more popular

## Migration Notes

### For Existing Code
The old `Header` component is no longer used. All navigation is now handled through:
- `HeaderShell` (for header+drawer mode)
- `SidebarShell` (for sidebar mode)

Both use the centralized navigation from `src/layout/nav.ts`.

### Adding New Navigation Items
Edit `src/layout/nav.ts`:

```tsx
{
  key: "my-new-page",
  label: "My New Page",
  icon: MyIcon,
  to: "my-new-page"
}
```

No other changes needed - both layouts will automatically include the new item.
