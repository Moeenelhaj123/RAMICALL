import * as React from "react"
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Switch, Tooltip } from "@mui/material"
import { Gear, SquaresFour, SidebarSimple, CaretLeft } from "@phosphor-icons/react"
import { useLayout } from "@/layout/LayoutProvider"

export function SettingsMenu() {
  const { prefs, setMode, setSidebarCollapsed } = useLayout()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title="Settings">
        <IconButton 
          aria-label="Settings" 
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: 'rgb(51, 65, 85)' }}
        >
          <Gear size={20} weight="bold" />
        </IconButton>
      </Tooltip>

      <Menu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            sx: {
              minWidth: 320,
              mt: 1,
            }
          }
        }}
      >
        <MenuItem 
          selected={prefs.mode === "header"} 
          onClick={() => { 
            setMode("header")
            setAnchorEl(null)
          }}
          sx={{
            py: 1.5,
            '&.Mui-selected': {
              backgroundColor: 'rgb(248, 250, 252)',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgb(241, 245, 249)',
            }
          }}
        >
          <ListItemIcon>
            <SquaresFour size={20} weight="bold" />
          </ListItemIcon>
          <ListItemText 
            primary="Header + Hamburger Drawer" 
            secondary="Top bar with slide-out menu"
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>

        <MenuItem 
          selected={prefs.mode === "sidebar"} 
          onClick={() => {
            setMode("sidebar")
            setAnchorEl(null)
          }}
          sx={{
            py: 1.5,
            '&.Mui-selected': {
              backgroundColor: 'rgb(248, 250, 252)',
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgb(241, 245, 249)',
            }
          }}
        >
          <ListItemIcon>
            <SidebarSimple size={20} weight="bold" />
          </ListItemIcon>
          <ListItemText 
            primary="Collapsible Sidebar" 
            secondary="Always-visible left nav"
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
            secondaryTypographyProps={{ fontSize: '0.75rem' }}
          />
        </MenuItem>

        <Divider />

        <MenuItem 
          disabled={prefs.mode !== "sidebar"} 
          onClick={(e) => e.stopPropagation()}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <CaretLeft size={20} weight="bold" />
          </ListItemIcon>
          <ListItemText 
            primary="Collapse Sidebar" 
            primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
          />
          <Switch
            edge="end"
            checked={!!prefs.sidebarCollapsed}
            onChange={(e) => setSidebarCollapsed(e.target.checked)}
            disabled={prefs.mode !== "sidebar"}
          />
        </MenuItem>
      </Menu>
    </>
  )
}
